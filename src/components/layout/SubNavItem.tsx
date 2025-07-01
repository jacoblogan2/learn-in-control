
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { SubNavItemProps } from './types';

export const SubNavItem: React.FC<SubNavItemProps> = ({ to, label, active }) => (
  <Link to={to}>
    <div
      className={cn(
        'flex items-center space-x-2 px-4 py-2 rounded-md text-sm',
        active
          ? 'bg-sidebar-accent text-white font-medium'
          : 'hover:bg-sidebar-accent text-gray-200 hover:text-white'
      )}
    >
      <span>•</span>
      <span>{label}</span>
    </div>
  </Link>
);
