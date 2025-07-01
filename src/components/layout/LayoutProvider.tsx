
import React, { useState, useMemo, useCallback } from 'react';
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
  const { currentUser, logout, isLoading } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  console.log('LayoutProvider: Rendering with user:', currentUser?.id, 'isLoading:', isLoading);

  // Show loading state while auth is initializing
  if (isLoading) {
    console.log('LayoutProvider: Still loading auth state');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // If not logged in, redirect to login
  if (!currentUser) {
    console.log('LayoutProvider: No user, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Memoize navigation items to prevent recalculation on every render
  const navItems = useMemo(() => {
    console.log('LayoutProvider: Calculating navigation items for role:', currentUser.role);
    return getNavigationItems(currentUser.role);
  }, [currentUser.role]);

  const filteredNavItems = useMemo(() => {
    console.log('LayoutProvider: Filtering navigation items');
    return navItems.filter(item => 
      item.visibleTo.includes(currentUser.role)
    );
  }, [navItems, currentUser.role]);

  const toggleSidebar = useCallback(() => {
    console.log('LayoutProvider: Toggling sidebar');
    setSidebarOpen(prev => !prev);
  }, []);

  const memoizedProps = useMemo(() => ({
    currentUser,
    location,
    sidebarOpen,
    setSidebarOpen,
    isMobile,
    navItems,
    filteredNavItems,
    toggleSidebar,
    logout,
  }), [currentUser, location, sidebarOpen, isMobile, navItems, filteredNavItems, toggleSidebar, logout]);

  return (
    <>
      {children(memoizedProps)}
    </>
  );
};
