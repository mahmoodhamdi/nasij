import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { VisuallyHidden } from './visually-hidden.js';

describe('VisuallyHidden', () => {
  it('renders its children for assistive technology', () => {
    render(<VisuallyHidden>screen-reader only</VisuallyHidden>);
    expect(screen.getByText('screen-reader only')).toBeInTheDocument();
  });

  it('respects custom className', () => {
    render(<VisuallyHidden className="extra">x</VisuallyHidden>);
    expect(screen.getByText('x')).toHaveClass('extra');
  });
});
