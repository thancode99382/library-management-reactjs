// routes/PrivateRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated } from '../components/utils/auth.js';
const PrivateRoute = () => {
  return isAuthenticated() ? <Outlet/> : <Navigate to="/login" />;
};

export default PrivateRoute;
