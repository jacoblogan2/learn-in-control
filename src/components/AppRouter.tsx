
import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { routes } from '../config/routes';

export const AppRouter: React.FC = () => {
  console.log('AppRouter: Rendering routes');
  
  return (
    <BrowserRouter>
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
