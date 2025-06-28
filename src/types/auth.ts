
export interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'lecturer' | 'student';
}

export interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<{ redirectTo?: string }>;
  logout: () => void;
  signUp: (email: string, password: string, userData: {
    firstName: string;
    lastName: string;
    role: 'admin' | 'lecturer' | 'student';
  }) => Promise<void>;
  isLoading: boolean;
}

export interface SignUpData {
  firstName: string;
  lastName: string;
  role: 'admin' | 'lecturer' | 'student';
}
