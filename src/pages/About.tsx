import React, {Component} from 'react';
import './About.css'
import { BsFacebook, BsInstagram, BsFillEnvelopePaperFill, BsTrophy } from "react-icons/bs";
import YoutubeEmbed from "../components/home/YoutubeEmbed";
import Footer from "../components/common/Footer";

interface AboutState {
    isPublicationsDisplayed: boolean;
}

class About extends Component<any,AboutState> {
    constructor(props: any) {
        super(props);
        this.state = { isPublicationsDisplayed: false };
    }
    render() {
        return (
            <div className="container">
                <div className="about-banner">
                    <div className="about-header">
                        <h1>אודות היוצרת</h1>
                        <hr />
                        <div className="about-banner-content">
                            <p>
                                התכשיט מבחינתי הנו אובייקט שיש מאחוריו סיפור, דיאלוג, זיכרונות ילדות, מסר, קומפוזיציה ועניין.
                                <br />
                                היצירה עבורי היא חדווה, תשוקה ואהבה.
                            </p>
                        </div>
                    </div>
                    <div className="about-social">
                        <div className="about-fb">
                            <BsFacebook />
                            <h2>Facebook</h2>
                            <p>@shiraliramjewelry</p>
                        </div>
                        <div className="about-ig">
                            <BsInstagram />
                            <h2>Instagram</h2>
                            <p>shiraliram3506</p>
                        </div>
                        <div className="about-email">
                            <BsFillEnvelopePaperFill />
                            <h2>Email</h2>
                            <p>shiraliram.sh@gmail.com</p>
                        </div>
                    </div>
                </div>
                <div className="about-intro">
                    <p>היצירה עבורי היא תשוקה הנובעת כמיי המעיין. &#10084;</p>
                </div>
                <div className="about-content">
                    <h2>
                        אמנית בין תחומית
                    </h2>
                    <p>
                        מעצבת תכשיטים, יוצרת מחמרים וטכניקות מגוונות, מציירת, עובדת בזכוכית, מפסלת ורוקמת.
                    </p>
                    <p>
                        בעיצוב התכשיטים משלבת חומרים: זהב K, כסף 925, פלדה, אלומיניום, פרספקס, ניילון, עץ, צדפים, נוצות, חוטים, מייתרים, חרוזים, אבנים, ועוד.
                    </p>
                    <p>
                        מושפעת ביצירותיי מילדותי בקיבוץ כפר בלום – בצפון הארץ  בחייק הטבע, על גדות נהר הירדן, באופק הרי החרמון, הרי נפתלי, והגולן.

                    </p>
                    <p>
                        התכשיט מבחינתי הנו אובייקט שיש מאחוריו סיפור, דיאלוג, מסר, קומפוזיציה ועניין. התכשיטים שאני מעצבת ייחודיים לקהל יעד אקסקלוסיבי, לבנות נוער, ולכל גיל. עיצוב וביצוע התכשיטים בעבודת יד, תכשיט אחד יהיה שונה מהשני.
                    </p>
                    <h2>
                        הכשרה:
                    </h2>
                    <p>
                        2008 MA בחינוך בנושא טכנולוגיות מידע ותקשורת – סיימתי בהצטיינות.
                    </p>
                    <p>
                        1985 תעודת הוראה לאמנות במדרשה לאמנות רמת השרון – בית ברל, רישיון הוראה לטכנולוגיה וצורפות.
                    </p>
                    <p>
                        1979 BfA מבצלאל – בוגרת המחלקה לעיצוב וצורפות – הישגים בלימודים.
                    </p>
                    <p>
                        במהלך השנים קבלת תעודות הוקרה והצטיינות ממערכות החינוך בארץ ומועמדות לפרס רקנאטי ופרס רוטשילד.
                    </p>
                    <p>
                        בתקופת מגורי בכפר בלום הכשרות רבות באמנויות במכללת תל-חי.
                    </p>
                    <button className="button-style"
                            onClick={() => {
                                this.setState({
                                        isPublicationsDisplayed: !this.state.isPublicationsDisplayed
                                    });
                            }}>
                        לצפייה בפרסומים ועוד <BsTrophy />
                    </button>
                    <div className="about-publications"
                         style={{display: (this.state.isPublicationsDisplayed) ? 'block' : 'none'}}>
                        <h2>
                            קורות חיים ופרסומים
                        </h2>
                        <h3>
                            מלגות ופרסים
                        </h3>
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
                        <h3>
                            עבודה
                        </h3>
                        <p>
                            1976-1995 למדתי, גרתי ולימדתי בירושלים (אגף הנוער של מוזיאון ישראל- צורפות, בתי ספר תיכון וחט"ב- צורפות, אמנות, עיצוב).
                        </p>
                        <p>
                            הוראת צורפות בקורס להכשרה מקצועית, "תל ארזה", משרד העבודה ירושלים.
                        </p>
                        <p>
                            ראש אמנות במחנה קיץ בארה"ב.
                        </p>
                        <p>
                            1995-2017 לימדתי באורט רחובות (אמנות, אמנות מחשב). הצגתי תוצרי תלמידים בתערוכות והובלתי להישגים, למצויינות ולזכיה בתחרויות.
                        </p>
                        <p>
                            2001-2011    יזמת חינוכית המוכרת על ידי הקרן לעידוד יוזמות חינוכיות, רשת אורט, משרד החינוך, וזכייה בהכרה  ובמענקים מהקרן לעידוד יוזמות חינוכיות.
                        </p>
                        <p>
                            2001-2017  מדריכה ארצית בין תחומית  ורפרנטית  בקרן לעידוד יוזמות חינוכיות.
                        </p>
                        <p>
                            בתקופת ההוראה עיצבתי כרזות תומכות מרחבי למידה.
                        </p>
                        <h3>
                            תערוכות ופרסומים כצורפת:
                        </h3>
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
                    </div>
                </div>
                <div className="about-video">
                    <YoutubeEmbed className="video-container" embedID="9hs-1K53ezA" customBorder={true}/>
                </div>
                <Footer />
            </div>
        );
    }
}

export default About;
