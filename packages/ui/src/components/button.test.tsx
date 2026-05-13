import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

import { Button, buttonVariants } from './button.js';

describe('Button', () => {
  it('renders its children inside a button element', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('defaults to type="button" to avoid implicit form submission', () => {
    render(<Button>Action</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('respects a caller-supplied type', () => {
    render(<Button type="submit">Send</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });

  it('fires onClick', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Tap</Button>);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('merges custom className', () => {
    render(<Button className="extra">x</Button>);
    expect(screen.getByRole('button')).toHaveClass('extra');
  });

  it('applies variant + size classes', () => {
    const cls = buttonVariants({ variant: 'danger', size: 'lg' });
    expect(cls).toContain('bg-danger');
    expect(cls).toContain('h-12');
  });

  it('renders as child when asChild', () => {
    render(
      <Button asChild>
        <a href="/x">Link</a>
      </Button>,
    );
    const link = screen.getByRole('link', { name: 'Link' });
    expect(link).toBeInTheDocument();
    expect(link).not.toHaveAttribute('type');
  });

  it('uses default variants when none specified', () => {
    expect(buttonVariants({})).toContain('bg-accent');
    expect(buttonVariants({})).toContain('h-10');
  });
});
