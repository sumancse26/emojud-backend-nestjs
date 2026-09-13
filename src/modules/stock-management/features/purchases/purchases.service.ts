import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { toBigInt, toDate, toNumber } from 'src/common/utils/prisma.util';
import { purchaseType } from './dto/purchase.dto';

@Injectable()
export class PurchasesService {
  constructor(private readonly prisma: PrismaService) {}

  async list(shopId: number) {
    const data = await this.prisma.purchaseMst.findMany({
      where: { shop_id: shopId },
      select: {
        id: true,
        purchase_no: true,
        purchase_date: true,
        is_submit: true,
        is_confirm: true,
        supplier: {
          select: {
            id: true,
            supplier_code: true,
            supplier_name: true,
          },
        },
        pur_tran_status: {
          select: {
            id: true,
            lookup_code: true,
            lookup_value: true,
          },
        },
      },
      orderBy: { id: 'desc' },
    });
    return { success: true, data };
  }

  async detail(id: number, shopId: number) {
    const purchaseId = BigInt(id);
    const shopIdBigInt = BigInt(shopId);

    const master = await this.prisma.purchaseMst.findFirst({
      where: {
        id: purchaseId,
        shop_id: shopIdBigInt,
        supplier: { shop_id: shopIdBigInt },
      },
      select: {
        id: true,
        purchase_no: true,
        purchase_date: true,
        shop_id: true,
        warehouse_id: true,
        total_amount: true,
        discount_amount: true,
        vat_amount: true,
        net_amount: true,
        paid_amount: true,
        due_amount: true,
        tran_status: true,
        status: true,
        is_submit: true,
        is_confirm: true,
        supplier: {
          select: {
            id: true,
            supplier_name: true,
          },
        },
      },
    });

    if (!master) {
      return null;
    }

    const purchaseDetails = await this.prisma.purchaseDtl.findMany({
      where: { purchase_mst_id: purchaseId },
      select: {
        id: true,
        product_id: true,
        qty: true,
        purchase_rate: true,
        retail_rate: true,
        sales_rate: true,
        total_amount: true,
      },
      orderBy: { id: 'asc' },
    });

    const productIds = purchaseDetails.flatMap((detail) =>
      detail.product_id === null ? [] : [detail.product_id],
    );
    const products = productIds.length
      ? await this.prisma.products.findMany({
          where: {
            id: { in: productIds },
            shop_id: shopIdBigInt,
          },
          select: {
            id: true,
            product_name: true,
            product_code: true,
          },
        })
      : [];
    const productsById = new Map(
      products.map((product) => [product.id.toString(), product]),
    );

    return {
      master: {
        id: master.id,
        purchase_no: master.purchase_no,
        purchase_date: master.purchase_date,
        shop_id: master.shop_id,
        warehouse_id: master.warehouse_id,
        supplier_id: master.supplier?.id,
        supplier_name: master.supplier?.supplier_name,
        total_amount: master.total_amount,
        discount_amount: master.discount_amount,
        vat_amount: master.vat_amount,
        net_amount: master.net_amount,
        paid_amount: master.paid_amount,
        due_amount: master.due_amount,
        tran_status: master.tran_status,
        status: master.status,
        is_submit: master.is_submit,
        is_confirm: master.is_confirm,
      },
      details: purchaseDetails.flatMap((detail) => {
        const product = detail.product_id
          ? productsById.get(detail.product_id.toString())
          : undefined;

        // Matches the SQL function's INNER JOIN PRODUCTS condition.
        return product
          ? [
              {
                id: detail.id,
                product_id: detail.product_id,
                product_name: product.product_name,
                product_code: product.product_code,
                qty: detail.qty,
                purchase_rate: detail.purchase_rate,
                retail_rate: detail.retail_rate,
                sales_rate: detail.sales_rate,
                total_amount: detail.total_amount,
              },
            ]
          : [];
      }),
    };
  }

