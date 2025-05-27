import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/authContext';

export const ProtectedRoute = ({
  authRequired,
  children,
}: {
  authRequired: boolean;
  role?: String;
  children: ReactNode;
}) => {
  const { authenticatedUser } = useAuthContext();

  if (authRequired && !authenticatedUser) {
    return <Navigate to='/auth/login' />;
  }

  if (!authRequired && authenticatedUser) {
    return <Navigate to='/' />;
  }

  return children;
};
