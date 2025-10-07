'use client'

import React, { useState } from "react";
import './Footer.css'
import {BsArrow90DegUp} from "react-icons/bs";
import {Box, Flex, Heading, Icon, Image, Container, Modal, ModalOverlay, ModalContent, ModalCloseButton, ModalBody} from "@chakra-ui/react";

const Footer = () => {
    const [isBusinessCardOpen, setIsBusinessCardOpen] = useState(false);

    return (
        <Container maxW='container.xl' px={4}>
            <Flex direction='column' alignItems='center'>
                <Box mb={2}>
                    <Heading as='h3' size='sm' _hover={{cursor: 'pointer'}} onClick={() => {
                        window.scrollTo({top: 0, left: 0, behavior: 'smooth'})
                    }}>חזרו למעלה <Icon as={BsArrow90DegUp}/></Heading>
                </Box>
                <Flex
                    columnGap={2}
                    width='100%'
                    maxWidth='800px'
                    alignItems='center'
                    justifyContent='center'
                >
                    <Image
                        w={['60px', '80px', '100px', '120px']}
                        maxW='120px'
                        alt="Shira's portrait"
                        src="/images/home/shira-photo.webp"
                    />
                    <Heading
                        flexGrow='1'
                        as='h2'
                        size={['sm', 'md', 'md', 'lg']}
                        color='#cea525'
                        textAlign='center'
                        m={3}
                        maxW='400px'
                    >
                        שירה שוחט לירם<br/>מעצבת תכשיטים ואמנית
                    </Heading>
                    <Image
                        w={['120px', '160px', '200px', '240px']}
                        maxW='240px'
                        alt="Shira Business Card"
                        src="/images/home/shira-business-card.webp"
                        cursor="pointer"
                        _hover={{
                            opacity: 0.8,
                            transform: 'scale(1.02)',
                            transition: 'all 0.2s ease'
                        }}
                        onClick={() => setIsBusinessCardOpen(true)}
                    />
                </Flex>
            </Flex>

            {/* Business Card Zoom Modal */}
            <Modal
                isOpen={isBusinessCardOpen}
                onClose={() => setIsBusinessCardOpen(false)}
                size="6xl"
                isCentered
            >
                <ModalOverlay bg="blackAlpha.800" />
                <ModalContent bg="transparent" shadow="none" maxW="90vw" maxH="90vh">
                    <ModalCloseButton
                        color="white"
                        size="lg"
                        bg="blackAlpha.600"
                        _hover={{ bg: "blackAlpha.800" }}
                        borderRadius="full"
                    />
                    <ModalBody p={0} display="flex" alignItems="center" justifyContent="center">
                        <Image
                            src="/images/home/shira-business-card.webp"
                            alt="Shira Business Card - Enlarged"
                            maxW="100%"
                            maxH="100%"
                            objectFit="contain"
                            borderRadius="md"
                        />
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Container>
    )
}

export default Footer;