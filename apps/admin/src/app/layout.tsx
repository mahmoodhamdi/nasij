import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import './globals.css';

export const metadata: Metadata = {
  title: 'Nasij Admin',
  description: 'Manage your Nasij retail platform.',
  robots: { index: false, follow: false },
};

const RootLayout = ({ children }: { children: ReactNode }) => (
  <html lang="en" dir="ltr">
    <body>{children}</body>
  </html>
);

export default RootLayout;
