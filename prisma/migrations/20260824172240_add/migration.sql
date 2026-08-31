/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "adm_blobs" (
    "id" BIGSERIAL NOT NULL,
    "object_type" BIGINT,
    "is_file" VARCHAR(1) NOT NULL DEFAULT 'Y',
    "file_location" VARCHAR(100),
    "blob_object" BYTEA,
    "file_name" VARCHAR(500),
    "file_ext" VARCHAR(10),
    "description" VARCHAR(500),
    "is_public" VARCHAR(1) NOT NULL DEFAULT '1',
    "parent" BIGINT,
    "img_type" VARCHAR(50),
    "file_type" BIGINT,
    "clob_obj" TEXT,
    "display_name" VARCHAR(500),
    "table_name" VARCHAR(100),
    "file_size" BIGINT,
    "status" SMALLINT DEFAULT 1,
    "created_by" BIGINT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" BIGINT,
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "adm_blobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "adm_user_session" (
    "id" BIGSERIAL NOT NULL,
    "session_id" UUID NOT NULL,
    "valid_until" TIMESTAMP(6),
    "user_id" BIGINT NOT NULL,
    "is_active" VARCHAR(1) NOT NULL DEFAULT 'Y',
    "device_mac" VARCHAR(20),
    "device_ip" VARCHAR(20),
    "logout_date" DATE,
    "status" SMALLINT DEFAULT 1,
    "created_by" BIGINT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" BIGINT,
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "adm_user_session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "aud_table" (
    "id" BIGSERIAL NOT NULL,
    "table_name" VARCHAR(100),
    "is_edit" BIGINT,
    "is_view" BIGINT,
    "is_delete" BIGINT,
    "status" BIGINT,
    "created_by" BIGINT,
    "created_at" DATE,
    "update_by" BIGINT,
    "updated_at" DATE,

    CONSTRAINT "aud_table_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company" (
    "id" BIGSERIAL NOT NULL,
    "display_code" VARCHAR(50) NOT NULL,
    "company_name" VARCHAR(200) NOT NULL,
    "address" VARCHAR(4000),
    "address_2" VARCHAR(4000),
    "phone" VARCHAR(50),
    "email" VARCHAR(100),
    "slogan" VARCHAR(4000),
    "logo" BIGINT,
    "status" SMALLINT DEFAULT 1,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "created_by" BIGINT,
    "updated_at" TIMESTAMP(6),
    "updated_by" BIGINT,

    CONSTRAINT "company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer_due" (
    "id" BIGSERIAL NOT NULL,
    "shop_id" BIGINT NOT NULL,
    "customer_id" BIGINT NOT NULL,
    "ref_type" SMALLINT,
    "ref_id" VARCHAR(50),
    "invoice_no" VARCHAR(50),
    "due_date" DATE,
    "total_amount" DECIMAL(16,4) DEFAULT 0,
    "paid_amount" DECIMAL(16,4) DEFAULT 0,
    "due_amount" DECIMAL(16,4) DEFAULT 0,
    "payment_status" SMALLINT DEFAULT 0,
    "remarks" VARCHAR(500),
    "status" SMALLINT DEFAULT 1,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "created_by" BIGINT,
    "updated_at" TIMESTAMP(6),
    "updated_by" BIGINT,

    CONSTRAINT "customer_due_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customers" (
    "id" BIGSERIAL NOT NULL,
    "shop_id" BIGINT,
    "customer_code" VARCHAR(50),
    "customer_name" VARCHAR(300) NOT NULL,
    "phone" VARCHAR(50),
    "email" VARCHAR(100),
    "address" VARCHAR(500),
    "previous_due" DECIMAL(16,4) DEFAULT 0,
    "status" SMALLINT DEFAULT 1,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "created_by" BIGINT,
    "updated_at" TIMESTAMP(6),
    "updated_by" BIGINT,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "delete_log" (
    "id" BIGSERIAL NOT NULL,
    "table_id" BIGINT,
    "table_name" TEXT,
    "row_id" BIGINT,
    "row_data" JSONB,
    "deleted_by" BIGINT,
    "deleted_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "delete_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "departments" (
    "id" BIGSERIAL NOT NULL,
    "display_code" VARCHAR(50) NOT NULL,
    "department_name" VARCHAR(200) NOT NULL,
    "status" SMALLINT DEFAULT 1,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "created_by" BIGINT,
    "updated_at" TIMESTAMP(6),
    "updated_by" BIGINT,
    "company_id" BIGINT,

    CONSTRAINT "departments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "designations" (
    "id" BIGSERIAL NOT NULL,
    "display_code" VARCHAR(50) NOT NULL,
    "designation_name" VARCHAR(200) NOT NULL,
    "status" SMALLINT DEFAULT 1,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "created_by" BIGINT,
    "updated_at" TIMESTAMP(6),
    "updated_by" BIGINT,
    "company_id" BIGINT,

    CONSTRAINT "designations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employees" (
    "id" BIGSERIAL NOT NULL,
    "employee_code" VARCHAR(50),
    "full_name" VARCHAR(200) NOT NULL,
    "phone" VARCHAR(50),
    "email" VARCHAR(100),
    "address" VARCHAR(500),
    "join_date" DATE,
    "department_id" BIGINT,
    "designation_id" BIGINT,
    "gender" BIGINT,
    "blood_group" BIGINT,
    "nid" VARCHAR(100),
    "passport_no" VARCHAR(100),
    "emp_photo" BIGINT,
    "nid_photo" BIGINT,
    "shop_id" BIGINT,
    "basic_salary" DECIMAL(16,4),
    "is_active" SMALLINT,
    "status" SMALLINT DEFAULT 1,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "created_by" BIGINT,
    "updated_at" TIMESTAMP(6),
    "updated_by" BIGINT,
    "photo_url" VARCHAR(1000),

    CONSTRAINT "employees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "expense_dtl" (
    "id" BIGSERIAL NOT NULL,
    "expense_mst_id" BIGINT NOT NULL,
    "expense_head_id" BIGINT NOT NULL,
    "amount" DECIMAL(16,4) NOT NULL,
    "payment_method_id" BIGINT,
    "remarks" VARCHAR(500),

    CONSTRAINT "expense_dtl_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "expense_mst" (
    "id" BIGSERIAL NOT NULL,
    "expense_no" VARCHAR(100),
    "shop_id" BIGINT NOT NULL,
    "expense_date" DATE NOT NULL,
    "total_amount" DECIMAL(16,4) DEFAULT 0,
    "remarks" VARCHAR(500),
    "status" SMALLINT DEFAULT 1,
    "created_by" BIGINT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "expense_mst_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feature_actions" (
    "id" BIGSERIAL NOT NULL,
    "feature_id" BIGINT,
    "action_name" VARCHAR(100),
    "action_detail" VARCHAR(500),
    "initial_roles" VARCHAR(70),
    "status" BIGINT,
    "created_by" BIGINT,
    "created_at" DATE,
    "update_by" BIGINT,
    "updated_at" DATE,

    CONSTRAINT "feature_actions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "features" (
    "id" BIGSERIAL NOT NULL,
    "feature_name" VARCHAR(200) NOT NULL,
    "module_name" VARCHAR(100),
    "route_url" VARCHAR(500),
    "status" SMALLINT DEFAULT 1,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "created_by" BIGINT,
    "updated_at" TIMESTAMP(6),
    "updated_by" BIGINT,
    "parent" BIGINT,
    "feature_icon" TEXT,

    CONSTRAINT "features_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoice_dtl" (
    "id" BIGSERIAL NOT NULL,
    "invoice_mst_id" BIGINT NOT NULL,
    "product_id" BIGINT NOT NULL,
    "qty" DECIMAL(16,4),
    "rate" DECIMAL(16,4),
    "vat_amt" DECIMAL(16,4),
    "disc_amt" DECIMAL(16,4),
    "total_amount" DECIMAL(16,4),

    CONSTRAINT "invoice_dtl_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoice_mst" (
    "id" BIGSERIAL NOT NULL,
    "invoice_no" VARCHAR(100),
    "shop_id" BIGINT NOT NULL,
    "customer_id" BIGINT NOT NULL,
    "invoice_date" DATE,
    "total_amount" DECIMAL(16,4),
    "discount_amount" DECIMAL(16,4),
    "vat_amount" DECIMAL(16,4),
    "net_amount" DECIMAL(16,4),
    "paid_amount" DECIMAL(16,4),
    "due_amount" DECIMAL(16,4),
    "approved_by" BIGINT,
    "approved_date" DATE,
    "tran_status" SMALLINT DEFAULT 0,
    "status" SMALLINT DEFAULT 1,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "created_by" BIGINT,
    "updated_at" TIMESTAMP(6),
    "updated_by" BIGINT,
    "is_submit" BIGINT,

    CONSTRAINT "invoice_mst_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lookup_dtl" (
    "id" BIGSERIAL NOT NULL,
    "lookup_mst_id" BIGINT NOT NULL,
    "lookup_code" VARCHAR(50),
    "lookup_value" VARCHAR(200) NOT NULL,
    "sort_order" BIGINT,
    "is_active" SMALLINT DEFAULT 1,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "created_by" BIGINT,
    "updated_at" TIMESTAMP(6),
    "updated_by" BIGINT,

    CONSTRAINT "lookup_dtl_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lookup_mst" (
    "id" BIGSERIAL NOT NULL,
    "lookup_name" VARCHAR(4000),
    "status" SMALLINT DEFAULT 1,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "created_by" BIGINT,
    "updated_at" TIMESTAMP(6),
    "updated_by" BIGINT,

    CONSTRAINT "lookup_mst_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_category" (
    "id" BIGSERIAL NOT NULL,
    "parent_category_id" BIGINT,
    "category_name" VARCHAR(200) NOT NULL,
    "status" SMALLINT DEFAULT 1,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "created_by" BIGINT,
    "updated_at" TIMESTAMP(6),
    "updated_by" BIGINT,
    "company_id" BIGINT,

    CONSTRAINT "product_category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_lot" (
    "id" BIGSERIAL NOT NULL,
    "product_id" BIGINT,
    "lot_no" VARCHAR(100),
    "mfg_date" DATE,
    "exp_date" DATE,
    "purchase_rate" DECIMAL(16,4),
    "retail_rate" DECIMAL(16,4),
    "sales_rate" DECIMAL(16,4),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "created_by" BIGINT,
    "updated_at" TIMESTAMP(6),
    "updated_by" BIGINT,

    CONSTRAINT "product_lot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_return_dtl" (
    "id" BIGSERIAL NOT NULL,
    "return_mst_id" BIGINT NOT NULL,
    "product_id" BIGINT NOT NULL,
    "lot_id" BIGINT,
    "qty" DECIMAL(16,4) NOT NULL,
    "rate" DECIMAL(16,4) NOT NULL,
    "discount_amount" DECIMAL(16,4) DEFAULT 0,
    "vat_amount" DECIMAL(16,4) DEFAULT 0,
    "total_amount" DECIMAL(16,4) DEFAULT 0,
    "return_reason" VARCHAR(500),
    "status" SMALLINT DEFAULT 1,

    CONSTRAINT "product_return_dtl_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_return_mst" (
    "id" BIGSERIAL NOT NULL,
    "return_no" VARCHAR(100) NOT NULL,
    "shop_id" BIGINT NOT NULL,
    "invoice_id" BIGINT NOT NULL,
    "return_date" DATE NOT NULL,
    "customer_id" BIGINT NOT NULL,
    "total_amount" DECIMAL(16,4) DEFAULT 0,
    "discount_amount" DECIMAL(16,4) DEFAULT 0,
    "vat_amount" DECIMAL(16,4) DEFAULT 0,
    "net_amount" DECIMAL(16,4) DEFAULT 0,
    "refund_amount" DECIMAL(16,4) DEFAULT 0,
    "return_reason" VARCHAR(500),
    "refund_pay_type" BIGINT,
    "is_confirm" SMALLINT DEFAULT 0,
    "status" SMALLINT DEFAULT 1,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "created_by" BIGINT,
    "updated_at" TIMESTAMP(6),
    "updated_by" BIGINT,

    CONSTRAINT "product_return_mst_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" BIGSERIAL NOT NULL,
    "shop_id" BIGINT,
    "product_code" VARCHAR(100) NOT NULL,
    "barcode" VARCHAR(200),
    "product_name" VARCHAR(300) NOT NULL,
    "category_id" BIGINT,
    "brand_id" BIGINT,
    "unit_id" BIGINT,
    "purchase_rate" DECIMAL(16,4),
    "retail_rate" DECIMAL(16,4),
    "sales_rate" DECIMAL(16,4),
    "min_stock_qty" DECIMAL(16,4),
    "is_batch_wise" SMALLINT DEFAULT 0,
    "is_expire_wise" SMALLINT DEFAULT 0,
    "status" SMALLINT DEFAULT 1,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "created_by" BIGINT,
    "updated_at" TIMESTAMP(6),
    "updated_by" BIGINT,
    "specifications" TEXT,
    "sub_category_id" BIGINT,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchase_dtl" (
    "id" BIGSERIAL NOT NULL,
    "purchase_mst_id" BIGINT,
    "product_id" BIGINT,
    "qty" DECIMAL(16,4),
    "purchase_rate" DECIMAL(16,4),
    "retail_rate" DECIMAL(16,4),
    "sales_rate" DECIMAL(16,4),
    "total_amount" DECIMAL(16,4),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "created_by" BIGINT,
    "updated_at" TIMESTAMP(6),
    "updated_by" BIGINT,

    CONSTRAINT "purchase_dtl_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchase_mst" (
    "id" BIGSERIAL NOT NULL,
    "purchase_no" VARCHAR(100),
    "shop_id" BIGINT NOT NULL,
    "warehouse_id" BIGINT NOT NULL,
    "supplier_id" BIGINT NOT NULL,
    "purchase_date" DATE,
    "total_amount" DECIMAL(16,4),
    "discount_amount" DECIMAL(16,4),
    "vat_amount" DECIMAL(16,4),
    "net_amount" DECIMAL(16,4),
    "paid_amount" DECIMAL(16,4),
    "due_amount" DECIMAL(16,4),
    "approved_by" BIGINT,
    "approved_date" DATE,
    "tran_status" SMALLINT DEFAULT 0,
    "status" SMALLINT DEFAULT 1,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "created_by" BIGINT,
    "updated_at" TIMESTAMP(6),
    "updated_by" BIGINT,
    "is_approved" BIGINT,
    "is_submit" BIGINT DEFAULT 0,
    "is_confirm" BIGINT DEFAULT 0,
    "challan_no" TEXT,
    "challan_date" DATE,

    CONSTRAINT "purchase_mst_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_features" (
    "id" BIGSERIAL NOT NULL,
    "role_id" BIGINT NOT NULL,
    "feature_id" BIGINT NOT NULL,
    "can_view" SMALLINT DEFAULT 0,
    "can_create" SMALLINT DEFAULT 0,
    "can_edit" SMALLINT DEFAULT 0,
    "can_delete" SMALLINT DEFAULT 0,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "created_by" BIGINT,
    "updated_at" TIMESTAMP(6),
    "updated_by" BIGINT,

    CONSTRAINT "role_features_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_wise_nav_permission" (
    "id" BIGSERIAL NOT NULL,
    "feature_id" BIGINT NOT NULL,
    "role_id" BIGINT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "created_by" BIGINT,
    "updated_at" TIMESTAMP(6),
    "updated_by" BIGINT,
    "company_id" BIGINT,
    "parent" BIGINT,
    "status" SMALLINT DEFAULT 1,
    "is_active" SMALLINT,

    CONSTRAINT "role_wise_nav_permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" BIGSERIAL NOT NULL,
    "short_code" VARCHAR(50) NOT NULL,
    "role_name" VARCHAR(100) NOT NULL,
    "status" SMALLINT DEFAULT 1,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "created_by" BIGINT,
    "updated_at" TIMESTAMP(6),
    "updated_by" BIGINT,
    "company_id" BIGINT,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "salary_process_dtl" (
    "id" BIGSERIAL NOT NULL,
    "salary_process_mst_id" BIGINT NOT NULL,
    "employee_id" BIGINT NOT NULL,
    "basic_salary" DECIMAL(16,4) DEFAULT 0,
    "allowance_amount" DECIMAL(16,4) DEFAULT 0,
    "bonus_amount" DECIMAL(16,4) DEFAULT 0,
    "overtime_amount" DECIMAL(16,4) DEFAULT 0,
    "deduction_amount" DECIMAL(16,4) DEFAULT 0,
    "net_salary" DECIMAL(16,4) NOT NULL,
    "paid_amount" DECIMAL(16,4) DEFAULT 0,
    "due_amount" DECIMAL(16,4) DEFAULT 0,
    "payment_date" DATE,
    "payment_method_id" BIGINT,
    "remarks" VARCHAR(500),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_by" BIGINT,
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "salary_process_dtl_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "salary_process_mst" (
    "id" BIGSERIAL NOT NULL,
    "process_no" VARCHAR(100),
    "shop_id" BIGINT,
    "salary_month" BIGINT NOT NULL,
    "salary_year" BIGINT NOT NULL,
    "process_date" DATE,
    "total_employee" BIGINT DEFAULT 0,
    "total_amount" DECIMAL(16,4) DEFAULT 0,
    "total_paid_amount" DECIMAL(16,4) DEFAULT 0,
    "total_due_amount" DECIMAL(16,4) DEFAULT 0,
    "status" SMALLINT DEFAULT 1,
    "remarks" VARCHAR(500),
    "created_by" BIGINT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_by" BIGINT,
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "salary_process_mst_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shop" (
    "id" BIGSERIAL NOT NULL,
    "company_id" BIGINT NOT NULL,
    "display_code" VARCHAR(50) NOT NULL,
    "short_code" VARCHAR(50) NOT NULL,
    "shop_name" VARCHAR(200) NOT NULL,
    "address" VARCHAR(4000),
    "address_2" VARCHAR(4000),
    "phone" VARCHAR(50),
    "image" BIGINT,
    "slogan" VARCHAR(4000),
    "status" SMALLINT DEFAULT 1,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "created_by" BIGINT,
    "updated_at" TIMESTAMP(6),
    "updated_by" BIGINT,

    CONSTRAINT "shop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shop_wise_commission_profit" (
    "id" BIGSERIAL NOT NULL,
    "shop_id" BIGINT NOT NULL,
    "year_id" BIGINT,
    "month_id" BIGINT,
    "invoice_id" BIGINT,
    "product_id" BIGINT,
    "qty" DECIMAL(16,4) DEFAULT 0,
    "purchase_rate" DECIMAL(16,4) DEFAULT 0,
    "sales_rate" DECIMAL(16,4) DEFAULT 0,
    "profit_amount" DECIMAL(16,4) DEFAULT 0,
    "commission_percent" DECIMAL(16,4) DEFAULT 0,
    "commission_amount" DECIMAL(16,4) DEFAULT 0,
    "is_received_commission" SMALLINT DEFAULT 0,
    "received_date" DATE,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "created_by" BIGINT,
    "status" SMALLINT DEFAULT 1,
    "updated_at" TIMESTAMP(6),
    "updated_by" BIGINT,
    "dml_date" DATE,

    CONSTRAINT "shop_wise_commission_profit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_dtl" (
    "id" BIGSERIAL NOT NULL,
    "stock_mst_id" BIGINT,
    "lot_id" BIGINT,
    "prod_id" BIGINT,
    "qty" DECIMAL(16,4),
    "status" SMALLINT DEFAULT 1,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "created_by" BIGINT,
    "updated_at" TIMESTAMP(6),
    "updated_by" BIGINT,
    "shop_id" BIGINT,

    CONSTRAINT "stock_dtl_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_mst" (
    "id" BIGSERIAL NOT NULL,
    "stock_date" DATE,
    "shop_id" BIGINT,
    "warehouse_id" BIGINT,
    "prod_id" BIGINT,
    "current_stock" DECIMAL(16,4),
    "status" SMALLINT DEFAULT 1,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "created_by" BIGINT,
    "updated_at" TIMESTAMP(6),
    "updated_by" BIGINT,

    CONSTRAINT "stock_mst_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_transaction" (
    "id" BIGSERIAL NOT NULL,
    "trn_date" DATE,
    "product_id" BIGINT,
    "shop_id" BIGINT,
    "warehouse_id" BIGINT,
    "lot_id" BIGINT,
    "transaction_type" SMALLINT,
    "qty" DECIMAL(16,4),
    "purchase_rate" DECIMAL(16,4),
    "retail_rate" DECIMAL(16,4),
    "sales_rate" DECIMAL(16,4),
    "ref_type" BIGINT,
    "ref_id" BIGINT,
    "ref_no" VARCHAR(100),
    "transaction_date" DATE,
    "status" SMALLINT DEFAULT 1,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "created_by" BIGINT,
    "updated_at" TIMESTAMP(6),
    "updated_by" BIGINT,

    CONSTRAINT "stock_transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "supplier_payment" (
    "id" BIGSERIAL NOT NULL,
    "payment_no" VARCHAR(100),
    "shop_id" BIGINT NOT NULL,
    "supplier_id" BIGINT NOT NULL,
    "payment_date" DATE,
    "ref_purchase_id" VARCHAR(50),
    "payment_method_id" BIGINT,
    "total_due" DECIMAL(16,4) DEFAULT 0,
    "paid_amount" DECIMAL(16,4) DEFAULT 0,
    "current_due" DECIMAL(16,4) DEFAULT 0,
    "remarks" VARCHAR(500),
    "status" SMALLINT DEFAULT 1,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "created_by" BIGINT,
    "updated_at" TIMESTAMP(6),
    "updated_by" BIGINT,

    CONSTRAINT "supplier_payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "suppliers" (
    "id" BIGSERIAL NOT NULL,
    "shop_id" BIGINT,
    "supplier_code" VARCHAR(50),
    "supplier_name" VARCHAR(300) NOT NULL,
    "phone" VARCHAR(50),
    "email" VARCHAR(100),
    "address" VARCHAR(500),
    "previous_due" DECIMAL(16,4) DEFAULT 0,
    "status" SMALLINT DEFAULT 1,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "created_by" BIGINT,
    "updated_at" TIMESTAMP(6),
    "updated_by" BIGINT,

    CONSTRAINT "suppliers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_roles" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "role_id" BIGINT NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "created_by" BIGINT,
    "updated_at" TIMESTAMP(6),
    "updated_by" BIGINT,

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_shop_permission" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "shop_id" BIGINT NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "created_by" BIGINT,
    "updated_at" TIMESTAMP(6),
    "updated_by" BIGINT,
    "company_id" BIGINT,

    CONSTRAINT "user_shop_permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" BIGSERIAL NOT NULL,
    "employee_id" BIGINT,
    "username" VARCHAR(100) NOT NULL,
    "password_hash" VARCHAR(500) NOT NULL,
    "last_login" TIMESTAMP(6),
    "status" SMALLINT DEFAULT 1,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "created_by" BIGINT,
    "updated_at" TIMESTAMP(6),
    "updated_by" BIGINT,
    "default_role_id" BIGINT,
    "company_id" BIGINT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "warehouse" (
    "id" BIGSERIAL NOT NULL,
    "shop_id" BIGINT,
    "warehouse_name" VARCHAR(200),
    "address" VARCHAR(500),
    "status" SMALLINT DEFAULT 1,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "created_by" BIGINT,
    "updated_at" TIMESTAMP(6),
    "updated_by" BIGINT,
    "company_id" BIGINT,

    CONSTRAINT "warehouse_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "company_display_code_key" ON "company"("display_code");

-- CreateIndex
CREATE UNIQUE INDEX "departments_display_code_key" ON "departments"("display_code");

-- CreateIndex
CREATE UNIQUE INDEX "designations_display_code_key" ON "designations"("display_code");

-- CreateIndex
CREATE UNIQUE INDEX "employees_employee_code_key" ON "employees"("employee_code");

-- CreateIndex
CREATE UNIQUE INDEX "expense_mst_expense_no_key" ON "expense_mst"("expense_no");

-- CreateIndex
CREATE UNIQUE INDEX "invoice_mst_invoice_no_key" ON "invoice_mst"("invoice_no");

-- CreateIndex
CREATE UNIQUE INDEX "product_return_mst_return_no_key" ON "product_return_mst"("return_no");

-- CreateIndex
CREATE UNIQUE INDEX "products_product_code_key" ON "products"("product_code");

-- CreateIndex
CREATE UNIQUE INDEX "purchase_mst_purchase_no_key" ON "purchase_mst"("purchase_no");

-- CreateIndex
CREATE UNIQUE INDEX "roles_role_name_key" ON "roles"("role_name");

-- CreateIndex
CREATE UNIQUE INDEX "salary_process_mst_process_no_key" ON "salary_process_mst"("process_no");

-- CreateIndex
CREATE UNIQUE INDEX "shop_display_code_key" ON "shop"("display_code");

-- CreateIndex
CREATE UNIQUE INDEX "supplier_payment_payment_no_key" ON "supplier_payment"("payment_no");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_designation_id_fkey" FOREIGN KEY ("designation_id") REFERENCES "designations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shop"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expense_dtl" ADD CONSTRAINT "expense_dtl_expense_head_id_fkey" FOREIGN KEY ("expense_head_id") REFERENCES "lookup_dtl"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expense_dtl" ADD CONSTRAINT "expense_dtl_expense_mst_id_fkey" FOREIGN KEY ("expense_mst_id") REFERENCES "expense_mst"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expense_dtl" ADD CONSTRAINT "expense_dtl_payment_method_id_fkey" FOREIGN KEY ("payment_method_id") REFERENCES "lookup_dtl"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expense_mst" ADD CONSTRAINT "expense_mst_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_dtl" ADD CONSTRAINT "invoice_dtl_invoice_mst_id_fkey" FOREIGN KEY ("invoice_mst_id") REFERENCES "invoice_mst"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_dtl" ADD CONSTRAINT "invoice_dtl_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_mst" ADD CONSTRAINT "invoice_mst_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_mst" ADD CONSTRAINT "invoice_mst_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lookup_dtl" ADD CONSTRAINT "lookup_dtl_lookup_mst_id_fkey" FOREIGN KEY ("lookup_mst_id") REFERENCES "lookup_mst"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_category" ADD CONSTRAINT "product_category_parent_category_id_fkey" FOREIGN KEY ("parent_category_id") REFERENCES "product_category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_lot" ADD CONSTRAINT "product_lot_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_return_dtl" ADD CONSTRAINT "product_return_dtl_return_mst_id_fkey" FOREIGN KEY ("return_mst_id") REFERENCES "product_return_mst"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "product_category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_dtl" ADD CONSTRAINT "purchase_dtl_purchase_mst_id_fkey" FOREIGN KEY ("purchase_mst_id") REFERENCES "purchase_mst"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_mst" ADD CONSTRAINT "purchase_mst_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_mst" ADD CONSTRAINT "purchase_mst_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "suppliers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_features" ADD CONSTRAINT "role_features_feature_id_fkey" FOREIGN KEY ("feature_id") REFERENCES "features"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_features" ADD CONSTRAINT "role_features_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "salary_process_dtl" ADD CONSTRAINT "salary_process_dtl_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "salary_process_dtl" ADD CONSTRAINT "salary_process_dtl_salary_process_mst_id_fkey" FOREIGN KEY ("salary_process_mst_id") REFERENCES "salary_process_mst"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "salary_process_dtl" ADD CONSTRAINT "salary_process_dtl_payment_method_id_fkey" FOREIGN KEY ("payment_method_id") REFERENCES "lookup_dtl"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "salary_process_mst" ADD CONSTRAINT "salary_process_mst_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shop"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shop" ADD CONSTRAINT "shop_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_dtl" ADD CONSTRAINT "stock_dtl_stock_mst_id_fkey" FOREIGN KEY ("stock_mst_id") REFERENCES "stock_mst"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_mst" ADD CONSTRAINT "stock_mst_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shop"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_mst" ADD CONSTRAINT "stock_mst_warehouse_id_fkey" FOREIGN KEY ("warehouse_id") REFERENCES "warehouse"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_transaction" ADD CONSTRAINT "stock_transaction_lot_id_fkey" FOREIGN KEY ("lot_id") REFERENCES "product_lot"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_transaction" ADD CONSTRAINT "stock_transaction_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_transaction" ADD CONSTRAINT "stock_transaction_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shop"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_transaction" ADD CONSTRAINT "stock_transaction_warehouse_id_fkey" FOREIGN KEY ("warehouse_id") REFERENCES "warehouse"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_shop_permission" ADD CONSTRAINT "user_shop_permission_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_shop_permission" ADD CONSTRAINT "user_shop_permission_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warehouse" ADD CONSTRAINT "warehouse_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shop"("id") ON DELETE SET NULL ON UPDATE CASCADE;
