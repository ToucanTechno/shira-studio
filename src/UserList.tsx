import { useEffect, useState } from 'react';
import axios from 'axios';

type User = {
    _id: string;
    user_name: string;
    email: string;
    role: string;
};

export default function UserList() {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        axios.get('/api/users').then(res => {
            setUsers(res.data);
        });
    }, []);

    return (
        <ul>
            {users.map(user => (
                <li key={user._id}>
                    {user.user_name} ({user.email}) - {user.role}
                </li>
            ))}
        </ul>
    );
}
