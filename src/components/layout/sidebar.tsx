
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  User, 
  UserCircle, 
  Stethoscope, 
  Pill, 
  CreditCard, 
  Brain, 
  Settings, 
  BarChart, 
  Calendar,
  FileText,
  Heart,
  Menu,
  ChevronRight,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

type SidebarProps = {
  className?: string;
}

type NavItem = {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  role: 'patient' | 'doctor' | 'pharmacy' | 'admin' | 'all';
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/patient',
    icon: User,
    role: 'patient',
  },
  {
    title: 'Medical Records',
    href: '/patient/records',
    icon: FileText,
    role: 'patient',
  },
  {
    title: 'Appointments',
    href: '/patient/appointments',
    icon: Calendar,
    role: 'patient',
  },
  {
    title: 'Vitals',
    href: '/patient/vitals',
    icon: Heart,
    role: 'patient',
  },
  {
    title: 'Dashboard',
    href: '/doctor',
    icon: Stethoscope,
    role: 'doctor',
  },
  {
    title: 'Patient Records',
    href: '/doctor/patients',
    icon: UserCircle,
    role: 'doctor',
  },
  {
    title: 'Schedule',
    href: '/doctor/schedule',
    icon: Calendar,
    role: 'doctor',
  },
  {
    title: 'Dashboard',
    href: '/pharmacy',
    icon: Pill,
    role: 'pharmacy',
  },
  {
    title: 'Inventory',
    href: '/pharmacy/inventory',
    icon: BarChart,
    role: 'pharmacy',
  },
  {
    title: 'Prescriptions',
    href: '/pharmacy/prescriptions',
    icon: FileText,
    role: 'pharmacy',
  },
  {
    title: 'Billing',
    href: '/billing',
    icon: CreditCard,
    role: 'all',
  },
  {
    title: 'Disease Prediction',
    href: '/disease-prediction',
    icon: Brain,
    role: 'all',
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
    role: 'all',
  },
];

export function Sidebar({ className }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<'patient' | 'doctor' | 'pharmacy' | 'admin'>('patient');
  const [collapsed, setCollapsed] = useState(false);

  // Filter nav items based on user role or 'all'
  const filteredNavItems = navItems.filter(
    item => item.role === userRole || item.role === 'all'
  );

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem('healthsync_auth');
    localStorage.removeItem('healthsync_user_role');
    
    // Show success message
    toast.success("Logged out successfully");
    
    // Redirect to login
    navigate('/auth/login');
  };

  return (
    <div
      className={cn(
        'flex flex-col border-r bg-white transition-all dark:bg-sidebar',
        collapsed ? 'w-[80px]' : 'w-[280px]',
        className
      )}
    >
      <div className="flex h-16 items-center border-b px-4">
        <div className="flex items-center gap-2">
          {!collapsed && (
            <Link to="/" className="flex items-center gap-2">
              <Heart className="h-6 w-6 fill-primary stroke-white dark:stroke-black" />
              <span className="font-bold text-xl text-primary">HealthSync</span>
            </Link>
          )}
          {collapsed && (
            <Link to="/" className="mx-auto">
              <Heart className="h-6 w-6 fill-primary stroke-white dark:stroke-black" />
            </Link>
          )}
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="ml-auto"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight /> : <Menu />}
        </Button>
      </div>
      <div className="flex items-center p-4 border-b">
        {!collapsed && (
          <div className="flex flex-1">
            <div className="flex flex-col">
              <select 
                className="text-sm font-medium text-muted-foreground bg-transparent border-none"
                value={userRole}
                onChange={(e) => setUserRole(e.target.value as any)}
              >
                <option value="patient">Patient View</option>
                <option value="doctor">Doctor View</option>
                <option value="pharmacy">Pharmacy View</option>
                <option value="admin">Admin View</option>
              </select>
            </div>
            <ModeToggle />
          </div>
        )}
        {collapsed && <ModeToggle />}
      </div>
      <ScrollArea className="flex-1">
        <div className="px-2 py-2">
          <nav className="grid gap-1">
            {filteredNavItems.map((item, index) => (
              <Link
                key={index}
                to={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  location.pathname === item.href 
                    ? 'bg-primary text-white dark:bg-primary dark:text-white' 
                    : 'bg-transparent hover:bg-muted text-muted-foreground hover:text-foreground dark:hover:bg-muted'
                )}
              >
                <item.icon className={cn('h-4 w-4')} />
                {!collapsed && <span>{item.title}</span>}
              </Link>
            ))}
          </nav>
        </div>
      </ScrollArea>
      <div className="mt-auto p-4 border-t">
        <div className="flex items-center gap-3 rounded-md px-3 py-2">
          <UserCircle className="h-5 w-5 text-muted-foreground" />
          {!collapsed && (
            <span className="text-sm font-medium text-muted-foreground">
              User Profile
            </span>
          )}
        </div>
        <Button 
          variant="ghost" 
          className="w-full mt-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center justify-center gap-2" 
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span>Logout</span>}
        </Button>
      </div>
    </div>
  );
}
