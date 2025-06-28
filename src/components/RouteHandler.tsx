
import { useEffect } from 'react';

export const RouteHandler = () => {
  useEffect(() => {
    const initialRoute = localStorage.getItem('initialRoute');
    if (initialRoute) {
      // Clear the initial route from storage
      localStorage.removeItem('initialRoute');
      
      // Redirect to the initial route if needed
      if (window.location.pathname === '/') {
        window.location.href = initialRoute;
      }
    }
  }, []);

  return null;
};
