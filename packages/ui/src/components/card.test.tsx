import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { Card, CardBody, CardDescription, CardFooter, CardHeader, CardTitle } from './card.js';

describe('Card', () => {
  it('renders compound parts with content', () => {
    render(
      <Card data-testid="card">
        <CardHeader>
          <CardTitle>Title</CardTitle>
          <CardDescription>Description</CardDescription>
        </CardHeader>
        <CardBody>Body</CardBody>
        <CardFooter>Footer</CardFooter>
      </Card>,
    );
    expect(screen.getByTestId('card')).toBeInTheDocument();
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Body')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });

  it.each([
    ['Card', Card],
    ['CardHeader', CardHeader],
    ['CardBody', CardBody],
    ['CardFooter', CardFooter],
  ] as const)('%s accepts a custom className', (_label, Component) => {
    render(<Component data-testid="el" className="custom">x</Component>);
    expect(screen.getByTestId('el')).toHaveClass('custom');
  });

  it('CardTitle and CardDescription apply custom className', () => {
    render(
      <>
        <CardTitle className="title-custom">T</CardTitle>
        <CardDescription className="desc-custom">D</CardDescription>
      </>,
    );
    expect(screen.getByText('T')).toHaveClass('title-custom');
    expect(screen.getByText('D')).toHaveClass('desc-custom');
  });
});
