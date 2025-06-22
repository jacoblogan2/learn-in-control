
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { 
  GraduationCap, 
  LogOut, 
  User, 
  Home,
  Users,
  BookOpen,
  CreditCard,
  School,
  Calendar,
  ClipboardList,
  Award,
  MessageSquare,
  Bell,
  Settings
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { signOut, profile, isAdmin, isStudent, isLecturer } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const navigation = [
    // Admin navigation
    ...(isAdmin ? [
      { name: 'Dashboard', href: '/', icon: Home },
      { name: 'Students', href: '/students', icon: Users },
      { name: 'Teachers', href: '/teachers', icon: BookOpen },
      { name: 'Schools', href: '/schools', icon: School },
      { name: 'Classrooms', href: '/classrooms', icon: School },
      { name: 'Subjects', href: '/subject', icon: BookOpen },
      { name: 'Attendance', href: '/attendance', icon: ClipboardList },
      { name: 'Grades', href: '/grades', icon: Award },
      { name: 'Fees', href: '/fees-collection', icon: CreditCard },
      { name: 'Messages', href: '/message', icon: MessageSquare },
      { name: 'Notices', href: '/notice', icon: Bell },
    ] : []),
    
    // Student navigation
    ...(isStudent ? [
      { name: 'Dashboard', href: '/student-dashboard', icon: Home },
      { name: 'My Courses', href: '/student-courses', icon: BookOpen },
      { name: 'My Grades', href: '/student-grades', icon: Award },
      { name: 'My Attendance', href: '/student-attendance', icon: ClipboardList },
      { name: 'Payments', href: '/student-payments', icon: CreditCard },
      { name: 'Messages', href: '/message', icon: MessageSquare },
    ] : []),
    
    // Lecturer navigation
    ...(isLecturer ? [
      { name: 'Dashboard', href: '/lecturer-dashboard', icon: Home },
      { name: 'My Courses', href: '/lecturer-courses', icon: BookOpen },
      { name: 'Attendance', href: '/attendance', icon: ClipboardList },
      { name: 'Grades', href: '/grades', icon: Award },
      { name: 'Messages', href: '/message', icon: MessageSquare },
    ] : []),
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <GraduationCap className="h-8 w-8 text-blue-600" />
              <h1 className="ml-2 text-xl font-semibold text-gray-900">
                School Management
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {profile && (
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-gray-500" />
                  <span className="text-sm text-gray-700">
                    {profile.first_name} {profile.last_name}
                  </span>
                  <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                    {profile.role}
                  </span>
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-white shadow-sm min-h-screen">
          <div className="p-4">
            <ul className="space-y-2">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <li key={item.name}>
                    <button
                      onClick={() => navigate(item.href)}
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        isActive
                          ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>

        {/* Main content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
