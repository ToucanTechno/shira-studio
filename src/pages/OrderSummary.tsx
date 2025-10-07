'use client'

import React, { useEffect, useState } from 'react';
import {
    Box,
    Card,
    CardBody,
    CardHeader,
    Heading,
    Text,
    VStack,
    HStack,
    Badge,
    Divider,
    Button,
    Center
} from '@chakra-ui/react';
import { useRouter, useSearchParams } from 'next/navigation';

const OrderSummary = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');
    const [orderDetails, setOrderDetails] = useState(null);

    useEffect(() => {
        if (orderId) {
            // You can fetch order details here if needed
            // For now, we'll just show the order ID
            console.log('Order created with ID:', orderId);
        }
    }, [orderId]);

    const handleContinueShopping = () => {
        router.push('/');
    };

    return (
        <Center minH="60vh" p={4}>
            <Card maxW="500px" w="100%">
                <CardHeader textAlign="center">
                    <Heading size="lg" color="green.500">
                        ההזמנה בוצעה בהצלחה!
                    </Heading>
                </CardHeader>
                <CardBody>
                    <VStack spacing={4} align="stretch">
                        <Box textAlign="center">
                            <Text fontSize="lg" mb={2}>
                                תודה שבחרת בנו!
                            </Text>
                            {orderId && (
                                <HStack justify="center">
                                    <Text>מספר הזמנה:</Text>
                                    <Badge colorScheme="blue" fontSize="md" p={2}>
                                        {orderId}
                                    </Badge>
                                </HStack>
                            )}
                        </Box>

                        <Divider />

                        <Box>
                            <Text fontSize="md" textAlign="center">
                                קיבלת אישור הזמנה במייל<br/>
                                ההזמנה תישלח תוך 2-3 ימי עסקים
                            </Text>
                        </Box>

                        <Divider />

                        <Button
                            colorScheme="blue"
                            onClick={handleContinueShopping}
                            size="lg"
                        >
                            המשך קנייה
                        </Button>
                    </VStack>
                </CardBody>
            </Card>
        </Center>
    );
};

export default OrderSummary;