import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { Spinner } from './spinner.js';

describe('Spinner', () => {
  it('renders with role="status" for assistive tech', () => {
    render(<Spinner aria-label="Loading" />);
    expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument();
  });

  it('allows overriding the role', () => {
    render(<Spinner role="presentation" data-testid="s" />);
    expect(screen.getByTestId('s')).toHaveAttribute('role', 'presentation');
  });

  it('accepts custom className', () => {
    render(<Spinner className="extra" data-testid="s" />);
    expect(screen.getByTestId('s')).toHaveClass('extra');
  });
});
