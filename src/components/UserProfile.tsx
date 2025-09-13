import React from 'react';
import { Box, Button, Text, VStack, HStack, Avatar, useColorModeValue } from '@chakra-ui/react';
import { useNavigate } from 'react-router';

interface UserProfileProps {
    user: {
        id: string;
        email: string;
        user_name: string;
        role: string;
    };
    onLogout: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onLogout }) => {
    const navigate = useNavigate();
    const bgColor = useColorModeValue('gray.50', 'gray.700');
    const borderColor = useColorModeValue('gray.200', 'gray.600');

    const handleAdminPanel = () => {
        if (user.role === 'admin') {
            navigate('/control-panel');
        }
    };

    return (
        <Box
            p={6}
            bg={bgColor}
            border="1px"
            borderColor={borderColor}
            borderRadius="lg"
            maxW="400px"
            mx="auto"
        >
            <VStack spacing={4} align="center">
                <Avatar size="lg" name={user.user_name} />

                <VStack spacing={2} textAlign="center">
                    <Text fontSize="xl" fontWeight="bold">
                        Welcome, {user.user_name}!
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                        {user.email}
                    </Text>
                    <Text
                        fontSize="sm"
                        color={user.role === 'admin' ? 'blue.500' : 'gray.600'}
                        fontWeight={user.role === 'admin' ? 'bold' : 'normal'}
                    >
                        Role: {user.role}
                    </Text>
                </VStack>

                <HStack spacing={3} width="100%">
                    {user.role === 'admin' && (
                        <Button
                            colorScheme="blue"
                            onClick={handleAdminPanel}
                            flex={1}
                        >
                            Admin Panel
                        </Button>
                    )}
                    <Button
                        colorScheme="red"
                        variant="outline"
                        onClick={onLogout}
                        flex={1}
                    >
                        Logout
                    </Button>
                </HStack>
            </VStack>
        </Box>
    );
};

export default UserProfile;