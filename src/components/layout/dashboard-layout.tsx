
import React, { useEffect } from 'react';
import { Sidebar } from './sidebar';
import { Outlet, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

type DashboardLayoutProps = {
  children?: React.ReactNode;
};

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const navigate = useNavigate();
  
  useEffect(() => {
    
    const isAuthenticated = localStorage.getItem('VAIDIKA_auth') === 'true';
    
    if (!isAuthenticated) {
      
      navigate('/auth/login');
    }
  }, [navigate]);

  return (
    <div className="flex min-h-screen bg-muted/40 dark:bg-background">
      <Sidebar />
      <div className={cn("flex-1 flex flex-col")}>
        <main className="flex-1 overflow-auto p-6">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
}
