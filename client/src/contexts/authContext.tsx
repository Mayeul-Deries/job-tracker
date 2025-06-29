import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { UserInterface } from '@/interfaces/User';
import { axiosConfig } from '@/config/axiosConfig';

const AuthContext = createContext<{
  authenticatedUser: UserInterface | null;
  setAuthenticatedUser: React.Dispatch<React.SetStateAction<any>>;
  authLoading: boolean;
}>({
  authenticatedUser: null,
  setAuthenticatedUser: () => {},
  authLoading: true,
});

export const useAuthContext = () => {
  return useContext(AuthContext);
};

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [authenticatedUser, setAuthenticatedUser] = useState<UserInterface | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const getAuthenticatedUser = async () => {
      setAuthLoading(true);
      try {
        const userResponse = await axiosConfig.get('/auth/me');
        const userData = userResponse.data;
        setAuthenticatedUser(userData);
      } catch (error) {
        setAuthenticatedUser(null);
      } finally {
        setAuthLoading(false);
      }
    };

    getAuthenticatedUser();
  }, []);

  return (
    <AuthContext.Provider value={{ authenticatedUser, setAuthenticatedUser, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
