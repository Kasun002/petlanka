import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HomePage from './HomePage';

describe('HomePage', () => {
  it('renders pet and notification sections', () => {
    render(<MemoryRouter><HomePage /></MemoryRouter>);
    expect(screen.getAllByRole('heading', { name: /my pets/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('heading', { name: /notifications/i }).length).toBeGreaterThan(0);
  });
});