  async save(data: purchaseType, userId?: number) {
    const purchaseId = toBigInt(data.id);
    const isUpdate = purchaseId !== undefined && purchaseId !== BigInt(0);
    const shopId = toBigInt(data.shop_id);
    const warehouseId = toBigInt(data.warehouse_id);
    const supplierId = toBigInt(data.supplier_id);

    const purchaseDate = toDate(data.purchase_date);
    const challanDate = toDate(data.challan_date);
    const totalAmount = toNumber(data.total_amount) ?? 0;
    const discountAmount = toNumber(data.discount_amount) ?? 0;
    const vatAmount = toNumber(data.vat_amount) ?? 0;
    const netAmount = toNumber(data.net_amount) ?? 0;
    const paidAmount = toNumber(data.paid_amount) ?? 0;
    const dueAmount = toNumber(data.due_amount) ?? 0;
    const isSubmit = toNumber(data.is_submit) ?? 0;
    const isConfirm = toNumber(data.is_confirm) ?? 0;
    const products: Record<string, any>[] = Array.isArray(data.products)
      ? data.products
      : [];
    const transactionStatus =
      isConfirm === 1 ? BigInt(22) : isSubmit === 1 ? BigInt(19) : BigInt(18);

    if (!shopId || !warehouseId || !supplierId) {
      return {
        response_code: 400,
        message: 'shop_id, warehouse_id, and supplier_id are required',
      };
    }

    try {
      const result = await this.prisma.$transaction(async (tx) => {
        const masterData = {
          shop_id: shopId,
          warehouse_id: warehouseId,
          supplier_id: supplierId,
          purchase_date: purchaseDate,
          total_amount: totalAmount,
          discount_amount: discountAmount,
          vat_amount: vatAmount,
          net_amount: netAmount,
          paid_amount: paidAmount,
          due_amount: dueAmount,
          is_submit: BigInt(isSubmit),
          is_confirm: BigInt(isConfirm),
          approved_by: isConfirm === 1 ? (userId ?? null) : null,
          approved_date: isConfirm === 1 ? new Date() : null,
          tran_status: transactionStatus,
          challan_no: data.challan_no ?? null,
          challan_date: challanDate,
        };

        let master = isUpdate
          ? await tx.purchaseMst.update({
              where: { id: purchaseId },
              data: {
                ...masterData,
                updated_at: new Date(),
                updated_by: userId ?? null,
              },
            })
          : await tx.purchaseMst.create({
              data: {
                ...masterData,
                created_by: userId ?? null,
              },
            });

        let purchaseNo = master.purchase_no;

        if (!isUpdate) {
          // The procedure builds PUR-XXXXXXXX from the newly assigned ID.
          purchaseNo = `PUR-${master.id.toString().padStart(8, '0')}`;
          master = await tx.purchaseMst.update({
            where: { id: master.id },
            data: { purchase_no: purchaseNo },
          });
        }

        if (dueAmount > 0 && !isUpdate) {
          await tx.suppliers.updateMany({
            where: { id: supplierId, shop_id: shopId },
            data: { previous_due: { increment: dueAmount } },
          });
        }

        for (const item of products) {
          const detailId = toBigInt(item.id);
          const productId = toBigInt(item.product_id);
          const qty = toNumber(item.qty) ?? 0;
          const purchaseRate = toNumber(item.purchase_rate) ?? 0;
          const retailRate = toNumber(item.retail_rate) ?? 0;
          const salesRate = toNumber(item.sales_rate) ?? 0;
          const detailTotal = toNumber(item.total_amount) ?? 0;

          if (!productId) {
            throw new Error('product_id is required for every purchase item');
          }

          if (!detailId || detailId === BigInt(0)) {
            await tx.purchaseDtl.create({
              data: {
                purchase_mst_id: master.id,
                product_id: productId,
                qty,
                purchase_rate: purchaseRate,
                retail_rate: retailRate,
                sales_rate: salesRate,
                total_amount: detailTotal,
                created_by: userId ?? null,
              },
            });
          } else {
            await tx.purchaseDtl.update({
              where: { id: detailId },
              data: {
                product_id: productId,
                qty,
                purchase_rate: purchaseRate,
                retail_rate: retailRate,
                sales_rate: salesRate,
                total_amount: detailTotal,
                updated_at: new Date(),
                updated_by: userId ?? null,
              },
            });
          }

          if (isConfirm === 1) {
            await tx.purchaseMst.update({
              where: { id: master.id },
              data: { tran_status: BigInt(22) },
            });

            // This update is intentionally inside the item loop to match the
            // procedure's behavior for confirmed purchases.
            if (dueAmount > 0) {
              await tx.suppliers.updateMany({
                where: { id: supplierId, shop_id: shopId },
                data: { previous_due: { increment: dueAmount } },
              });
            }

            await tx.products.update({
              where: { id: productId },
              data: {
                purchase_rate: purchaseRate,
                retail_rate: retailRate,
                sales_rate: salesRate,
                updated_at: new Date(),
                updated_by: userId ?? null,
              },
            });

            const lot = await tx.productLot.create({
              data: {
                product_id: productId,
                lot_no: `LOT-${Date.now() / 1000}`,
                purchase_rate: purchaseRate,
                retail_rate: retailRate,
                sales_rate: salesRate,
                created_by: userId ?? null,
              },
            });

            await tx.stockTransaction.create({
              data: {
                trn_date: new Date(),
                product_id: productId,
                shop_id: shopId,
                warehouse_id: warehouseId,
                lot_id: lot.id,
                transaction_type: 1,
                qty,
                purchase_rate: purchaseRate,
                retail_rate: retailRate,
                sales_rate: salesRate,
                ref_type: BigInt(1),
                ref_id: master.id,
                ref_no: purchaseNo,
                transaction_date: new Date(),
                created_by: userId ?? null,
              },
            });

            const stockMaster = await tx.stockMst.findFirst({
              where: {
                shop_id: shopId,
                warehouse_id: warehouseId,
                prod_id: productId,
              },
              select: { id: true },
            });

            const stockMasterId = stockMaster
              ? (
                  await tx.stockMst.update({
                    where: { id: stockMaster.id },
                    data: {
                      current_stock: { increment: qty },
                      updated_at: new Date(),
                      updated_by: userId ?? null,
                    },
                    select: { id: true },
                  })
                ).id
              : (
                  await tx.stockMst.create({
                    data: {
                      stock_date: new Date(),
                      shop_id: shopId,
                      warehouse_id: warehouseId,
                      prod_id: productId,
                      current_stock: qty,
                      created_by: userId ?? null,
                    },
                    select: { id: true },
                  })
                ).id;

            await tx.stockDtl.create({
              data: {
                stock_mst_id: stockMasterId,
                lot_id: lot.id,
                prod_id: productId,
                qty,
                created_by: userId ?? null,
                shop_id: shopId,
              },
            });
          }
        }

        return {
          purchase_mst_id: master.id,
          purchase_no: purchaseNo,
        };
      });

      return {
        message: 'Purchase requisition saved successfully',
        ...result,
      };
    } catch (error: any) {
      return {
        response_code: 400,
        message: error?.message ?? 'Unable to save purchase requisition',
      };
    }
  }
}
