import { Login } from '@/pages/Authentication/login';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/auth/login' element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
};
