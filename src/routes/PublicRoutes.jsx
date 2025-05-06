// routes/PublicRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated } from '../components/utils/auth.js';

const PublicRoute = () => {
  return isAuthenticated() ? <Navigate to="/" /> : <Outlet/>;
};

export default PublicRoute;
