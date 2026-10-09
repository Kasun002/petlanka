import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import DashboardPage from '../pages/DashboardPage';
import LoginPage from '../pages/auth/LoginPage';
import AuthRoute from '../routes/AuthRoute';
import GuestRoute from '../routes/GuestRoute';

export default function App(): React.JSX.Element {
  return (
    <Routes>
      <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
      <Route element={<MainLayout />}>
        <Route path="/" element={<AuthRoute><DashboardPage /></AuthRoute>} />
      </Route>
    </Routes>
  );
}
