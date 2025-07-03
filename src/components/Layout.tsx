
import React from 'react';
import { LayoutProvider } from './layout/LayoutProvider';
import { SidebarContainer } from './layout/SidebarContainer';
import { MainContent } from './layout/MainContent';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <LayoutProvider>
      {({
        currentUser,
        sidebarOpen,
        isMobile,
        filteredNavItems,
        toggleSidebar,
        logout,
      }) => (
        <div className="min-h-screen flex">
          <SidebarContainer
            currentUser={currentUser}
            isMobile={isMobile}
            sidebarOpen={sidebarOpen}
            onToggleSidebar={toggleSidebar}
          />

          <MainContent
            currentUser={currentUser}
            isMobile={isMobile}
            onToggleSidebar={toggleSidebar}
            onLogout={logout}
            filteredNavItems={filteredNavItems}
          >
            {children}
          </MainContent>
        </div>
      )}
    </LayoutProvider>
  );
};

export default Layout;
