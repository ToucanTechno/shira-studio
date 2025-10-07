'use client'

import React, {useState} from 'react';
import './About.css'
import { BsFacebook, BsInstagram, BsFillEnvelopePaperFill, BsTrophy } from "react-icons/bs";
import YoutubeEmbed from "../components/home/YoutubeEmbed";
import Footer from "../components/common/Footer";
import {Box, Button, Center, Container, Heading, ListItem, Text, UnorderedList, Collapse} from "@chakra-ui/react";

const About = () => {
    const [isPublicationsDisplayed, setIsPublicationsDisplayed] = useState(false);

    const togglePublications = () => {
        console.log('Button clicked, current state:', isPublicationsDisplayed); // Debug log
        setIsPublicationsDisplayed(!isPublicationsDisplayed);
    };

    return (
        <Box>
            <Box className="about-banner">
                <Box className="about-header">
                    <Heading as='h1' size='xl'>אודות היוצרת</Heading>
                    <hr />
                    <Box className="about-banner-content">
                        <Text>
                            התכשיט מבחינתי הנו אובייקט שיש מאחוריו סיפור, דיאלוג, זיכרונות ילדות, מסר, קומפוזיציה ועניין.
                            <br />
                            היצירה עבורי היא חדווה, תשוקה ואהבה.
                        </Text>
                    </Box>
                </Box>
                <Box className="about-social">
                    <Box className="about-fb">
                        <BsFacebook />
                        <Heading as='h2' size='lg'>Facebook</Heading>
                        <Text>@shiraliramjewelry</Text>
                    </Box>
                    <Box className="about-ig">
                        <BsInstagram />
                        <Heading as='h2' size='lg'>Instagram</Heading>
                        <Text>shiraliram3506</Text>
                    </Box>
                    <Box className="about-email">
                        <BsFillEnvelopePaperFill />
                        <Heading as='h2' size='lg'>Email</Heading>
                        <Text>shiraliram.sh@gmail.com</Text>
                    </Box>
                </Box>
            </Box>
            <Center>
                <Heading as='h2' size='lg' mt={5}>היצירה עבורי היא תשוקה הנובעת כמיי המעיין. &#10084;</Heading>
            </Center>
            <Container maxW='container.xl' color='#888'>
                <Heading as='h2' size='lg'>
                    אמנית בין תחומית
                </Heading>
                <Text>
                    מעצבת תכשיטים, יוצרת מחמרים וטכניקות מגוונות, מציירת, עובדת בזכוכית, מפסלת ורוקמת.
                </Text>
                <Text>
                    בעיצוב התכשיטים משלבת חומרים: זהב K, כסף 925, פלדה, אלומיניום, פרספקס, ניילון, עץ, צדפים, נוצות, חוטים, מייתרים, חרוזים, אבנים, ועוד.
                </Text>
                <Text>
                    מושפעת ביצירותיי מילדותי בקיבוץ כפר בלום – בצפון הארץ  בחייק הטבע, על גדות נהר הירדן, באופק הרי החרמון, הרי נפתלי, והגולן.

                </Text>
                <Text>
                    התכשיט מבחינתי הנו אובייקט שיש מאחוריו סיפור, דיאלוג, מסר, קומפוזיציה ועניין. התכשיטים שאני מעצבת ייחודיים לקהל יעד אקסקלוסיבי, לבנות נוער, ולכל גיל. עיצוב וביצוע התכשיטים בעבודת יד, תכשיט אחד יהיה שונה מהשני.
                </Text>
                <Heading as='h2' size='lg'>
                    הכשרה:
                </Heading>
                <Text>
                    2008 MA בחינוך בנושא טכנולוגיות מידע ותקשורת – סיימתי בהצטיינות.
                </Text>
                <Text>
                    1985 תעודת הוראה לאמנות במדרשה לאמנות רמת השרון – בית ברל, רישיון הוראה לטכנולוגיה וצורפות.
                </Text>
                <Text>
                    1979 BfA מבצלאל – בוגרת המחלקה לעיצוב וצורפות – הישגים בלימודים.
                </Text>
                <Text>
                    במהלך השנים קבלת תעודות הוקרה והצטיינות ממערכות החינוך בארץ ומועמדות לפרס רקנאטי ופרס רוטשילד.
                </Text>
                <Text>
                    בתקופת מגורי בכפר בלום הכשרות רבות באמנויות במכללת תל-חי.
                </Text>
                <Button
                    className="button-style"
                    onClick={togglePublications}
                    rightIcon={<BsTrophy />}
                >
                    {isPublicationsDisplayed ? 'הסתר פרסומים' : 'לצפייה בפרסומים ועוד'}
                </Button>

                <Collapse in={isPublicationsDisplayed} animateOpacity>
                    <Box className="about-publications" mt={4}>
                        <Heading as='h2' size='lg'>
                            קורות חיים ופרסומים
                        </Heading>
                        <Heading as='h3' size='md'>
                            מלגות ופרסים
                        </Heading>
                        <UnorderedList>
                            <ListItem>
                                1977-79 מילגות לימודים מתורמים לאקדמיה בצלאל
                            </ListItem>
                            <ListItem>
                                1978 השתתפתי בתחרות תכשיט תעשייתי בזהב.
                            </ListItem>
                            <ListItem>
                                1978- פרס ראשון של האקדמיות לעיצוב, ועירית ירושלים,  עבור עיצוב מתנה לאישיות חשובה.
                            </ListItem>
                            <ListItem>
                                1979    פרס קרן תרבות אמריקה ישראל , מלגת לימודים לשנה, ופרסי עיצוב נוספים.
                            </ListItem>
                            <ListItem>
                                1984-מלגת לימודים באיטליה (משה"ח+משרד החוץ וממשלת איטליה).
                            </ListItem>
                            <ListItem>
                                1980-1981   שנת התמחות במחקר ופיתוח בבצלאל בנושא מעבדת אנדודייז (צביעת אלומיניום) והדרכת סטודנטים. המשכתי להנחות  סטודנטים בעבודות גמר במהלך שנות השמונים.
                            </ListItem>
                            <ListItem>
                                1985-2017 הכשרות רבות בתחומי פדגוגיה  כולל חינוך, טכנולוגיה , תוכנות גראפיות ותקשוב, אמנות  ועוד.
                            </ListItem>
                        </UnorderedList>
                        <Heading as='h3' size='md'>
                            עבודה
                        </Heading>
                        <Text>
                            1976-1995 למדתי, גרתי ולימדתי בירושלים (אגף הנוער של מוזיאון ישראל- צורפות, בתי ספר תיכון וחט"ב- צורפות, אמנות, עיצוב).
                        </Text>
                        <Text>
                            הוראת צורפות בקורס להכשרה מקצועית, "תל ארזה", משרד העבודה ירושלים.
                        </Text>
                        <Text>
                            ראש אמנות במחנה קיץ בארה"ב.
                        </Text>
                        <Text>
                            1995-2017 לימדתי באורט רחובות (אמנות, אמנות מחשב). הצגתי תוצרי תלמידים בתערוכות והובלתי להישגים, למצויינות ולזכיה בתחרויות.
                        </Text>
                        <Text>
                            2001-2011    יזמת חינוכית המוכרת על ידי הקרן לעידוד יוזמות חינוכיות, רשת אורט, משרד החינוך, וזכייה בהכרה  ובמענקים מהקרן לעידוד יוזמות חינוכיות.
                        </Text>
                        <Text>
                            2001-2017  מדריכה ארצית בין תחומית  ורפרנטית  בקרן לעידוד יוזמות חינוכיות.
                        </Text>
                        <Text>
                            בתקופת ההוראה עיצבתי כרזות תומכות מרחבי למידה.
                        </Text>
                        <Heading as='h3' size='md'>
                            תערוכות ופרסומים כצורפת:
                        </Heading>
                        <UnorderedList>
                            <ListItem>
                                1978 תערוכות של סטודנטים מבצלאל Schmuckmuseum Pforzhim
                            </ListItem>
                            <ListItem>
                                Deusches Goldschmiedehaus Hanau
                            </ListItem>
                            <ListItem>
                                Electrum Gallery, London
                            </ListItem>
                            <ListItem>
                                Bloomingdale's, New York and Philadelphia, USA
                            </ListItem>
                            <ListItem>
                                Hilton hotel , Jerusalem' Israel
                            </ListItem>
                            <ListItem>
                                1979, 1981 1979, Exaplla Gallery, Munich, Germany
                            </ListItem>
                            <ListItem>
                                1979 תערוכה קבוצתית בנושא יודאיקה בבית הכנסת הגדול היכל שלמה בירושלים
                            </ListItem>
                            <ListItem>
                                1981 תערוכה קבוצתית בגלריה הוראס ריכטר יפו תל אביב.
                            </ListItem>
                            <ListItem>
                                1982 תערוכה קבוצתית בתיאטרון ירושלים.
                            </ListItem>
                            <ListItem>
                                1982 השתתפות בתערוכה קבוצתית Multi-media non-precious jewllery 1982 JEWELLRY REDEFINED
                            </ListItem>
                            <ListItem>
                                1982 תערוכה קבוצתית ביפן Modern Israel Jewelry Exhibition Adventure
                            </ListItem>
                            <ListItem>
                                1983 1981, 1982, השתתפות בתערוכה נודדת של בוגרי בצלאל , באירופה בהולנד Zonnehof Muzeum
                            </ListItem>
                            <ListItem>
                                1983 בוגרי בצלאל באנטורפן- בלגיה Museum Vleeshuis
                            </ListItem>
                            <ListItem>
                                ביפן, טוקיו- באולם התצוגות של לחברת "מיקומוטו"
                            </ListItem>
                            <ListItem>
                                בקנדה, טורנטו Koffler Crnter of the Arts
                            </ListItem>
                            <ListItem>
                                בארה"ב, ממפיס National Ornamental Metal Museum
                            </ListItem>
                            <ListItem>
                                בארה"ב Brandeis University, Rose Museum
                            </ListItem>
                            <ListItem>
                                Magnus Museum, Berkley
                            </ListItem>
                            <ListItem>
                                1982 הצגתי במוזיאון Schmuckmuseum Pforzheim בתערוכה
                            </ListItem>
                            <ListItem>
                                Schmuck 82 Tendenzen?
                            </ListItem>
                            <ListItem>
                                1979-1984 עבודותיי פורסמו בקטלוגים של בצלאל.
                            </ListItem>
                            <ListItem>
                                1982-84 הצגת תכשיטים ומכירה באספקט גלרי ואלקטרום גלרי בלונדון
                            </ListItem>
                            <ListItem>
                                1984 הצגתי ביריד חוצות היוצר תכשיטים מטיטניום ומאלומניום עם ציפויי אנודייז.
                            </ListItem>
                            <ListItem>
                                198201986 הצגתי מזוזות ועבודות בגלריות בפלורידה ארה"ב.
                            </ListItem>
                            <ListItem>
                                1990 International Pearl Design Contest Japan Pearl Promotion Society , Tokyo
                            </ListItem>
                            <ListItem>
                                1982-1992 הצגת תכשיטים ומזוזות ומכירה בבית אות המוצר ירושלים, בגלריה אלף בתל אביב
                            </ListItem>
                            <ListItem>
                                1993- הצגת תכשיטים ומכירה כמחווה לתכשיטי מצרים העיקה בחנות מוזיאון ישראל.
                            </ListItem>
                            <ListItem>
                                1996 הצגת עבודות בגלריית המורים באגף הנוער מוזיאון ישראל.
                            </ListItem>
                            <ListItem>
                                1997 נבחרתי לעצב ולבצע מתנות לתורם לאורט רחובות מקס שיין מארה"ב ולמנכ"ל אורט ישראל שפרש לגמלאות מר ישראל גורלניק.
                            </ListItem>
                            <ListItem>
                                1988 עצבתי קיר זיכרון לחללי אורט רחובות (עץ ומתכת).
                            </ListItem>
                        </UnorderedList>
                    </Box>
                </Collapse>

                <Box className="about-video">
                    <YoutubeEmbed className="video-container" embedID="9hs-1K53ezA" customBorder={true}/>
                </Box>
            </Container>
            <Footer />
        </Box>
    );
}

export default About;