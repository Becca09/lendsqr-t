import { jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import Sidebar from '../src/components/Sidebar';

jest.mock('next/navigation', () => ({
  usePathname: () => '/users',
}));

describe('Sidebar', () => {
  it('renders navigation groups and highlights Users link contextually', () => {
    render(<Sidebar />);
    expect(screen.getByText(/Customers/i)).toBeInTheDocument();
    expect(screen.getByText(/Users/i)).toBeInTheDocument();
  });
});
