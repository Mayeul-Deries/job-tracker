import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '@/router/protectedRoute';

import { Login } from '@/pages/Authentication/login';
import { Register } from '@/pages/Authentication/register';
import { JobApplicationsList } from '@/pages/JobApplication/DataTable/JobApplicationsList';
import { Profile } from '@/pages/Profil/Profile';
import { NotFound } from '@/pages/NotFound';

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/*' element={<NotFound />} />
        <Route
          path='/auth/login'
          element={
            <ProtectedRoute authRequired={false}>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/auth/register'
          element={
            <ProtectedRoute authRequired={false}>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/'
          element={
            <ProtectedRoute authRequired={true}>
              <JobApplicationsList />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile'
          element={
            <ProtectedRoute authRequired={true}>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};
