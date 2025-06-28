
import React from 'react';
import { AppProviders } from './components/AppProviders';
import { AppRouter } from './components/AppRouter';

const App = () => {
  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  );
};

export default App;
