
import React, { useState } from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  LayoutDashboard, Users, GraduationCap, UserSquare, 
  ClipboardList, FileText, BellRing, MessageSquare, Settings, 
  CalendarDays, Search, ChevronDown
} from 'lucide-react';

interface NavItemProps {
  to: string;
  label: string;
  icon?: React.ReactNode;
  active?: boolean;
  hasChildren?: boolean;
  children?: React.ReactNode;
}

const NavItem: React.FC<NavItemProps> = ({ to, label, icon, active, hasChildren, children }) => {
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

const SubNavItem: React.FC<Omit<NavItemProps, 'hasChildren' | 'children'>> = ({ to, label, active }) => (
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

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const isMobile = useIsMobile();

  // If not logged in, redirect to login
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Navigation items with children
  const studentNavItems = [
    { to: "/all-students", label: "All Students" },
    { to: "/student-details", label: "Student Details" },
    { to: "/admit-form", label: "Admit Form" },
    { to: "/student-promotion", label: "Student Promotion" },
  ];

  const teacherNavItems = [
    { to: "/all-teachers", label: "All Teachers" },
    { to: "/teacher-details", label: "Teacher Details" },
    { to: "/add-teacher", label: "Add Teacher" },
  ];

  const feesNavItems = [
    { to: "/fees-collection", label: "Fees Collection" },
    { to: "/create-payment", label: "Create Payment" },
    { to: "/all-expenses", label: "All Expenses" },
    { to: "/add-expenses", label: "Add Expenses" },
  ];
  
  // Navigation items based on user role - Library option removed
  const navItems = [
    { to: "/", label: "Dashboard", icon: <LayoutDashboard size={20} />, visibleTo: ['admin', 'teacher', 'student'] },
    { 
      to: "/students", 
      label: "Students", 
      icon: <GraduationCap size={20} />, 
      hasChildren: true,
      visibleTo: ['admin', 'teacher'],
      children: studentNavItems
    },
    { 
      to: "/teachers", 
      label: "Teachers", 
      icon: <UserSquare size={20} />, 
      hasChildren: true,
      visibleTo: ['admin'],
      children: teacherNavItems
    },
    { to: "/parents", label: "Parents", icon: <Users size={20} />, visibleTo: ['admin', 'teacher'] },
    { 
      to: "/account", 
      label: "Account", 
      icon: <Settings size={20} />, 
      hasChildren: currentUser?.role === 'admin',
      visibleTo: ['admin', 'teacher', 'student'],
      children: currentUser?.role === 'admin' ? feesNavItems : undefined
    },
    { to: "/class", label: "Class", icon: <Users size={20} />, visibleTo: ['admin', 'teacher'] },
    { to: "/subject", label: "Subject", icon: <FileText size={20} />, visibleTo: ['admin', 'teacher', 'student'] },
    { to: "/class-routine", label: "Class Routine", icon: <CalendarDays size={20} />, visibleTo: ['admin', 'teacher', 'student'] },
    { to: "/attendance", label: "Attendance", icon: <ClipboardList size={20} />, visibleTo: ['admin', 'teacher'] },
    { to: "/exam", label: "Exam", icon: <FileText size={20} />, visibleTo: ['admin', 'teacher', 'student'] },
    { to: "/notice", label: "Notice", icon: <BellRing size={20} />, visibleTo: ['admin', 'teacher', 'student'] },
    { to: "/message", label: "Message", icon: <MessageSquare size={20} />, visibleTo: ['admin', 'teacher', 'student'] },
    { to: "/ui-elements", label: "UI Elements", icon: <Settings size={20} />, visibleTo: ['admin'] },
  ];

  const filteredNavItems = navItems.filter(item => 
    item.visibleTo.includes(currentUser.role)
  );

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const currentPath = location.pathname;
  const pageTitleItem = location.pathname === "/" 
    ? { label: "Dashboard" } 
    : filteredNavItems.find(item => currentPath === item.to || currentPath.startsWith(item.to + "/"));

  // Get current year for footer
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside
        className={cn(
          "akkhor-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out text-white",
          isMobile
            ? `fixed top-0 bottom-0 left-0 z-40 w-64 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`
            : 'w-64'
        )}
      >
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

      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30" 
          onClick={toggleSidebar}
        />
      )}

      {/* Main content */}
      <main className="flex-1 flex flex-col">
        <header className="akkhor-header p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {isMobile && (
              <Button variant="ghost" size="icon" onClick={toggleSidebar}>
                ☰
              </Button>
            )}
            <div className="flex items-center space-x-2">
              <div className="text-sm text-gray-500">
                Welcome To Vonyee's
              </div>
              <div className="text-sm font-medium">
                School Management System
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                <input 
                  type="text" 
                  placeholder="Search here..." 
                  className="border-none text-sm py-1 px-3 focus:outline-none w-40 md:w-auto" 
                />
                <button className="bg-transparent px-2 text-gray-500">
                  <Search size={16} />
                </button>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="relative">
                <button className="text-gray-500 relative">
                  <BellRing size={20} />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
                    1
                  </span>
                </button>
              </div>
              
              <div className="relative">
                <button className="text-gray-500 relative">
                  <MessageSquare size={20} />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center">
                    3
                  </span>
                </button>
              </div>
              
              <div className="flex items-center text-sm">
                <span className="text-gray-500 mr-1 hidden md:inline">English</span>
                <ChevronDown size={14} />
              </div>
              
              <div className="relative group">
                <div className="flex items-center cursor-pointer">
                  <div className="w-8 h-8 rounded-full bg-gray-200 mr-2 overflow-hidden">
                    <img 
                      src="https://i.pravatar.cc/150?u=admin" 
                      alt="User" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="hidden md:block">
                    <div className="text-sm font-medium">{currentUser.firstName} {currentUser.lastName}</div>
                    <div className="text-xs text-gray-500">{currentUser.role}</div>
                  </div>
                  <ChevronDown size={14} className="ml-1" />
                </div>
                
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 hidden group-hover:block">
                  <div className="py-1">
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">My Profile</a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Account Settings</a>
                    <button 
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" 
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="flex items-center px-6 py-2 text-sm text-gray-500 bg-gray-100 border-b border-gray-200">
          <Link to="/" className="hover:text-blue-500">Home</Link>
          {pageTitleItem && (
            <>
              <span className="mx-2">/</span>
              <span className="text-gray-700">{pageTitleItem.label}</span>
            </>
          )}
        </div>

        <div className="p-6 bg-gray-100 flex-grow">{children}</div>
      </main>
    </div>
  );
};

export default Layout;
