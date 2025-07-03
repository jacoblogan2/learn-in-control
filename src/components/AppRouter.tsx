
import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { routes } from '../config/routes';
import { RouteHandler } from './RouteHandler';

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <RouteHandler />
      <Routes>
        {routes.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            element={route.element}
          />
        ))}
      </Routes>
    </BrowserRouter>
  );
};
