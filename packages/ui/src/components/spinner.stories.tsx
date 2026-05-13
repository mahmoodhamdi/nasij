import type { Meta, StoryObj } from '@storybook/react';

import { Spinner } from './spinner.js';

const meta: Meta<typeof Spinner> = {
  title: 'Primitives/Spinner',
  component: Spinner,
  tags: ['autodocs'],
};

export default meta;

export const Default: StoryObj<typeof Spinner> = {
  render: () => <Spinner aria-label="Loading" />,
};
