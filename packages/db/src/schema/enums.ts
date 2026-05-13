import { pgEnum } from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum('user_role', [
  'owner',
  'admin',
  'manager',
  'staff',
  'support',
]);
export type UserRole = (typeof userRoleEnum.enumValues)[number];

export const orderStatusEnum = pgEnum('order_status', [
  'pending',
  'paid',
  'fulfilled',
  'shipped',
  'delivered',
  'returned',
  'refunded',
  'cancelled',
]);
export type OrderStatus = (typeof orderStatusEnum.enumValues)[number];

export const paymentStatusEnum = pgEnum('payment_status', [
  'pending',
  'authorized',
  'captured',
  'failed',
  'refunded',
  'partially-refunded',
]);
export type PaymentStatus = (typeof paymentStatusEnum.enumValues)[number];

export const fulfillmentStatusEnum = pgEnum('fulfillment_status', [
  'unfulfilled',
  'partial',
  'fulfilled',
  'returned',
]);
export type FulfillmentStatus = (typeof fulfillmentStatusEnum.enumValues)[number];

export const productStatusEnum = pgEnum('product_status', ['draft', 'active', 'archived']);
export type ProductStatus = (typeof productStatusEnum.enumValues)[number];

export const discountTypeEnum = pgEnum('discount_type', [
  'percentage',
  'fixed-amount',
  'free-shipping',
  'bogo',
]);
export type DiscountType = (typeof discountTypeEnum.enumValues)[number];

export const channelEnum = pgEnum('channel', ['storefront', 'pos', 'admin', 'system']);
export type Channel = (typeof channelEnum.enumValues)[number];

export const addressTypeEnum = pgEnum('address_type', ['shipping', 'billing']);
export type AddressType = (typeof addressTypeEnum.enumValues)[number];
