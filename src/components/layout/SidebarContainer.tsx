
import React from 'react';
import { Sidebar } from './Sidebar';
import { MobileSidebar } from './MobileSidebar';

interface SidebarContainerProps {
  currentUser: any;
  isMobile: boolean;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export const SidebarContainer: React.FC<SidebarContainerProps> = ({
  currentUser,
  isMobile,
  sidebarOpen,
  onToggleSidebar,
}) => {
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
};
