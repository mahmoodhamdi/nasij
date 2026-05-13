import type { Meta, StoryObj } from '@storybook/react';

import { ProductCard } from './product-card.js';

const meta: Meta<typeof ProductCard> = {
  title: 'Commerce/ProductCard',
  component: ProductCard,
  tags: ['autodocs'],
  args: {
    title: 'Amber kaftan',
    href: '#',
    priceLabel: 'EGP 2,400.00',
  },
};

export default meta;

type Story = StoryObj<typeof ProductCard>;

export const Default: Story = {};

export const OnSale: Story = {
  args: {
    priceLabel: 'EGP 1,950.00',
    compareAtLabel: 'EGP 2,400.00',
    ribbon: 'Sale',
  },
};

export const SoldOut: Story = {
  args: { disabled: true, ribbon: 'Sold out' },
};

export const WithImage: Story = {
  args: {
    imageSrc: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format',
    imageAlt: 'Amber kaftan on a stone background',
  },
};
