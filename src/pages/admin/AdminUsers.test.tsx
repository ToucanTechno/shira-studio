import { render, screen, waitFor } from '@testing-library/react';
import UserList from './UserList';

test('renders users from API', async () => {
    render(<UserList />);

    await waitFor(() => {
        expect(screen.getByText(/Alice/i)).toBeInTheDocument();
        expect(screen.getByText(/Bob/i)).toBeInTheDocument();
    });
});