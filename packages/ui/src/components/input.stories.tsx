import type { Meta, StoryObj } from '@storybook/react';

import { Input } from './input.js';
import { Label } from './label.js';

const meta: Meta<typeof Input> = {
  title: 'Primitives/Input',
  component: Input,
  tags: ['autodocs'],
  args: { placeholder: 'name@example.com' },
};

export default meta;

type Story = StoryObj<typeof Input>;

export const Default: Story = {};

export const WithLabel: Story = {
  render: (args) => (
    <div className="flex flex-col gap-2">
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" {...args} />
    </div>
  ),
};

export const Invalid: Story = {
  args: { invalid: true, defaultValue: 'not-an-email' },
};

export const Disabled: Story = { args: { disabled: true } };
