import { render, screen, fireEvent } from '@testing-library/react';
import UserDetailsPage from '../src/app/users/[id]/page';

const push = jest.fn();
const replace = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push, replace }),
  useParams: () => ({ id: '1' }),
}));

describe('UserDetailsPage', () => {
  beforeEach(() => {
    localStorage.clear();
    push.mockClear();
    replace.mockClear();
    // auth ok
    localStorage.setItem('auth', '1');
    // provide a deterministic user list with id "1"
    localStorage.setItem('users', JSON.stringify([
      {
        id: '1',
        organization: 'Lendsqr',
        username: 'Grace Effiom',
        email: 'grace@lendsqr.com',
        phoneNumber: '07012345678',
        dateJoined: new Date().toISOString(),
        status: 'Active',
      },
    ]));
  });

  it('renders back link and user details content', async () => {
    render(<UserDetailsPage />);

    // back link
    expect(await screen.findByText(/Back to Users/i)).toBeInTheDocument();

    // page title
    expect(screen.getByText('User Details')).toBeInTheDocument();

    // header shows username
    expect(screen.getByText('Grace Effiom')).toBeInTheDocument();

    // default tab shows Personal Information section
    expect(screen.getByText('Personal Information')).toBeInTheDocument();
  });

  it('switches tabs when clicking tab buttons', async () => {
    render(<UserDetailsPage />);

    expect(await screen.findByText('User Details')).toBeInTheDocument();

    const documentsTab = screen.getByRole('button', { name: /documents/i });
    fireEvent.click(documentsTab);

    expect(screen.getByText(/Placeholder for the “documents” section/i)).toBeInTheDocument();
  });
});
