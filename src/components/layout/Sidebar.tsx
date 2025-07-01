
import React from 'react';
import { useLocation } from 'react-router-dom';
import { User } from '../../types/auth';
import { NavItem } from './NavItem';
import { SubNavItem } from './SubNavItem';
import { getNavigationItems } from './navigationConfig';

interface SidebarProps {
  currentUser: User;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentUser }) => {
  const location = useLocation();
  const currentYear = new Date().getFullYear();

  const navItems = getNavigationItems(currentUser.role);
  const filteredNavItems = navItems.filter(item => 
    item.visibleTo.includes(currentUser.role)
  );

  return (
    <aside className="akkhor-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out text-white w-64">
      <div className="p-4 border-b border-sidebar-border flex items-center">
        <h1 className="text-2xl font-bold text-primary flex items-center">
          <span className="text-3xl mr-1">V</span>onyee
          <span className="text-xs align-top ml-1">®</span>
        </h1>
      </div>
      
      <nav className="p-4">
        {filteredNavItems.map((item) => (
          <NavItem
            key={item.to}
            to={item.to}
            label={item.label}
            icon={item.icon}
            active={location.pathname === item.to}
            hasChildren={item.hasChildren}
          >
            {item.hasChildren && item.children && item.children.map(child => (
              <SubNavItem 
                key={child.to} 
                to={child.to} 
                label={child.label} 
                active={location.pathname === child.to} 
              />
            ))}
          </NavItem>
        ))}
      </nav>
      
      <div className="p-4 mt-auto border-t border-sidebar-border text-xs text-gray-400">
        <p>© Copyrights {currentYear}. All rights reserved.</p>
        <p>Designed by <span className="text-primary">Jacob Logan</span></p>
      </div>
    </aside>
  );
};
