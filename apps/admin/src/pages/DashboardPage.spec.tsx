import { render, screen } from '@testing-library/react';
import DashboardPage from './DashboardPage';

describe('DashboardPage', () => {
  it('renders stat cards and applications table', () => {
    render(<DashboardPage />);
    expect(screen.getByText('Registered pets')).toBeInTheDocument();
    expect(screen.getByText('Recent applications')).toBeInTheDocument();
  });
});
