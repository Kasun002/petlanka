import { Routes, Route } from 'react-router-dom';
import AdminShell from '../layouts/AdminShell';
import AuthRoute from '../routes/AuthRoute';
import GuestRoute from '../routes/GuestRoute';
import LoginPage from '../pages/auth/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import ApplicationsPage from '../pages/ApplicationsPage';
import ApplicationReviewPage from '../pages/ApplicationReviewPage';
import PetRegistryPage from '../pages/PetRegistryPage';
import PetDetailPage from '../pages/PetDetailPage';
import OwnersPage from '../pages/OwnersPage';
import ReportsPage from '../pages/ReportsPage';
import AssignPage from '../pages/AssignPage';
import UsersPage from '../pages/UsersPage';
import SettingsPage from '../pages/SettingsPage';

export default function App(): React.JSX.Element {
  return (
    <Routes>
      <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
      <Route element={<AdminShell />}>
        <Route path="/"                 element={<AuthRoute><DashboardPage /></AuthRoute>} />
        <Route path="/applications"     element={<AuthRoute><ApplicationsPage /></AuthRoute>} />
        <Route path="/applications/:id" element={<AuthRoute><ApplicationReviewPage /></AuthRoute>} />
        <Route path="/pets"             element={<AuthRoute><PetRegistryPage /></AuthRoute>} />
        <Route path="/pets/:id"         element={<AuthRoute><PetDetailPage /></AuthRoute>} />
        <Route path="/owners"           element={<AuthRoute><OwnersPage /></AuthRoute>} />
        <Route path="/reports"          element={<AuthRoute><ReportsPage /></AuthRoute>} />
        <Route path="/assign"           element={<AuthRoute><AssignPage /></AuthRoute>} />
        <Route path="/users"            element={<AuthRoute><UsersPage /></AuthRoute>} />
        <Route path="/settings"         element={<AuthRoute><SettingsPage /></AuthRoute>} />
      </Route>
    </Routes>
  );
}
