
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    
    const isAuthenticated = localStorage.getItem('VAIDIKA_auth') === 'true';
    const userRole = localStorage.getItem('VAIDIKA_user_role');
    
    if (isAuthenticated && userRole) {
     
      navigate(`/${userRole}`);
    } else {
      
      navigate('/auth/login');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center animate-pulse">
        <h1 className="text-4xl font-bold mb-4">Loading VAIDIKA...</h1>
      </div>
    </div>
  );
};

export default Index;
