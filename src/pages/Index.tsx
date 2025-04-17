
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already authenticated
    const isAuthenticated = localStorage.getItem('healthsync_auth') === 'true';
    const userRole = localStorage.getItem('healthsync_user_role');
    
    if (isAuthenticated && userRole) {
      // Redirect to the user's dashboard based on their role
      navigate(`/${userRole}`);
    } else {
      // Redirect to login page if not authenticated
      navigate('/auth/login');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center animate-pulse">
        <h1 className="text-4xl font-bold mb-4">Loading HealthSync...</h1>
      </div>
    </div>
  );
};

export default Index;
