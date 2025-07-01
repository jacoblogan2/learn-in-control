
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NavigationItem } from './types';

interface BreadcrumbProps {
  navItems: NavigationItem[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ navItems }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  const pageTitleItem = currentPath === "/" 
    ? { label: "Dashboard" } 
    : navItems.find(item => currentPath === item.to || currentPath.startsWith(item.to + "/"));

  return (
    <div className="flex items-center px-6 py-2 text-sm text-gray-500 bg-gray-100 border-b border-gray-200">
      <Link to="/" className="hover:text-blue-500">Home</Link>
      {pageTitleItem && (
        <>
          <span className="mx-2">/</span>
          <span className="text-gray-700">{pageTitleItem.label}</span>
        </>
      )}
    </div>
  );
};
