
import React, { useState } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sidebar } from './layout/Sidebar';
import { MobileSidebar } from './layout/MobileSidebar';
import { Header } from './layout/Header';
import { Breadcrumb } from './layout/Breadcrumb';
import { getNavigationItems } from './layout/navigationConfig';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
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
    <div className="min-h-screen flex">
      {/* Sidebar */}
      {isMobile ? (
        <MobileSidebar 
          currentUser={currentUser}
          sidebarOpen={sidebarOpen}
          onToggleSidebar={toggleSidebar}
        />
      ) : (
        <Sidebar currentUser={currentUser} />
      )}

      {/* Main content */}
      <main className="flex-1 flex flex-col">
        <Header 
          currentUser={currentUser}
          isMobile={isMobile}
          onToggleSidebar={toggleSidebar}
          onLogout={logout}
        />

        <Breadcrumb navItems={filteredNavItems} />

        <div className="p-6 bg-gray-100 flex-grow">{children}</div>
      </main>
    </div>
  );
};

export default Layout;
