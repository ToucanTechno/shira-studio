'use client'

import React from 'react';
import { BsArrowDownLeft } from "react-icons/bs";
import './Home.css';
import YoutubeEmbed from "../components/home/YoutubeEmbed";
import Footer from "../components/common/Footer";
import {Box, Button, Flex, Heading, Image, Text} from "@chakra-ui/react";

const Home = () => {
    return (
        <Box className="container">
            <Box className="home-top">
                <Image alt="Jewellery Collage" src="/images/home/top-image_2020-05-30.jpg"/>
                <Box className="button-text-header">
                    <Button className="button-style">צפה בגלריה <BsArrowDownLeft /></Button>
                    <Heading as='h2'>כל תכשיט הוא חוויה חושית ואינטלקטואלית</Heading>
                </Box>
            </Box>
            <Flex className="content-container" w='75%'>
                <Flex direction={['column', 'column', 'row']} grow='0.9' alignItems='center' justifyContent='center'
                      columnGap='8vw' my={4}>
                    <Flex direction='column' alignItems='flex-start' justifyContent='center' w='fit-content' grow='1'>
                        <Heading as='h2'>בהשראת הטבע</Heading>
                        <Text fontSize='lg'>הטבע הוא פלאי ומסקרן.</Text>
                        <Text fontSize='lg'>ילדותי בקיבוץ בצפון הארץ, בעמק החולה, על גדות נהר הירדן. החשיפה לסביבה, לתחומי עניין מהווים
                            עבורי מקור להשראה ויצירה, בצורפות, אמנות ואמנויות.</Text>
                        <Button mt={2} className="button-style">תכשיטים בהשראת הטבע <BsArrowDownLeft/></Button>
                    </Flex>
                    <Box className="image-frame-container">
                        <Image alt="Casuarina necklace" src="/images/home/casuarina-necklace.webp"/>
                    </Box>
                </Flex>
                <Flex direction={['column-reverse', 'column-reverse', 'row']} grow='0.9' alignItems='center'
                      justifyContent='center' columnGap='8vw' my={4}>
                    <Box className="image-frame-container">
                        <Image alt="Nasturtium paint" src="/images/home/nasturtium-paint.webp"/>
                    </Box>
                    <Flex direction='column' alignItems='flex-start' justifyContent='center' w='fit-content' grow='1'>
                        <Heading as='h2'>השראה מעולמי</Heading>
                        <Text fontSize='lg'>משחר ילדותי אהבתי צבע ולצייר.</Text>
                        <Text fontSize='lg'>התנסיתי בטכניקות מגוונות, רישום בעפרונות, פחם, פיילוט. בצבעי שמן, אקריליק, גואש, פסטל, גירים,
                            קולאז', מים-אקוורל ועוד.</Text>
                        <Text fontSize='lg'>משנות התשעים בחרתי להתמקד בצבעי המים, האקוורל, האהובים עלי. הציור באקוורל מהווה עבורי הנאה
                            צרופה ואושר לנשמה.</Text>
                        <Button mt={2} className="button-style">איורים <BsArrowDownLeft/></Button>
                    </Flex>
                </Flex>
                <Flex direction={['column', 'column', 'row']} grow='0.9' alignItems='center'
                      justifyContent='center' columnGap='8vw' my={4}>
                    <Flex direction='column' alignItems='flex-start' justifyContent='center' w='fit-content' grow='1'>
                        <Heading as='h2'>בהשראת תרבויות עמים</Heading>
                        <Text fontSize='lg'>חשיפה לתרבויות עמים ואתנוגרפיה, יצירה מחמרים מהטבע, מלאכה ואמנות מעשית מסקרנים אותי ומהווים
                            מקור
                            ליצירה ומתן ביטוי אישי.</Text>
                        <Button mt={2} className="button-style">אומנויות בעבודת יד <BsArrowDownLeft/></Button>
                    </Flex>
                    <Box className="image-frame-container">
                        <Image alt="Fabric leg bracelets" src="/images/home/fabric-leg-bracelets.webp"/>
                    </Box>
                </Flex>
                <Flex direction={['column-reverse', 'column-reverse', 'row']} grow='0.9' alignItems='center'
                      justifyContent='center' columnGap='8vw' my={4}>
                    <Box className="image-frame-container">
                        <Image alt="Glass peacock" src="/images/home/glass-peacock.webp"/>
                    </Box>
                    <Flex direction='column' alignItems='flex-start' justifyContent='center' w='fit-content' grow='1'>
                        <Heading as='h2'>פיוזינג, עיצוב בזכוכית</Heading>
                        <Text fontSize='lg'>נחשפתי לפיוזינג בסוף שנת 2019. אוהבת מוצרי זכוכית ובעיקר בזכוכית צבעונית. עובדת בזכוית
                            ספקטרום 96. ההשראה
                            נובעת מהטבע והסובב אותי, תוך כדי התנסות בטכניקות מגוונות.</Text>
                        <Button mt={2} className="button-style">אומנות זכוכית <BsArrowDownLeft/></Button>
                    </Flex>
                </Flex>
                <YoutubeEmbed className="video-container" embedID="AV7AnXB6ITs" customBorder={true}/>
                <Text>משחר ילדותי אהבתי ליצור ולעסוק בטכניקות מגוונות.
                    בלימודי בבצלאל התמחייתי במחלקה לצורפות. התכשיט מבחינתי הינו אובייקט שיש מאחריו סיפור, גימיק, דיאלוג, זיכרון, מסר, קומפוזיציה ועניין. התכשיטים והיצירות מיועדים לקהל יעד אקסלוסיבי, לבנות נוער ולכל מין וגיל.
                    אל טכניקות הפיוזינג בזכוכית ואל הריקמה התימנית נחשפתי לאחר אבדן בעלי דוד לירם ז"ל. </Text>
                <Text mb={2}> בעל ואבא אהוב ומוכשר. את האתר אני מקדישה לזכרו.</Text>
                <Image w='100px' mb={2} alt="David Aquarel" src="/images/home/dudi-aqwrel.webp"/>
                <Footer/>
            </Flex>
        </Box>
    )
};

export default Home;