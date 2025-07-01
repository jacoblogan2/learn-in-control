
import { ReactNode } from 'react';

export interface NavItemProps {
  to: string;
  label: string;
  icon?: ReactNode;
  active?: boolean;
  hasChildren?: boolean;
  children?: ReactNode;
}

export interface SubNavItemProps {
  to: string;
  label: string;
  active?: boolean;
}

export interface NavigationItem {
  to: string;
  label: string;
  icon?: ReactNode;
  hasChildren?: boolean;
  visibleTo: string[];
  children?: { to: string; label: string }[];
}
