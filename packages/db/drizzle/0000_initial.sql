-- Initial schema for the Nasij retail platform.
--
-- Hand-authored to match the Drizzle definitions in
-- `packages/db/src/schema/*.ts`. Once `pnpm --filter @nasij/db generate` is
-- run with a real DATABASE_URL, this file may be replaced by the generator;
-- the generator's output should be byte-equivalent to this.

DO $$ BEGIN
  CREATE TYPE "public"."user_role" AS ENUM ('owner','admin','manager','staff','support');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "public"."order_status" AS ENUM ('pending','paid','fulfilled','shipped','delivered','returned','refunded','cancelled');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "public"."payment_status" AS ENUM ('pending','authorized','captured','failed','refunded','partially-refunded');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "public"."fulfillment_status" AS ENUM ('unfulfilled','partial','fulfilled','returned');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "public"."product_status" AS ENUM ('draft','active','archived');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "public"."discount_type" AS ENUM ('percentage','fixed-amount','free-shipping','bogo');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "public"."channel" AS ENUM ('storefront','pos','admin','system');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "public"."address_type" AS ENUM ('shipping','billing');
EXCEPTION WHEN duplicate_object THEN null; END $$;

CREATE TABLE IF NOT EXISTS "users" (
  "id" text PRIMARY KEY,
  "email" text NOT NULL,
  "email_verified_at" text,
  "password_hash" text NOT NULL,
  "role" "user_role" NOT NULL DEFAULT 'staff',
  "name" text NOT NULL,
  "avatar_url" text,
  "two_factor_secret" text,
  "two_factor_enabled" boolean NOT NULL DEFAULT false,
  "pin_hash" text,
  "locale" text NOT NULL DEFAULT 'ar',
  "location_id" text,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now(),
  "deleted_at" timestamptz
);
CREATE UNIQUE INDEX IF NOT EXISTS "users_email_unique" ON "users" ("email");
CREATE INDEX IF NOT EXISTS "users_role_idx" ON "users" ("role");

CREATE TABLE IF NOT EXISTS "customers" (
  "id" text PRIMARY KEY,
  "email" text NOT NULL,
  "email_verified_at" text,
  "password_hash" text,
  "first_name" text,
  "last_name" text,
  "phone" text,
  "locale" text NOT NULL DEFAULT 'ar',
  "marketing_opt_in" boolean NOT NULL DEFAULT false,
  "loyalty_points" integer NOT NULL DEFAULT 0,
  "loyalty_tier" text NOT NULL DEFAULT 'bronze',
  "notes" text,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now(),
  "deleted_at" timestamptz
);
CREATE UNIQUE INDEX IF NOT EXISTS "customers_email_unique" ON "customers" ("email");
CREATE INDEX IF NOT EXISTS "customers_phone_idx" ON "customers" ("phone");

