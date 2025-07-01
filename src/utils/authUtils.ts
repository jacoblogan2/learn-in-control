
import { User } from '../types/auth';

export const isUserAuthenticated = (user: User | null): boolean => {
  return user !== null && user.id !== undefined;
};

export const getUserDisplayName = (user: User | null): string => {
  if (!user) return '';
  return `${user.firstName} ${user.lastName}`.trim() || user.username || user.email;
};

export const hasRole = (user: User | null, role: string): boolean => {
  return user?.role === role;
};

export const canAccessRoute = (user: User | null, requiredRole?: string): boolean => {
  if (!isUserAuthenticated(user)) return false;
  if (!requiredRole) return true;
  return hasRole(user, requiredRole);
};
