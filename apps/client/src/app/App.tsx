import { Routes, Route } from 'react-router-dom';
import AppShell from '../layouts/AppShell';
import HomePage from '../pages/HomePage';
import PetsPage from '../pages/PetsPage';
import PetDetailPage from '../pages/PetDetailPage';
import ApplyPage from '../pages/ApplyPage';
import ApplicationDetailPage from '../pages/ApplicationDetailPage';
import ProfilePage from '../pages/ProfilePage';
import WelcomePage from '../pages/auth/WelcomePage';
import LoginPage from '../pages/auth/LoginPage';
import OtpVerifyPage from '../pages/auth/OtpVerifyPage';
import RegisterPage from '../pages/auth/RegisterPage';
import AuthRoute from '../routes/AuthRoute';
import GuestRoute from '../routes/GuestRoute';

export default function App(): React.JSX.Element {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <GuestRoute>
            <WelcomePage />
          </GuestRoute>
        }
      />
      <Route
        path="/login"
        element={
          <GuestRoute>
            <LoginPage />
          </GuestRoute>
        }
      />
      <Route
        path="/login/verify"
        element={
          <GuestRoute>
            <OtpVerifyPage />
          </GuestRoute>
        }
      />
      <Route
        path="/register"
        element={
          <AuthRoute>
            <RegisterPage />
          </AuthRoute>
        }
      />
      <Route element={<AppShell />}>
        <Route
          path="/home"
          element={
            <AuthRoute>
              <HomePage />
            </AuthRoute>
          }
        />
        <Route
          path="/pets"
          element={
            <AuthRoute>
              <PetsPage />
            </AuthRoute>
          }
        />
        <Route
          path="/pets/:id"
          element={
            <AuthRoute>
              <PetDetailPage />
            </AuthRoute>
          }
        />
        <Route
          path="/apply"
          element={
            <AuthRoute>
              <ApplyPage />
            </AuthRoute>
          }
        />
        <Route
          path="/applications/:id"
          element={
            <AuthRoute>
              <ApplicationDetailPage />
            </AuthRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <AuthRoute>
              <ProfilePage />
            </AuthRoute>
          }
        />
      </Route>
    </Routes>
  );
}
