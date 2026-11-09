import { Routes, Route } from 'react-router-dom';
import AdminShell from '../layouts/AdminShell';
import DashboardPage from '../pages/DashboardPage';
import LoginPage from '../pages/auth/LoginPage';
import AuthRoute from '../routes/AuthRoute';
import GuestRoute from '../routes/GuestRoute';

export default function App(): React.JSX.Element {
  return (
    <Routes>
      <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
      <Route element={<AdminShell />}>
        <Route path="/" element={<AuthRoute><DashboardPage /></AuthRoute>} />
        {/* future: /applications, /pets, /assign, /users, /settings */}
      </Route>
    </Routes>
  );
}
