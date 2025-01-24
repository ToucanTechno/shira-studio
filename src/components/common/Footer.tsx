import React, {Component} from "react";
import ShiraPhoto from "../../assets/images/home/shira-photo.webp";
import ShiraBusinessCard from "../../assets/images/home/shira-business-card.webp";
import './Footer.css'
import {BsArrow90DegUp} from "react-icons/bs";
import {Box, Flex, Heading, Icon, Image} from "@chakra-ui/react";

class Footer extends Component {
    render() {
        return (
            <Flex direction='column' alignItems='center'>
                <Box mb={2}>
                    <Heading as='h3' size='sm' _hover={{cursor: 'pointer'}} onClick={() => {
                        window.scrollTo({top: 0, left: 0, behavior: 'smooth'})
                    }}>חזרו למעלה <Icon as={BsArrow90DegUp}/></Heading>
                </Box>
                <Flex columnGap={2} width='100%' alignItems='center'>
                    <Image w='15vw' alt="Shira's portrait" src={ShiraPhoto}/>
                    <Heading flexGrow='1' as='h2' size={['sm', 'md', 'md', 'lg']} color='#cea525' textAlign='center' m={3}>שירה שוחט לירם<br/>מעצבת תכשיטים ואמנית</Heading>
                    <Image w='30vw' alt="Shira Business Card" src={ShiraBusinessCard}/>
                </Flex>
            </Flex>
        )
    }
}

export default Footer;
