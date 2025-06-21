import { render, screen, waitFor } from '@testing-library/react';
import UserList from './UserList';

test('renders mocked user data', async () => {
    render(<UserList />);

    await waitFor(() => {
        expect(screen.getByText(/shaked/i)).toBeInTheDocument();
        expect(screen.getByText(/test@mail\.com/i)).toBeInTheDocument();
    });
});
