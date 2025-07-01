
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import { NavItemProps } from './types';

export const NavItem: React.FC<NavItemProps> = ({ to, label, icon, active, hasChildren, children }) => {
  const [expanded, setExpanded] = useState(false);

  const handleToggle = (e: React.MouseEvent) => {
    if (hasChildren) {
      e.preventDefault();
      setExpanded(!expanded);
    }
  };

  return (
    <div className="mb-1">
      <Link to={to} onClick={hasChildren ? handleToggle : undefined}>
        <div
          className={cn(
            'flex items-center justify-between px-4 py-3 rounded-md',
            active
              ? 'bg-sidebar-primary text-sidebar-primary-foreground font-medium'
              : 'hover:bg-sidebar-accent text-white hover:text-white'
          )}
        >
          <div className="flex items-center space-x-2">
            {icon && <span className="text-xl">{icon}</span>}
            <span>{label}</span>
          </div>
          {hasChildren && (
            <ChevronDown
              className={cn(
                "w-4 h-4 transition-transform",
                expanded ? "transform rotate-180" : ""
              )}
            />
          )}
        </div>
      </Link>
      
      {hasChildren && expanded && (
        <div className="ml-8 mt-1 space-y-1">
          {children}
        </div>
      )}
    </div>
  );
};
