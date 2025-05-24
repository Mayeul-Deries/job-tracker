import { Login } from '@/pages/Authentication/login';
import { Register } from '@/pages/Authentication/register';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/auth/login' element={<Login />} />
        <Route path='/auth/register' element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
};
