import { Router } from './router/routes';
import { Loading } from './components/customs/Loading';
import { useAuthContext } from './contexts/authContext';
import './index.css';

const App = () => {
  const { authLoading } = useAuthContext();

  if (authLoading) {
    return <Loading />;
  }

  return <Router />;
};

export default App;
