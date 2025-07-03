
import React from 'react';
import { Header } from './Header';
import { Breadcrumb } from './Breadcrumb';

interface MainContentProps {
  currentUser: any;
  isMobile: boolean;
  onToggleSidebar: () => void;
  onLogout: () => void;
  filteredNavItems: any[];
  children: React.ReactNode;
}

export const MainContent: React.FC<MainContentProps> = ({
  currentUser,
  isMobile,
  onToggleSidebar,
  onLogout,
  filteredNavItems,
  children,
}) => {
  return (
    <main className="flex-1 flex flex-col">
      <Header 
        currentUser={currentUser}
        isMobile={isMobile}
        onToggleSidebar={onToggleSidebar}
        onLogout={onLogout}
      />

      <Breadcrumb navItems={filteredNavItems} />

      <div className="p-6 bg-gray-100 flex-grow">{children}</div>
    </main>
  );
};
