import type { Meta, StoryObj } from '@storybook/react';

import { Badge } from './badge.js';

const meta: Meta<typeof Badge> = {
  title: 'Primitives/Badge',
  component: Badge,
  tags: ['autodocs'],
  args: { children: 'New' },
  argTypes: {
    tone: { control: 'select', options: ['neutral', 'accent', 'success', 'warning', 'danger'] },
  },
};

export default meta;

type Story = StoryObj<typeof Badge>;

export const Neutral: Story = {};
export const Accent: Story = { args: { tone: 'accent' } };
export const Success: Story = { args: { tone: 'success', children: 'Active' } };
export const Warning: Story = { args: { tone: 'warning', children: 'Pending' } };
export const Danger: Story = { args: { tone: 'danger', children: 'Failed' } };
