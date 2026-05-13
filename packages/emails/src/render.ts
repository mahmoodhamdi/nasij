import { render } from '@react-email/render';
import type { ReactElement } from 'react';

export const renderEmail = (element: ReactElement): Promise<string> => render(element);

export const plainTextFor = (element: ReactElement): Promise<string> =>
  render(element, { plainText: true });
