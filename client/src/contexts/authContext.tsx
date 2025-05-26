import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { UserInterface } from '@/interfaces/User';
import { axiosConfig } from '@/config/axiosConfig';

const AuthContext = createContext<{
  authenticatedUser: UserInterface | null;
  setAuthenticatedUser: React.Dispatch<React.SetStateAction<any>>;
}>({
  authenticatedUser: null,
  setAuthenticatedUser: () => {},
});

export const useAuthContext = () => {
  return useContext(AuthContext);
};

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [authenticatedUser, setAuthenticatedUser] = useState<UserInterface | null>(null);

  useEffect(() => {
    const getAuthenticatedUser = async () => {
      try {
        const userResponse = await axiosConfig.get('/auth/me');
        const userData = await userResponse.data;
        setAuthenticatedUser(userData);
      } catch (error) {
        setAuthenticatedUser(null);
      }
    };

    getAuthenticatedUser();
  }, []);

  return <AuthContext.Provider value={{ authenticatedUser, setAuthenticatedUser }}>{children}</AuthContext.Provider>;
};
