'use client'

import React, { useEffect, useState, useCallback } from 'react';
import { Box, useConst } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import UserProfile from '../components/UserProfile';
import { API_URL } from '../utils/apiConfig';
import { logger } from '../utils/logger';

const Profile = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [checkingAuth, setCheckingAuth] = useState(true);
    const router = useRouter();
    const api = useConst(() => axios.create({baseURL: API_URL}));

    // Function to decode JWT token (same as in Login)
    const decodeToken = useCallback((token: string) => {
        try {
            const payload = token.split('.')[1];
            const decoded = JSON.parse(atob(payload));
            return decoded;
        } catch (error) {
            logger.error('Error decoding token:', error);
            return null;
        }
    }, []);

    // Fetch user details from backend
    const fetchUserDetails = useCallback(async (token: string) => {
        try {
            const response = await api.get('/auth', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return (response.data as any).user;
        } catch (error) {
            logger.error('Error fetching user details:', error);
            return null;
        }
    }, [api]);

    // Check if user is already logged in on component mount
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('authToken');
            if (token) {
                const decodedToken = decodeToken(token);
                if (decodedToken) {
                    // Check if token is still valid (not expired)
                    const currentTime = Date.now() / 1000;
                    if (decodedToken.exp && decodedToken.exp > currentTime) {
                        // Fetch full user details from backend using existing profile endpoint
                        const userDetails = await fetchUserDetails(token);
                        if (userDetails) {
                            setCurrentUser({
                                id: decodedToken.id,
                                email: userDetails.email || 'N/A',
                                user_name: userDetails.user_name || userDetails.username || 'User',
                                role: decodedToken.role || 'user'
                            });
                        } else {
                            // Failed to fetch user details, redirect to login
                            localStorage.removeItem('authToken');
                            router.push('/login');
                        }
                    } else {
                        // Token expired, remove it and redirect to login
                        localStorage.removeItem('authToken');
                        router.push('/login');
                    }
                } else {
                    // Invalid token, redirect to login
                    router.push('/login');
                }
            } else {
                // No token, redirect to login
                router.push('/login');
            }
            setCheckingAuth(false);
        };

        checkAuth();
    }, [router, decodeToken, fetchUserDetails]);

    const handleLogout = useCallback(() => {
        localStorage.removeItem('authToken');
        router.push('/login');
    }, [router]);

    // Show loading while checking authentication
    if (checkingAuth) {
        return <Box>Loading...</Box>;
    }

    // Show user profile if authenticated
    if (currentUser) {
        return <UserProfile user={currentUser} onLogout={handleLogout} />;
    }

    // This shouldn't happen since we redirect to login if no user
    return <Box>No user found</Box>;
};

export default Profile;