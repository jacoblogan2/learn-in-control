
export const isValidRole = (role: string): role is 'admin' | 'lecturer' | 'student' | 'parent' => {
  return ['admin', 'lecturer', 'student', 'parent'].includes(role);
};

export const getRoleBasedRedirectPath = (role: 'admin' | 'lecturer' | 'student' | 'parent'): string => {
  switch (role) {
    case 'admin':
      return '/admin/dashboard';
    case 'lecturer':
      return '/lecturer/dashboard';
    case 'student':
      return '/student/dashboard';
    case 'parent':
      return '/'; // Parents can use the general dashboard for now
    default:
      return '/';
  }
};
