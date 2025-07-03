
import React, { useState } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { getNavigationItems } from './navigationConfig';

interface LayoutProviderProps {
  children: (props: {
    currentUser: any;
    location: any;
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
    isMobile: boolean;
    navItems: any[];
    filteredNavItems: any[];
    toggleSidebar: () => void;
    logout: () => void;
  }) => React.ReactNode;
}

export const LayoutProvider: React.FC<LayoutProviderProps> = ({ children }) => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  // If not logged in, redirect to login
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const navItems = getNavigationItems(currentUser.role);
  const filteredNavItems = navItems.filter(item => 
    item.visibleTo.includes(currentUser.role)
  );

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <>
      {children({
        currentUser,
        location,
        sidebarOpen,
        setSidebarOpen,
        isMobile,
        navItems,
        filteredNavItems,
        toggleSidebar,
        logout,
      })}
    </>
  );
};
