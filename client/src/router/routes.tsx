import { Login } from '@/pages/Authentication/login';
import { Register } from '@/pages/Authentication/register';

import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { ProtectedRoute } from '@/router/protectedRoute';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { t } from 'i18next';
import { CreateJobApplication } from '@/pages/JobApplication/CreateJobApplication';

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
              <h2>Accueil</h2>
              <Link to='/create-application'>
                <Button variant='outline' size='sm'>
                  <Plus />
                  {t('pages.home.button.add_job_application')}
                </Button>
              </Link>
            </ProtectedRoute>
          }
        />

        <Route
          path='/create-application'
          element={
            <ProtectedRoute authRequired={true}>
              <CreateJobApplication />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};
