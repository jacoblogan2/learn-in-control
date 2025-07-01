
export const isValidRole = (role: string): role is 'admin' | 'lecturer' | 'student' => {
  return ['admin', 'lecturer', 'student'].includes(role);
};

export const getRoleBasedRedirectPath = (role: 'admin' | 'lecturer' | 'student'): string => {
  switch (role) {
    case 'admin':
      return '/admin/dashboard';
    case 'lecturer':
      return '/lecturer/dashboard';
    case 'student':
      return '/student/dashboard';
    default:
      return '/';
  }
};