CREATE TABLE IF NOT EXISTS "addresses" (
  "id" text PRIMARY KEY,
  "customer_id" text NOT NULL REFERENCES "customers" ("id") ON DELETE CASCADE,
  "type" "address_type" NOT NULL,
  "full_name" text NOT NULL,
  "company" text,
  "line1" text NOT NULL,
  "line2" text,
  "city" text NOT NULL,
  "region" text,
  "postal_code" text,
  "country_code" text NOT NULL DEFAULT 'EG',
  "phone" text,
  "is_default" boolean NOT NULL DEFAULT false,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "addresses_customer_idx" ON "addresses" ("customer_id");

CREATE TABLE IF NOT EXISTS "categories" (
  "id" text PRIMARY KEY,
  "slug" text NOT NULL,
  "name_ar" text NOT NULL,
  "name_en" text NOT NULL,
  "description_ar" text,
  "description_en" text,
  "parent_id" text,
  "position" integer NOT NULL DEFAULT 0,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS "categories_slug_unique" ON "categories" ("slug");

CREATE TABLE IF NOT EXISTS "products" (
  "id" text PRIMARY KEY,
  "slug" text NOT NULL,
  "sku" text NOT NULL,
  "title_ar" text NOT NULL,
  "title_en" text NOT NULL,
  "description_ar" text,
  "description_en" text,
  "status" "product_status" NOT NULL DEFAULT 'draft',
  "category_id" text REFERENCES "categories" ("id") ON DELETE SET NULL,
  "base_price_minor" integer NOT NULL,
  "compare_at_price_minor" integer,
  "currency" text NOT NULL DEFAULT 'EGP',
  "is_featured" boolean NOT NULL DEFAULT false,
  "seo" jsonb,
  "published_at" text,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now(),
  "deleted_at" timestamptz
);
CREATE UNIQUE INDEX IF NOT EXISTS "products_slug_unique" ON "products" ("slug");
CREATE UNIQUE INDEX IF NOT EXISTS "products_sku_unique" ON "products" ("sku");
CREATE INDEX IF NOT EXISTS "products_status_idx" ON "products" ("status");
CREATE INDEX IF NOT EXISTS "products_category_idx" ON "products" ("category_id");

CREATE TABLE IF NOT EXISTS "product_images" (
  "id" text PRIMARY KEY,
  "product_id" text NOT NULL REFERENCES "products" ("id") ON DELETE CASCADE,
  "url" text NOT NULL,
  "alt_ar" text,
  "alt_en" text,
  "position" integer NOT NULL DEFAULT 0,
  "width" integer,
  "height" integer,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "product_images_product_idx" ON "product_images" ("product_id");

CREATE TABLE IF NOT EXISTS "variants" (
  "id" text PRIMARY KEY,
  "product_id" text NOT NULL REFERENCES "products" ("id") ON DELETE CASCADE,
  "sku" text NOT NULL,
  "size" text,
  "color" text,
  "attributes" jsonb NOT NULL DEFAULT '{}'::jsonb,
  "price_minor" integer,
  "compare_at_price_minor" integer,
  "weight_grams" integer,
  "barcode" text,
  "image_url" text,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now(),
  "deleted_at" timestamptz
);
CREATE UNIQUE INDEX IF NOT EXISTS "variants_sku_unique" ON "variants" ("sku");
CREATE INDEX IF NOT EXISTS "variants_product_idx" ON "variants" ("product_id");
CREATE INDEX IF NOT EXISTS "variants_barcode_idx" ON "variants" ("barcode");

CREATE TABLE IF NOT EXISTS "locations" (
  "id" text PRIMARY KEY,
  "name" text NOT NULL,
  "type" text NOT NULL DEFAULT 'store',
  "address" text,
  "timezone" text NOT NULL DEFAULT 'Africa/Cairo',
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS "locations_name_unique" ON "locations" ("name");

CREATE TABLE IF NOT EXISTS "inventory_levels" (
  "id" text PRIMARY KEY,
  "variant_id" text NOT NULL REFERENCES "variants" ("id") ON DELETE CASCADE,
  "location_id" text NOT NULL REFERENCES "locations" ("id") ON DELETE CASCADE,
  "available" integer NOT NULL DEFAULT 0,
  "reserved" integer NOT NULL DEFAULT 0,
  "reorder_point" integer NOT NULL DEFAULT 0,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS "inventory_variant_location_unique" ON "inventory_levels" ("variant_id", "location_id");
CREATE INDEX IF NOT EXISTS "inventory_variant_idx" ON "inventory_levels" ("variant_id");
CREATE INDEX IF NOT EXISTS "inventory_location_idx" ON "inventory_levels" ("location_id");

CREATE TABLE IF NOT EXISTS "stock_movements" (
  "id" text PRIMARY KEY,
  "variant_id" text NOT NULL REFERENCES "variants" ("id") ON DELETE CASCADE,
  "location_id" text NOT NULL REFERENCES "locations" ("id") ON DELETE CASCADE,
  "quantity" integer NOT NULL,
  "reason" text NOT NULL,
  "reference_id" text,
  "note" text,
  "occurred_at" timestamptz NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "stock_movements_variant_idx" ON "stock_movements" ("variant_id");
CREATE INDEX IF NOT EXISTS "stock_movements_location_idx" ON "stock_movements" ("location_id");
CREATE INDEX IF NOT EXISTS "stock_movements_reason_idx" ON "stock_movements" ("reason");

CREATE TABLE IF NOT EXISTS "orders" (
  "id" text PRIMARY KEY,
  "number" text NOT NULL,
  "customer_id" text REFERENCES "customers" ("id") ON DELETE SET NULL,
  "staff_id" text REFERENCES "users" ("id") ON DELETE SET NULL,
  "location_id" text REFERENCES "locations" ("id") ON DELETE SET NULL,
  "channel" "channel" NOT NULL DEFAULT 'storefront',
  "status" "order_status" NOT NULL DEFAULT 'pending',
  "payment_status" "payment_status" NOT NULL DEFAULT 'pending',
  "fulfillment_status" "fulfillment_status" NOT NULL DEFAULT 'unfulfilled',
  "currency" text NOT NULL DEFAULT 'EGP',
  "subtotal_minor" integer NOT NULL,
  "discount_minor" integer NOT NULL DEFAULT 0,
  "shipping_minor" integer NOT NULL DEFAULT 0,
  "tax_minor" integer NOT NULL DEFAULT 0,
  "total_minor" integer NOT NULL,
  "notes_internal" text,
  "notes_customer" text,
  "shipping_address" jsonb,
  "billing_address" jsonb,
  "placed_at" timestamptz NOT NULL,
  "paid_at" timestamptz,
  "shipped_at" timestamptz,
  "delivered_at" timestamptz,
  "cancelled_at" timestamptz,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS "orders_number_unique" ON "orders" ("number");
CREATE INDEX IF NOT EXISTS "orders_customer_idx" ON "orders" ("customer_id");
CREATE INDEX IF NOT EXISTS "orders_status_idx" ON "orders" ("status");
CREATE INDEX IF NOT EXISTS "orders_placed_at_idx" ON "orders" ("placed_at");

CREATE TABLE IF NOT EXISTS "order_items" (
  "id" text PRIMARY KEY,
  "order_id" text NOT NULL REFERENCES "orders" ("id") ON DELETE CASCADE,
  "variant_id" text REFERENCES "variants" ("id") ON DELETE SET NULL,
  "title_ar" text NOT NULL,
  "title_en" text NOT NULL,
  "sku" text NOT NULL,
  "quantity" integer NOT NULL,
  "unit_price_minor" integer NOT NULL,
  "discount_minor" integer NOT NULL DEFAULT 0,
  "total_minor" integer NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "order_items_order_idx" ON "order_items" ("order_id");

CREATE TABLE IF NOT EXISTS "payments" (
  "id" text PRIMARY KEY,
  "order_id" text NOT NULL REFERENCES "orders" ("id") ON DELETE CASCADE,
  "provider" text NOT NULL,
  "provider_ref" text,
  "status" "payment_status" NOT NULL DEFAULT 'pending',
  "amount_minor" integer NOT NULL,
  "currency" text NOT NULL DEFAULT 'EGP',
  "payload" jsonb,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "payments_order_idx" ON "payments" ("order_id");
CREATE INDEX IF NOT EXISTS "payments_provider_ref_idx" ON "payments" ("provider_ref");

CREATE TABLE IF NOT EXISTS "sessions" (
  "id" text PRIMARY KEY,
  "subject_id" text NOT NULL,
  "subject_kind" text NOT NULL,
  "token_hash" text NOT NULL,
  "user_agent" text,
  "ip_address" text,
  "expires_at" timestamptz NOT NULL,
  "revoked_at" timestamptz,
  "last_seen_at" timestamptz,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "sessions_subject_idx" ON "sessions" ("subject_id", "subject_kind");
CREATE INDEX IF NOT EXISTS "sessions_token_idx" ON "sessions" ("token_hash");
CREATE INDEX IF NOT EXISTS "sessions_expires_idx" ON "sessions" ("expires_at");

CREATE TABLE IF NOT EXISTS "audit_log" (
  "id" text PRIMARY KEY,
  "actor_id" text,
  "actor_kind" text NOT NULL DEFAULT 'user',
  "action" text NOT NULL,
  "resource" text NOT NULL,
  "resource_id" text,
  "diff" jsonb,
  "ip_address" text,
  "user_agent" text,
  "occurred_at" timestamptz NOT NULL
);
CREATE INDEX IF NOT EXISTS "audit_actor_idx" ON "audit_log" ("actor_id");
CREATE INDEX IF NOT EXISTS "audit_resource_idx" ON "audit_log" ("resource", "resource_id");
CREATE INDEX IF NOT EXISTS "audit_occurred_idx" ON "audit_log" ("occurred_at");

CREATE TABLE IF NOT EXISTS "discounts" (
  "id" text PRIMARY KEY,
  "code" text NOT NULL,
  "name" text NOT NULL,
  "type" "discount_type" NOT NULL,
  "value" integer NOT NULL,
  "conditions" jsonb,
  "minimum_subtotal_minor" integer,
  "usage_limit" integer,
  "usage_count" integer NOT NULL DEFAULT 0,
  "per_customer_limit" integer,
  "is_active" boolean NOT NULL DEFAULT true,
  "starts_at" timestamptz,
  "ends_at" timestamptz,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS "discounts_code_unique" ON "discounts" ("code");
CREATE INDEX IF NOT EXISTS "discounts_active_idx" ON "discounts" ("is_active");

CREATE TABLE IF NOT EXISTS "reviews" (
  "id" text PRIMARY KEY,
  "product_id" text NOT NULL REFERENCES "products" ("id") ON DELETE CASCADE,
  "customer_id" text REFERENCES "customers" ("id") ON DELETE SET NULL,
  "rating" integer NOT NULL,
  "title" text,
  "body" text,
  "is_approved" boolean NOT NULL DEFAULT false,
  "helpful_count" integer NOT NULL DEFAULT 0,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "reviews_product_idx" ON "reviews" ("product_id");
CREATE INDEX IF NOT EXISTS "reviews_approved_idx" ON "reviews" ("is_approved");
