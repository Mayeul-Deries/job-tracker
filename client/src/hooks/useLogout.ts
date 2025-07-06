import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { axiosConfig } from '../config/axiosConfig';
import { useAuthContext } from '../contexts/authContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export const useLogout = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setAuthenticatedUser } = useAuthContext();
  const { t } = useTranslation();

  const logout = async () => {
    setLoading(true);
    try {
      const response = await axiosConfig.get('/auth/logout');
      localStorage.removeItem('__jt_token');

      toast.success(t(`toast.${response.data.translationKey}`));
      setAuthenticatedUser(null);
      navigate('/login');
    } catch (error: any) {
      toast.error(t(`toast.${error.response.data.translationKey}`));
    } finally {
      setLoading(false);
    }
  };
  return { loading, logout };
};
