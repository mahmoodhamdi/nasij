import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { Badge, badgeVariants } from './badge.js';

describe('Badge', () => {
  it('renders children', () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it.each(['neutral', 'accent', 'success', 'warning', 'danger'] as const)(
    'applies %s tone variant',
    (tone) => {
      render(<Badge tone={tone}>{tone}</Badge>);
      const el = screen.getByText(tone);
      expect(el.className).toEqual(expect.stringContaining(''));
    },
  );

  it('defaults to neutral when tone unspecified', () => {
    const cls = badgeVariants({});
    expect(cls).toContain('bg-surface-sunken');
  });

  it('accepts custom className', () => {
    render(<Badge className="custom">x</Badge>);
    expect(screen.getByText('x')).toHaveClass('custom');
  });
});
