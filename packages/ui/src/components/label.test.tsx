import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { Label } from './label.js';

describe('Label', () => {
  it('renders its children', () => {
    render(<Label htmlFor="x">Email</Label>);
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('forwards htmlFor', () => {
    render(<Label htmlFor="email-input">Email</Label>);
    expect(screen.getByText('Email').getAttribute('for')).toBe('email-input');
  });

  it('applies custom className', () => {
    render(<Label className="custom">Label</Label>);
    expect(screen.getByText('Label')).toHaveClass('custom');
  });
});
