import { render, screen, fireEvent, within } from '@testing-library/react';
import UsersPage from '../src/app/users/page';

const push = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push, replace: jest.fn() }),
}));

describe('UsersPage', () => {
  beforeEach(() => {
    localStorage.clear();
    push.mockClear();
    // mark as authenticated
    localStorage.setItem('auth', '1');
  });

  it('renders heading, stats and table headers', async () => {
    render(<UsersPage />);

    expect(await screen.findByText('Users')).toBeInTheDocument();
    expect(screen.getByText('USERS')).toBeInTheDocument();
    expect(screen.getByText('ACTIVE USERS')).toBeInTheDocument();
    expect(screen.getByText('USERS WITH LOANS')).toBeInTheDocument();
    expect(screen.getByText('USERS WITH SAVINGS')).toBeInTheDocument();

    // table headers
    expect(screen.getByText('ORGANIZATION')).toBeInTheDocument();
    expect(screen.getByText('USERNAME')).toBeInTheDocument();
    expect(screen.getByText('EMAIL')).toBeInTheDocument();
    expect(screen.getByText('PHONE NUMBER')).toBeInTheDocument();
    expect(screen.getByText('DATE JOINED')).toBeInTheDocument();
    expect(screen.getByText('STATUS')).toBeInTheDocument();

    // pager summary e.g. "out of 500"
    expect(screen.getByText(/out of 500/i)).toBeInTheDocument();
  });

  it('navigates to user details when clicking View Details', async () => {
    render(<UsersPage />);

    // wait for list render
    expect(await screen.findByText('Users')).toBeInTheDocument();

    const viewButtons = await screen.findAllByRole('button', { name: /view details/i });
    expect(viewButtons.length).toBeGreaterThan(0);

    fireEvent.click(viewButtons[0]);

    expect(push).toHaveBeenCalled();
    const path = (push.mock.calls[0] && push.mock.calls[0][0]) || '';
    expect(path).toMatch(/\/users\/(\d+)/);
  });

  it('changes page size via select', async () => {
    render(<UsersPage />);

    expect(await screen.findByText('Users')).toBeInTheDocument();

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: '20' } });

    // After changing, still shows out of 500
    expect(screen.getByText(/out of 500/i)).toBeInTheDocument();
  });
});
