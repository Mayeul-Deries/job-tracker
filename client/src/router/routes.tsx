import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '@/router/protectedRoute';

import { Profile } from '@/pages/Profil/Profile';
import { NotFound } from '@/pages/NotFound';
import { JobApplicationsList } from '@/pages/JobApplication/Home/JobApplicationsList';
import { Register } from '@/pages/Authentication/Register';
import { Login } from '@/pages/Authentication/Login';
import { ForgotPassword } from '@/pages/ResetPassword/ForgotPassword';
import { VerifyResetCode } from '@/pages/ResetPassword/VerifyResetCode';
import { ResetPassword } from '@/pages/ResetPassword/ResetPassword';

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='*' element={<NotFound />} />
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
          path='/forgot-password'
          element={
            <ProtectedRoute authRequired={false}>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/verify-reset-code'
          element={
            <ProtectedRoute authRequired={false}>
              <VerifyResetCode />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute authRequired={false}>
              <ResetPassword />
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
