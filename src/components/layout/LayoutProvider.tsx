
import React, { useState, useMemo, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
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

  console.log('LayoutProvider: Rendering with user:', currentUser?.id);

  // Memoize navigation items to prevent recalculation on every render
  const navItems = useMemo(() => {
    console.log('LayoutProvider: Calculating navigation items for role:', currentUser?.role);
    return getNavigationItems(currentUser?.role || 'student');
  }, [currentUser?.role]);

  const filteredNavItems = useMemo(() => {
    console.log('LayoutProvider: Filtering navigation items');
    return navItems.filter(item => 
      item.visibleTo.includes(currentUser?.role || 'student')
    );
  }, [navItems, currentUser?.role]);

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
