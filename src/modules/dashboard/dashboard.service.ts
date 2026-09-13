import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async summary(shopId: number) {
    const shopIdBigInt = BigInt(shopId);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    try {
      const result = await this.prisma.$transaction(async (tx) => {
        const [
          dailySales,
          dailyPurchase,
          dailyExpense,
          monthlySales,
          monthlyPurchase,
          monthlyExpense,
          stockRows,
          dueCollection,
          activeEmployee,
        ] = await Promise.all([
          tx.invoiceMst.aggregate({
            where: {
              shop_id: shopIdBigInt,
              is_submit: BigInt(1),
              invoice_date: { gte: today, lt: tomorrow },
            },
            _sum: { net_amount: true },
          }),
          tx.purchaseMst.aggregate({
            where: {
              shop_id: shopIdBigInt,
              is_confirm: BigInt(1),
              purchase_date: { gte: today, lt: tomorrow },
            },
            _sum: { net_amount: true },
          }),
          tx.expenseMst.aggregate({
            where: {
              shop_id: shopIdBigInt,
              expense_date: { gte: today, lt: tomorrow },
            },
            _sum: { total_amount: true },
          }),
          tx.invoiceMst.aggregate({
            where: {
              shop_id: shopIdBigInt,
              is_submit: BigInt(1),
              invoice_date: { gte: monthStart, lt: tomorrow },
            },
            _sum: { net_amount: true },
          }),
          tx.purchaseMst.aggregate({
            where: {
              shop_id: shopIdBigInt,
              is_confirm: BigInt(1),
              purchase_date: { gte: monthStart, lt: tomorrow },
            },
            _sum: { net_amount: true },
          }),
          tx.expenseMst.aggregate({
            where: {
              shop_id: shopIdBigInt,
              expense_date: { gte: monthStart, lt: tomorrow },
            },
            _sum: { total_amount: true },
          }),
          tx.stockMst.findMany({
            where: { shop_id: shopIdBigInt },
            select: {
              current_stock: true,
              prod_stock: {
                select: { purchase_rate: true },
              },
            },
          }),
          tx.invoiceMst.aggregate({
            where: {
              shop_id: shopIdBigInt,
              due_amount: { gt: 0 },
            },
            _sum: { due_amount: true },
          }),
          tx.employees.count({
            where: {
              shop_id: shopIdBigInt,
              is_active: 1,
            },
          }),
        ]);

        const dailySalesAmount = Number(dailySales._sum.net_amount ?? 0);
        const dailyPurchaseAmount = Number(
          dailyPurchase._sum.net_amount ?? 0,
        );
        const dailyExpenseAmount = Number(
          dailyExpense._sum.total_amount ?? 0,
        );
        const monthlySalesAmount = Number(
          monthlySales._sum.net_amount ?? 0,
        );
        const monthlyPurchaseAmount = Number(
          monthlyPurchase._sum.net_amount ?? 0,
        );
        const monthlyExpenseAmount = Number(
          monthlyExpense._sum.total_amount ?? 0,
        );
        const stockValue = stockRows.reduce(
          (total, stock) =>
            total +
            Number(stock.current_stock ?? 0) *
              Number(stock.prod_stock?.purchase_rate ?? 0),
          0,
        );

        return {
          current_date: today.toISOString().slice(0, 10),
          month_name: today.toLocaleString('en-US', { month: 'long' }),
          data: {
            daily_summary: {
              sales: dailySalesAmount,
              purchase: dailyPurchaseAmount,
              expense: dailyExpenseAmount,
              profit: dailySalesAmount - dailyPurchaseAmount - dailyExpenseAmount,
            },
            monthly_summary: {
              sales: monthlySalesAmount,
              purchase: monthlyPurchaseAmount,
              expense: monthlyExpenseAmount,
              profit:
                monthlySalesAmount -
                monthlyPurchaseAmount -
                monthlyExpenseAmount,
            },
            stock_value: stockValue,
            due_collection: Number(dueCollection._sum.due_amount ?? 0),
            active_employee: activeEmployee,
          },
        };
      });

      return {
        response_code: 200,
        message: 'success',
        ...result,
      };
    } catch (error: any) {
      return {
        response_code: 400,
        message: error?.message ?? 'Unable to fetch dashboard summary',
      };
    }
  }

  async recent(shopId: number) {
    const shopIdBigInt = BigInt(shopId);

    try {
      const result = await this.prisma.$transaction(async (tx) => {
        const [
          invoices,
          purchases,
          activityInvoices,
          activityPurchases,
          expenses,
        ] = await Promise.all([
          tx.invoiceMst.findMany({
            where: { shop_id: shopIdBigInt },
            orderBy: { id: 'desc' },
            take: 5,
            select: {
              id: true,
              invoice_no: true,
              customer: { select: { customer_name: true } },
              net_amount: true,
              due_amount: true,
              paid_amount: true,
              created_at: true,
              created_by: true,
            },
          }),
          tx.purchaseMst.findMany({
            where: { shop_id: shopIdBigInt },
            orderBy: { id: 'desc' },
            take: 5,
            select: {
              id: true,
              purchase_no: true,
              supplier: { select: { supplier_name: true } },
              net_amount: true,
              is_confirm: true,
              is_submit: true,
              created_at: true,
              created_by: true,
            },
          }),
          tx.invoiceMst.findMany({
            where: { shop_id: shopIdBigInt },
            orderBy: { created_at: 'desc' },
            select: {
              invoice_no: true,
              created_at: true,
              created_by: true,
            },
          }),
          tx.purchaseMst.findMany({
            where: {
              shop_id: shopIdBigInt,
              is_confirm: BigInt(1),
            },
            orderBy: { created_at: 'desc' },
            select: {
              purchase_no: true,
              created_at: true,
              created_by: true,
            },
          }),
          tx.expenseMst.findMany({
            where: { shop_id: shopIdBigInt },
            orderBy: { created_at: 'desc' },
            select: {
              expense_no: true,
              created_at: true,
              created_by: true,
            },
          }),
        ]);

        const activitySources = [
          ...activityInvoices.map((invoice) => ({
            activity_type: 'Invoice',
            title:
              invoice.invoice_no === null
                ? null
                : `Invoice ${invoice.invoice_no}`,
            created_at: invoice.created_at,
            created_by: invoice.created_by,
          })),
          ...activityPurchases.map((purchase) => ({
              activity_type: 'Purchase',
              title:
                purchase.purchase_no === null
                  ? null
                  : `Purchase ${purchase.purchase_no}`,
              created_at: purchase.created_at,
              created_by: purchase.created_by,
            })),
          ...expenses.map((expense) => ({
            activity_type: 'Expense',
            title:
              expense.expense_no === null
                ? null
                : `Expense ${expense.expense_no}`,
            created_at: expense.created_at,
            created_by: expense.created_by,
          })),
        ].sort((a, b) => {
          const left = a.created_at?.getTime() ?? -Infinity;
          const right = b.created_at?.getTime() ?? -Infinity;
          return right - left;
        });

        const creatorIds = [
          ...invoices.map((invoice) => invoice.created_by),
          ...purchases.map((purchase) => purchase.created_by),
          ...expenses.map((expense) => expense.created_by),
          ...activitySources.map((activity) => activity.created_by),
        ].filter((id): id is bigint => id !== null);
        const uniqueCreatorIds = [
          ...new Map(creatorIds.map((id) => [id.toString(), id])).values(),
        ];

        const users = uniqueCreatorIds.length
          ? await tx.users.findMany({
              where: { id: { in: uniqueCreatorIds } },
              select: { id: true, employee_id: true },
            })
          : [];
        const employeeIds = users.flatMap((user) =>
          user.employee_id === null ? [] : [user.employee_id],
        );
        const employees = employeeIds.length
          ? await tx.employees.findMany({
              where: { id: { in: employeeIds } },
              select: { id: true, full_name: true },
            })
          : [];
        const employeesById = new Map(
          employees.map((employee) => [employee.id, employee.full_name]),
        );
        const creatorNames = new Map<string, string>();

        for (const user of users) {
          if (user.employee_id === null) continue;
          const fullName = employeesById.get(user.employee_id);
          if (fullName) creatorNames.set(user.id.toString(), fullName);
        }

        const formatTime = (date: Date | null) =>
          date
            ? new Intl.DateTimeFormat('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              }).format(date)
            : null;

        return {
          recent_invoice: invoices.map((invoice) => {
            const dueAmount = Number(invoice.due_amount ?? 0);
            const paidAmount = Number(invoice.paid_amount ?? 0);

            return {
              id: invoice.id,
              invoice_no: invoice.invoice_no,
              customer_name: invoice.customer.customer_name,
              amount: Number(invoice.net_amount ?? 0),
              status:
                dueAmount === 0
                  ? 'Paid'
                  : paidAmount === 0
                    ? 'Due'
                    : 'Pending',
            };
          }),
          recent_purchase: purchases
            .map((purchase) => ({
              purchase,
              createdBy: purchase.created_by
                ? creatorNames.get(purchase.created_by.toString())
                : undefined,
            }))
            .filter(({ createdBy }) => createdBy !== undefined)
            .map(({ purchase, createdBy }) => ({
              id: purchase.id,
              purchase_no: purchase.purchase_no,
              supplier_name: purchase.supplier.supplier_name,
              amount: Number(purchase.net_amount ?? 0),
              status:
                purchase.is_confirm === BigInt(1)
                  ? 'Final'
                  : purchase.is_submit === BigInt(1)
                    ? 'Submitted'
                    : 'Draft',
              created_by: createdBy,
            })),
          recent_activity: activitySources
            .map((activity) => ({
              activity,
              createdBy: activity.created_by
                ? creatorNames.get(activity.created_by.toString())
                : undefined,
            }))
            .filter(({ createdBy }) => createdBy !== undefined)
            .slice(0, 5)
            .map(({ activity, createdBy }) => ({
              activity_type: activity.activity_type,
              title: activity.title,
              activity_time: formatTime(activity.created_at),
              created_at: activity.created_at,
              created_by: createdBy,
            })),
        };
      });

      return {
        response_code: 200,
        message: 'success',
        data: result,
      };
    } catch (error: any) {
      return {
        response_code: 400,
        message: error?.message ?? 'Unable to fetch recent operations',
      };
    }
  }

  async overview(shopId: number) {
    const shopIdBigInt = BigInt(shopId);
    const now = new Date();
    const today = new Date(
      Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()),
    );
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setUTCDate(sevenDaysAgo.getUTCDate() - 6);
    const tomorrow = new Date(today);
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
    const nextMonth = new Date(
      Date.UTC(today.getUTCFullYear(), today.getUTCMonth() + 1, 1),
    );
    const monthStart = new Date(
      Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1),
    );

    try {
      const result = await this.prisma.$transaction(async (tx) => {
        const [sales, purchases, expenses, paymentGroups, expenseTotal, details] =
          await Promise.all([
            tx.invoiceMst.findMany({
              where: {
                shop_id: shopIdBigInt,
                is_submit: BigInt(1),
                invoice_date: { gte: sevenDaysAgo, lt: tomorrow },
              },
              select: { invoice_date: true, net_amount: true },
            }),
            tx.purchaseMst.findMany({
              where: {
                shop_id: shopIdBigInt,
                is_confirm: BigInt(1),
                purchase_date: { gte: sevenDaysAgo, lt: tomorrow },
              },
              select: { purchase_date: true, net_amount: true },
            }),
            tx.expenseMst.findMany({
              where: {
                shop_id: shopIdBigInt,
                expense_date: { gte: sevenDaysAgo, lt: tomorrow },
              },
              select: { expense_date: true, total_amount: true },
            }),
            tx.expenseDtl.groupBy({
              by: ['payment_method_id'],
              _sum: { amount: true },
            }),
            tx.expenseDtl.aggregate({
              _sum: { amount: true },
            }),
            tx.invoiceDtl.findMany({
              where: {
                invoiceMst: {
                  shop_id: shopIdBigInt,
                  is_submit: BigInt(1),
                  invoice_date: { gte: monthStart, lt: nextMonth },
                },
              },
              select: {
                product_id: true,
                qty: true,
                total_amount: true,
                product: { select: { product_name: true } },
              },
            }),
          ]);

        const dateKey = (date: Date) => date.toISOString().slice(0, 10);
        const sumByDate = (
          rows: Array<{ date: Date | null; amount: unknown }>,
        ) => {
          const totals = new Map<string, number>();

          for (const row of rows) {
            if (!row.date) continue;
            const key = dateKey(row.date);
            totals.set(key, (totals.get(key) ?? 0) + Number(row.amount ?? 0));
          }

          return totals;
        };

        const salesByDate = sumByDate(
          sales.map((row) => ({
            date: row.invoice_date,
            amount: row.net_amount,
          })),
        );
        const purchasesByDate = sumByDate(
          purchases.map((row) => ({
            date: row.purchase_date,
            amount: row.net_amount,
          })),
        );
        const expensesByDate = sumByDate(
          expenses.map((row) => ({
            date: row.expense_date,
            amount: row.total_amount,
          })),
        );

        const overviewChart = Array.from({ length: 7 }, (_, index) => {
          const reportDate = new Date(sevenDaysAgo);
          reportDate.setUTCDate(reportDate.getUTCDate() + index);
          const key = dateKey(reportDate);
          const salesAmount = salesByDate.get(key) ?? 0;
          const purchaseAmount = purchasesByDate.get(key) ?? 0;
          const expenseAmount = expensesByDate.get(key) ?? 0;

          return {
            report_date: reportDate.toLocaleString('en-US', {
              month: 'short',
              day: '2-digit',
              timeZone: 'UTC',
            }),
            sales: salesAmount,
            purchase: purchaseAmount,
            expense: expenseAmount,
          };
        });

        const paymentMethodIds = paymentGroups.flatMap((group) =>
          group.payment_method_id === null ? [] : [group.payment_method_id],
        );
        const paymentMethods = paymentMethodIds.length
          ? await tx.lookupDtl.findMany({
              where: { id: { in: paymentMethodIds } },
              select: { id: true, lookup_value: true },
            })
          : [];
        const paymentMethodById = new Map(
          paymentMethods.map((method) => [method.id, method.lookup_value]),
        );
        const totalExpenseAmount = Number(expenseTotal._sum.amount ?? 0);

        const paymentMethodSummary = paymentGroups.map((group) => {
          const amount = Number(group._sum.amount ?? 0);
          const percentage = totalExpenseAmount
            ? Math.round((amount / totalExpenseAmount) * 100 * 100) / 100
            : null;

          return {
            payment_method:
              group.payment_method_id === null
                ? null
                : paymentMethodById.get(group.payment_method_id) ?? null,
            amount,
            percentage,
          };
        });

        const topProducts = new Map<
          string,
          { product_id: bigint; product_name: string; qty: number; amount: number }
        >();

        for (const detail of details) {
          const key = detail.product_id.toString();
          const current = topProducts.get(key);
          const qty = Number(detail.qty ?? 0);
          const amount = Number(detail.total_amount ?? 0);

          topProducts.set(key, {
            product_id: detail.product_id,
            product_name: detail.product.product_name,
            qty: (current?.qty ?? 0) + qty,
            amount: (current?.amount ?? 0) + amount,
          });
        }

        return {
          overview_chart: overviewChart,
          payment_method_summary: paymentMethodSummary,
          top_selling_products: [...topProducts.values()]
            .sort((a, b) => b.qty - a.qty)
            .slice(0, 5),
        };
      });

      return {
        response_code: 200,
        message: 'success',
        data: result,
      };
    } catch (error: any) {
      return {
        response_code: 400,
        message: error?.message ?? 'Unable to fetch dashboard overview',
      };
    }
  }

  async stockOverview(shopId: number) {
    const shopIdBigInt = BigInt(shopId);

    try {
      const result = await this.prisma.$transaction(async (tx) => {
        const [products, stockRows] = await Promise.all([
          tx.products.findMany({
            where: { shop_id: shopIdBigInt },
            select: {
              id: true,
              product_name: true,
              min_stock_qty: true,
            },
          }),
          tx.stockMst.findMany({
            where: {
              shop_id: shopIdBigInt,
              prod_id: { not: null },
            },
            select: {
              prod_id: true,
              current_stock: true,
            },
          }),
        ]);

        const stockByProduct = new Map<string, number>();

        for (const stock of stockRows) {
          if (stock.prod_id === null) continue;

          const key = stock.prod_id.toString();
          stockByProduct.set(
            key,
            (stockByProduct.get(key) ?? 0) + Number(stock.current_stock ?? 0),
          );
        }

        const productStock = products.map((product) => ({
          product_id: product.id,
          product_name: product.product_name,
          available_stock: stockByProduct.get(product.id.toString()) ?? 0,
          min_stock_qty: Number(product.min_stock_qty ?? 0),
        }));

        const lowStockAlert = productStock
          .filter((product) => product.available_stock <= product.min_stock_qty)
          .sort((a, b) => a.available_stock - b.available_stock)
          .slice(0, 5);

        const totalItems = productStock.length;
        const inStock = productStock.filter(
          (product) => product.available_stock > product.min_stock_qty,
        ).length;
        const lowStock = productStock.filter(
          (product) =>
            product.available_stock > 0 &&
            product.available_stock <= product.min_stock_qty,
        ).length;
        const outOfStock = productStock.filter(
          (product) => product.available_stock <= 0,
        ).length;
        const percentage = (count: number) =>
          totalItems === 0
            ? null
            : Math.round((count / totalItems) * 100 * 100) / 100;

        return {
          low_stock_alert: lowStockAlert,
          stock_summary: {
            total_items: totalItems,
            in_stock: {
              count: inStock,
              percentage: percentage(inStock),
            },
            low_stock: {
              count: lowStock,
              percentage: percentage(lowStock),
            },
            out_of_stock: {
              count: outOfStock,
              percentage: percentage(outOfStock),
            },
          },
        };
      });

      return {
        response_code: 200,
        message: 'success',
        data: result,
      };
    } catch (error: any) {
      return {
        response_code: 400,
        message: error?.message ?? 'Unable to fetch stock overview',
      };
    }
  }

  async monthlySummary(shopId: number) {
    const shopIdBigInt = BigInt(shopId);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    try {
      const result = await this.prisma.$transaction(async (tx) => {
        const [
          sales,
          purchases,
          expenses,
          commission,
          stockRows,
          dueCollection,
          activeEmployee,
        ] = await Promise.all([
          tx.invoiceMst.aggregate({
            where: {
              shop_id: shopIdBigInt,
              is_submit: BigInt(1),
              invoice_date: { gte: monthStart, lt: tomorrow },
            },
            _sum: { net_amount: true },
          }),
          tx.purchaseMst.aggregate({
            where: {
              shop_id: shopIdBigInt,
              is_confirm: BigInt(1),
              purchase_date: { gte: monthStart, lt: tomorrow },
            },
            _sum: { net_amount: true },
          }),
          tx.expenseMst.aggregate({
            where: {
              shop_id: shopIdBigInt,
              expense_date: { gte: monthStart, lt: tomorrow },
            },
            _sum: { total_amount: true },
          }),
          tx.shopWiseCommissionProfit.aggregate({
            where: {
              shop_id: shopIdBigInt,
              dml_date: { gte: monthStart, lt: tomorrow },
            },
            _sum: { commission_amount: true },
          }),
          tx.stockMst.findMany({
            where: { shop_id: shopIdBigInt },
            select: {
              current_stock: true,
              prod_stock: {
                select: { purchase_rate: true },
              },
            },
          }),
          tx.invoiceMst.aggregate({
            where: {
              shop_id: shopIdBigInt,
              due_amount: { gt: 0 },
            },
            _sum: { due_amount: true },
          }),
          tx.employees.count({
            where: {
              shop_id: shopIdBigInt,
              is_active: 1,
            },
          }),
        ]);

        const totalSales = Number(sales._sum.net_amount ?? 0);
        const totalPurchase = Number(purchases._sum.net_amount ?? 0);
        const totalExpense = Number(expenses._sum.total_amount ?? 0);
        const commissionAmount = Number(
          commission._sum.commission_amount ?? 0,
        );
        const stockValue = stockRows.reduce(
          (total, stock) =>
            total +
            Number(stock.current_stock ?? 0) *
              Number(stock.prod_stock?.purchase_rate ?? 0),
          0,
        );

        return {
          month_name: today.toLocaleString('en-US', { month: 'long' }),
          data: {
            total_sales: totalSales,
            total_purchase: totalPurchase,
            total_expense: totalExpense,
            net_profit:
              totalSales + commissionAmount - totalPurchase - totalExpense,
            stock_value: stockValue,
            due_collection: Number(dueCollection._sum.due_amount ?? 0),
            active_employee: activeEmployee,
          },
        };
      });

      return {
        response_code: 200,
        message: 'success',
        ...result,
      };
    } catch (error: any) {
      return {
        response_code: 400,
        message: error?.message ?? 'Unable to fetch monthly summary',
      };
    }
  }
}
