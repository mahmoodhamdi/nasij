import type { Meta, StoryObj } from '@storybook/react';

import { Card, CardBody, CardDescription, CardFooter, CardHeader, CardTitle } from './card.js';
import { Button } from './button.js';

const meta: Meta<typeof Card> = {
  title: 'Primitives/Card',
  component: Card,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: () => (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>Amber kaftan</CardTitle>
        <CardDescription>Linen with hand embroidery.</CardDescription>
      </CardHeader>
      <CardBody>
        <p className="text-sm text-text-muted">A relaxed-fit kaftan for warm days.</p>
      </CardBody>
      <CardFooter>
        <Button>Add to cart</Button>
      </CardFooter>
    </Card>
  ),
};
