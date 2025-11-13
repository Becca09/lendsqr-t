import { render, screen, fireEvent } from '@testing-library/react';
import LoginPage from '../src/app/login/page';

jest.mock('next/navigation', () => {
  const push = jest.fn();
  return {
    useRouter: () => ({ push }),
  };
});

describe('LoginPage', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.resetModules();
  });

  it('renders heading and disabled login button initially', () => {
    render(<LoginPage />);
    expect(screen.getByText(/Welcome!/i)).toBeInTheDocument();
    const btn = screen.getByRole('button', { name: /log in/i });
    expect(btn).toBeDisabled();
  });

  it('logs in with correct credentials and navigates to /users', () => {
    const { useRouter } = require('next/navigation');
    const router = useRouter();

    render(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'user@lendsqr.com' } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'password' } });

    const btn = screen.getByRole('button', { name: /log in/i });
    expect(btn).not.toBeDisabled();

    fireEvent.click(btn);

    expect(localStorage.getItem('auth')).toBe('1');
    expect(router.push).toHaveBeenCalledWith('/users');
  });

  it('shows error on invalid credentials', () => {
    render(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'wrong@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'bad' } });

    // button disabled due to validation (password < 6)
    expect(screen.getByRole('button', { name: /log in/i })).toBeDisabled();

    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'badpass' } });
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument();
  });
});
