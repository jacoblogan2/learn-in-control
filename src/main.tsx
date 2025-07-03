
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

// Check if this is the user's first visit
if (!localStorage.getItem('hasVisitedBefore')) {
  // For first-time visitors, we'll redirect to welcome page
  // This will be handled inside the app with routing
  localStorage.setItem('initialRoute', '/welcome');
  localStorage.setItem('hasVisitedBefore', 'true');
} else if (!localStorage.getItem('initialRoute')) {
  // For returning visitors with no specific route
  localStorage.setItem('initialRoute', '/');
}

createRoot(rootElement).render(
  <App />
);
