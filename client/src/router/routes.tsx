import { Login } from '@/pages/Authentication/login';
import { Register } from '@/pages/Authentication/register';
import { JobApplicationsList } from '@/pages/JobApplication/DataTable/JobApplicationsList';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '@/router/protectedRoute';

function NotFound() {
  return <h1>Page not found</h1>;
}

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
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

        <Route path='/*' element={<NotFound />} />

        <Route
          path='/'
          element={
            <ProtectedRoute authRequired={true}>
              <JobApplicationsList />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};
