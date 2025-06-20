import { useState } from 'react';
import { axiosConfig } from '../config/axiosConfig';
import { useAuthContext } from '../contexts/authContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export const useLogout = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setAuthenticatedUser } = useAuthContext();

  const logout = async () => {
    setLoading(true);
    try {
      const response = await axiosConfig.get('/auth/logout');

      toast.success(response.data.message);
      setAuthenticatedUser(null);
      navigate('/login');
    } catch (error: any) {
      toast.error(error.response.data.error);
    } finally {
      setLoading(false);
    }
  };
  return { loading, logout };
};
