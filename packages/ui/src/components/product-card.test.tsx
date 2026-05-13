import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { ProductCard } from './product-card.js';

describe('ProductCard', () => {
  it('renders title, href, and price', () => {
    render(<ProductCard title="Amber kaftan" href="/p/amber" priceLabel="EGP 2,400.00" />);
    expect(screen.getByRole('heading', { name: 'Amber kaftan' })).toBeInTheDocument();
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute('href', '/p/amber');
  });

  it('renders an image with alt when imageSrc is supplied', () => {
    render(
      <ProductCard
        title="Amber kaftan"
        href="/p/amber"
        priceLabel="EGP 2,400.00"
        imageSrc="/amber.jpg"
        imageAlt="Amber kaftan on a stone background"
      />,
    );
    expect(screen.getByRole('img', { name: 'Amber kaftan on a stone background' })).toBeInTheDocument();
  });

  it('renders the placeholder glyph when no image', () => {
    render(<ProductCard title="x" href="/p/x" priceLabel="EGP 0.00" />);
    expect(screen.queryByRole('img')).toBeNull();
  });

  it('renders a ribbon when supplied', () => {
    render(<ProductCard title="x" href="/p/x" priceLabel="EGP 0.00" ribbon="New" />);
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('shows compareAt price as struck-through', () => {
    render(
      <ProductCard
        title="x"
        href="/p/x"
        priceLabel="EGP 100.00"
        compareAtLabel="EGP 150.00"
      />,
    );
    const compareEl = screen.getByText('EGP 150.00');
    expect(compareEl.className).toContain('line-through');
  });

  it('renders as disabled (no href, aria-disabled, tabIndex=-1)', () => {
    render(<ProductCard title="x" href="/p/x" priceLabel="EGP 0.00" disabled />);
    const links = screen.getAllByText('x', { selector: 'a' });
    for (const link of links) {
      expect(link).toHaveAttribute('aria-disabled', 'true');
      expect(link).toHaveAttribute('tabIndex', '-1');
      expect(link).not.toHaveAttribute('href');
    }
  });

  it('omits aria-disabled when not disabled', () => {
    render(<ProductCard title="x" href="/p/x" priceLabel="EGP 0.00" />);
    for (const link of screen.getAllByRole('link')) {
      expect(link).not.toHaveAttribute('aria-disabled');
    }
  });

  it('applies custom className', () => {
    const { container } = render(
      <ProductCard title="x" href="/p/x" priceLabel="EGP 0.00" className="custom" />,
    );
    expect(container.querySelector('article.custom')).not.toBeNull();
  });
});
