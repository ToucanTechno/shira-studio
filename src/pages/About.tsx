import React, {useState} from 'react';
import './About.css'
import { BsFacebook, BsInstagram, BsFillEnvelopePaperFill, BsTrophy } from "react-icons/bs";
import YoutubeEmbed from "../components/home/YoutubeEmbed";
import Footer from "../components/common/Footer";
import {Box, Button, Heading, Text} from "@chakra-ui/react";

const About = () => {
    const [isPublicationsDisplayed, setIsPublicationsDisplayed] = useState(false);
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
            <Box className="about-intro">
                <Text>היצירה עבורי היא תשוקה הנובעת כמיי המעיין. &#10084;</Text>
            </Box>
            <Box className="about-content">
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
                <Button className="button-style"
                        onClick={() => {
                            setIsPublicationsDisplayed(!isPublicationsDisplayed);
                        }}>
                    לצפייה בפרסומים ועוד <BsTrophy />
                </Button>
                <Box className="about-publications"
                     style={{display: (isPublicationsDisplayed) ? 'block' : 'none'}}>
                    <Heading as='h2' size='lg'>
                        קורות חיים ופרסומים
                    </Heading>
                    <Heading as='h3' size='md'>
                        מלגות ופרסים
                    </Heading>
                    <ul>
                        <li>
                            1977-79 מילגות לימודים מתורמים לאקדמיה בצלאל
                        </li>
                        <li>
                            1978 השתתפתי בתחרות תכשיט תעשייתי בזהב.
                        </li>
                        <li>
                            1978- פרס ראשון של האקדמיות לעיצוב, ועירית ירושלים,  עבור עיצוב מתנה לאישיות חשובה.
                        </li>
                        <li>
                            1979    פרס קרן תרבות אמריקה ישראל , מלגת לימודים לשנה, ופרסי עיצוב נוספים.
                        </li>
                        <li>
                            1984-מלגת לימודים באיטליה (משה"ח+משרד החוץ וממשלת איטליה).
                        </li>
                        <li>
                            1980-1981   שנת התמחות במחקר ופיתוח בבצלאל בנושא מעבדת אנדודייז (צביעת אלומיניום) והדרכת סטודנטים. המשכתי להנחות  סטודנטים בעבודות גמר במהלך שנות השמונים.
                        </li>
                        <li>
                            1985-2017 הכשרות רבות בתחומי פדגוגיה  כולל חינוך, טכנולוגיה , תוכנות גראפיות ותקשוב, אמנות  ועוד.
                        </li>
                    </ul>
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
                    <ul>
                        <li>
                            1978 תערוכות של סטודנטים מבצלאל Schmuckmuseum Pforzhim
                        </li>
                        <li>
                            Deusches Goldschmiedehaus Hanau
                        </li>
                        <li>
                            Electrum Gallery, London
                        </li>
                        <li>
                            Bloomingdale's, New York and Philadelphia, USA
                        </li>
                        <li>
                            Hilton hotel , Jerusalem' Israel
                        </li>
                        <li>
                            1979, 1981 1979, Exaplla Gallery, Munich, Germany
                        </li>
                        <li>
                            1979 תערוכה קבוצתית בנושא יודאיקה בבית הכנסת הגדול היכל שלמה בירושלים
                        </li>
                        <li>
                            1981 תערוכה קבוצתית בגלריה הוראס ריכטר יפו תל אביב.
                        </li>
                        <li>
                            1982 תערוכה קבוצתית בתיאטרון ירושלים.
                        </li>
                        <li>
                            1982 השתתפות בתערוכה קבוצתית Multi-media non-precious jewllery 1982 JEWELLRY REDEFINED
                        </li>
                        <li>
                            1982 תערוכה קבוצתית ביפן Modern Israel Jewelry Exhibition Adventure
                        </li>
                        <li>
                            1983 1981, 1982, השתתפות בתערוכה נודדת של בוגרי בצלאל , באירופה בהולנד Zonnehof Muzeum
                        </li>
                        <li>
                            1983 בוגרי בצלאל באנטורפן- בלגיה Museum Vleeshuis
                        </li>
                        <li>
                            ביפן, טוקיו- באולם התצוגות של לחברת "מיקומוטו"
                        </li>
                        <li>
                            בקנדה, טורנטו Koffler Crnter of the Arts
                        </li>
                        <li>
                            בארה"ב, ממפיס National Ornamental Metal Museum
                        </li>
                        <li>
                            בארה"ב Brandeis University, Rose Museum
                        </li>
                        <li>
                            Magnus Museum, Berkley
                        </li>
                        <li>
                            1982 הצגתי במוזיאון Schmuckmuseum Pforzheim בתערוכה
                        </li>
                        <li>
                            Schmuck 82 Tendenzen?
                        </li>
                        <li>
                            1979-1984 עבודותיי פורסמו בקטלוגים של בצלאל.
                        </li>
                        <li>
                            1982-84 הצגת תכשיטים ומכירה באספקט גלרי ואלקטרום גלרי בלונדון
                        </li>
                        <li>
                            1984 הצגתי ביריד חוצות היוצר תכשיטים מטיטניום ומאלומניום עם ציפויי אנודייז.
                        </li>
                        <li>
                            198201986 הצגתי מזוזות ועבודות בגלריות בפלורידה ארה"ב.
                        </li>
                        <li>
                            1990 International Pearl Design Contest Japan Pearl Promotion Society , Tokyo
                        </li>
                        <li>
                            1982-1992 הצגת תכשיטים ומזוזות ומכירה בבית אות המוצר ירושלים, בגלריה אלף בתל אביב
                        </li>
                        <li>
                            1993- הצגת תכשיטים ומכירה כמחווה לתכשיטי מצרים העיקה בחנות מוזיאון ישראל.
                        </li>
                        <li>
                            1996 הצגת עבודות בגלריית המורים באגף הנוער מוזיאון ישראל.
                        </li>
                        <li>
                            1997 נבחרתי לעצב ולבצע מתנות לתורם לאורט רחובות מקס שיין מארה"ב ולמנכ"ל אורט ישראל שפרש לגמלאות מר ישראל גורלניק.
                        </li>
                        <li>
                            1988 עצבתי קיר זיכרון לחללי אורט רחובות (עץ ומתכת).
                        </li>
                    </ul>
                </Box>
            </Box>
            <Box className="about-video">
                <YoutubeEmbed className="video-container" embedID="9hs-1K53ezA" customBorder={true}/>
            </Box>
            <Footer />
        </Box>
    );
}

export default About;
