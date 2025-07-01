
import React, { memo } from 'react';
import { LayoutProvider } from './layout/LayoutProvider';
import { SidebarContainer } from './layout/SidebarContainer';
import { MainContent } from './layout/MainContent';
import { RenderTracker } from './debug/RenderTracker';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = memo(({ children }) => {
  console.log('Layout: Rendering');

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
          <RenderTracker name="Layout" props={{ userId: currentUser?.id, sidebarOpen, isMobile }} />
          
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
});

Layout.displayName = 'Layout';

export default Layout;
