import { render, screen } from '@testing-library/react';
import Topbar from '../src/components/Topbar';

describe('Topbar', () => {
  it('renders brand and search input', () => {
    render(<Topbar />);
    expect(screen.getByLabelText(/Lendsqr/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Search for anything/i)).toBeInTheDocument();
  });
});
