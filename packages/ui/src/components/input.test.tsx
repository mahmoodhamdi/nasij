import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

import { Input } from './input.js';

describe('Input', () => {
  it('defaults to type="text"', () => {
    render(<Input aria-label="name" />);
    expect(screen.getByLabelText('name')).toHaveAttribute('type', 'text');
  });

  it('respects a custom type', () => {
    render(<Input type="email" aria-label="email" />);
    expect(screen.getByLabelText('email')).toHaveAttribute('type', 'email');
  });

  it('passes typed input to onChange', async () => {
    const onChange = vi.fn();
    render(<Input aria-label="x" onChange={onChange} />);
    await userEvent.type(screen.getByLabelText('x'), 'hi');
    expect(onChange).toHaveBeenCalled();
  });

  it('renders aria-invalid when invalid is true', () => {
    render(<Input aria-label="x" invalid />);
    expect(screen.getByLabelText('x')).toHaveAttribute('aria-invalid', 'true');
  });

  it('omits aria-invalid when invalid is false', () => {
    render(<Input aria-label="x" />);
    expect(screen.getByLabelText('x')).not.toHaveAttribute('aria-invalid');
  });
});
