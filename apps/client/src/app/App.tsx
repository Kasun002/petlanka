import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import HomePage from '../pages/HomePage';
import WelcomePage from '../pages/auth/WelcomePage';
import LoginPage from '../pages/auth/LoginPage';
import OtpVerifyPage from '../pages/auth/OtpVerifyPage';
import RegisterPage from '../pages/auth/RegisterPage';
import AuthRoute from '../routes/AuthRoute';
import GuestRoute from '../routes/GuestRoute';

export default function App(): React.JSX.Element {
  return (
    <Routes>
      <Route path="/" element={<GuestRoute><WelcomePage /></GuestRoute>} />
      <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
      <Route path="/login/verify" element={<GuestRoute><OtpVerifyPage /></GuestRoute>} />
      <Route path="/register" element={<AuthRoute><RegisterPage /></AuthRoute>} />
      <Route element={<MainLayout />}>
        <Route path="/home" element={<AuthRoute><HomePage /></AuthRoute>} />
      </Route>
    </Routes>
  );
}
