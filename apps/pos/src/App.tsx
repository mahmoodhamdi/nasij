import { useState } from 'react';

import { Button } from '@nasij/ui';

import { RegisterShell } from './components/register-shell.js';

export const App = () => {
  const [signedIn, setSignedIn] = useState(false);

  if (!signedIn) {
    return (
      <main className="grid min-h-dvh place-items-center bg-surface-sunken">
        <div className="flex flex-col items-center gap-4 rounded-2xl bg-surface-raised p-10 shadow-lg">
          <h1 className="font-display-latin text-3xl text-text">Nasij POS</h1>
          <p className="text-text-muted">Sign in to start a shift.</p>
          <Button size="lg" onClick={() => setSignedIn(true)}>
            Open register
          </Button>
        </div>
      </main>
    );
  }

  return <RegisterShell onSignOut={() => setSignedIn(false)} />;
};
