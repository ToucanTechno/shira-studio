'use client'

import { useEffect, useState } from 'react';
import { Alert, AlertIcon, AlertTitle, AlertDescription, Box, Progress, Text } from '@chakra-ui/react';
import { logger } from '../utils/logger';

interface CartLockTimerProps {
    lockExpiresAt?: string;
    onExpire: () => void;
}

export const CartLockTimer = ({ lockExpiresAt, onExpire }: CartLockTimerProps) => {
    const [timeRemaining, setTimeRemaining] = useState<number>(0);
    const [showWarning, setShowWarning] = useState<boolean>(false);
    const [warningLevel, setWarningLevel] = useState<'warning' | 'error'>('warning');

    useEffect(() => {
        if (!lockExpiresAt) {
            return;
        }

        const updateTimer = () => {
            const expiresAt = new Date(lockExpiresAt).getTime();
            const now = Date.now();
            const remaining = Math.max(0, expiresAt - now);
            
            setTimeRemaining(remaining);

            // Check if expired
            if (remaining === 0) {
                logger.log('[CART LOCK TIMER] Lock expired, triggering onExpire');
                onExpire();
                return;
            }

            // Show warnings
            const remainingMinutes = remaining / (60 * 1000);
            if (remainingMinutes <= 1) {
                setShowWarning(true);
                setWarningLevel('error');
            } else if (remainingMinutes <= 5) {
                setShowWarning(true);
                setWarningLevel('warning');
            } else {
                setShowWarning(false);
            }
        };

        // Update immediately
        updateTimer();

        // Update every second
        const interval = setInterval(updateTimer, 1000);

        return () => clearInterval(interval);
    }, [lockExpiresAt, onExpire]);

    if (!lockExpiresAt || timeRemaining === 0) {
        return null;
    }

    const totalDuration = 15 * 60 * 1000; // 15 minutes in milliseconds
    const progressValue = (timeRemaining / totalDuration) * 100;
    
    const minutes = Math.floor(timeRemaining / (60 * 1000));
    const seconds = Math.floor((timeRemaining % (60 * 1000)) / 1000);
    const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;

    return (
        <Box my={2}>
            {showWarning && (
                <Alert status={warningLevel} mb={2}>
                    <AlertIcon />
                    <Box>
                        <AlertTitle>
                            {warningLevel === 'error' ? 'זמן אזהרה!' : 'שים לב'}
                        </AlertTitle>
                        <AlertDescription>
                            {warningLevel === 'error' 
                                ? 'פחות מדקה נותרה להשלמת ההזמנה!'
                                : 'פחות מ-5 דקות נותרו להשלמת ההזמנה'}
                        </AlertDescription>
                    </Box>
                </Alert>
            )}
            
            <Box p={3} borderWidth="1px" borderRadius="md" bg="gray.50">
                <Text fontSize="sm" mb={2} textAlign="center">
                    זמן נותר להשלמת ההזמנה: <Text as="span" fontWeight="bold" fontSize="lg">{timeString}</Text>
                </Text>
                <Progress 
                    value={progressValue} 
                    size="sm" 
                    colorScheme={warningLevel === 'error' ? 'red' : warningLevel === 'warning' ? 'orange' : 'green'}
                    hasStripe
                    isAnimated
                />
            </Box>
        </Box>
    );
};