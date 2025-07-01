
import React, { memo } from 'react';
import { Sidebar } from './Sidebar';
import { MobileSidebar } from './MobileSidebar';

interface SidebarContainerProps {
  currentUser: any;
  isMobile: boolean;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export const SidebarContainer: React.FC<SidebarContainerProps> = memo(({
  currentUser,
  isMobile,
  sidebarOpen,
  onToggleSidebar,
}) => {
  console.log('SidebarContainer: Rendering for user:', currentUser?.id, 'isMobile:', isMobile);

  return (
    <>
      {isMobile ? (
        <MobileSidebar 
          currentUser={currentUser}
          sidebarOpen={sidebarOpen}
          onToggleSidebar={onToggleSidebar}
        />
      ) : (
        <Sidebar currentUser={currentUser} />
      )}
    </>
  );
});

SidebarContainer.displayName = 'SidebarContainer';
