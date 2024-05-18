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
                    <Heading as='h3' size='md' _hover={{cursor: 'pointer'}} onClick={() => {
                        window.scrollTo({top: 0, left: 0, behavior: 'smooth'})
                    }}>חזרו למעלה <Icon as={BsArrow90DegUp}/></Heading>
                </Box>
                <Box className="footer-business-card-row">
                    <Image className="ImagePortrait" alt="Shira's portrait" src={ShiraPhoto}/>
                    <Heading as='h2'>שירה שוחט לירם<br/>מעצבת תכשיטים ואמנית</Heading>
                    <Image className="business-card" alt="Shira Business Card" src={ShiraBusinessCard}/>
                </Box>
            </Flex>
        )
    }
}

export default Footer;
