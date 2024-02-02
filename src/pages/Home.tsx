import React from 'react';
import TopImage from '../assets/images/home/top-image_2020-05-30.jpg';
import CasuarinaNecklace from '../assets/images/home/casuarina-necklace.webp';
import NasturtiumPaint from '../assets/images/home/nasturtium-paint.webp';
import FabricLegBracelets from '../assets/images/home/fabric-leg-bracelets.webp';
import GlassPeacock from '../assets/images/home/glass-peacock.webp';
import DavidAquarel from '../assets/images/home/dudi-aqwrel.webp';
import { BsArrowDownLeft } from "react-icons/bs";
import './Home.css';
import YoutubeEmbed from "../components/home/YoutubeEmbed";
import Footer from "../components/common/Footer";

const Home = () => {
    return (
        <div className="container">
            <div className="home-top">
                <img alt="Jewellery Collage" src={TopImage}/>
                <div className="button-text-header">
                    <button className="button-style">צפה בגלריה <BsArrowDownLeft /></button>
                    <h2>כל תכשיט הוא חוויה חושית ואינטלקטואלית</h2>
                </div>
            </div>
            <div className="content-container">
                <div className="flex-row-horizontal">
                    <div className="article-container">
                        <h2>בהשראת הטבע</h2>
                        <p>הטבע הוא פלאי ומסקרן.</p>
                        <p>ילדותי בקיבוץ בצפון הארץ, בעמק החולה, על גדות נהר הירדן. החשיפה לסביבה, לתחומי עניין מהווים
                            עבורי מקור להשראה ויצירה, בצורפות, אמנות ואמנויות.</p>
                        <button className="button-style">תכשיטים בהשראת הטבע <BsArrowDownLeft/></button>
                    </div>
                    <div className="image-frame-container">
                        <img alt="Casuarina necklace" src={CasuarinaNecklace}/>
                    </div>
                </div>
                <div className="flex-row-horizontal reversed">
                    <div className="image-frame-container">
                        <img alt="Nasturtium paint" src={NasturtiumPaint}/>
                    </div>
                    <div className="article-container">
                        <h2>השראה מעולמי</h2>
                        <p>משחר ילדותי אהבתי צבע ולצייר.</p>
                        <p>התנסיתי בטכניקות מגוונות, רישום בעפרונות, פחם, פיילוט. בצבעי שמן, אקריליק, גואש, פסטל, גירים,
                            קולאז', מים-אקוורל ועוד.</p>
                        <p>משנות התשעים בחרתי להתמקד בצבעי המים, האקוורל, האהובים עלי. הציור באקוורל מהווה עבורי הנאה
                            צרופה ואושר לנשמה.</p>
                        <button className="button-style">איורים <BsArrowDownLeft/></button>
                    </div>
                </div>
                <div className="flex-row-horizontal">
                    <div className="article-container">
                        <h2>בהשראת תרבויות עמים</h2>
                        <p>חשיפה לתרבויות עמים ואתנוגרפיה, יצירה מחמרים מהטבע, מלאכה ואמנות מעשית מסקרנים אותי ומהווים
                            מקור
                            ליצירה ומתן ביטוי אישי.</p>
                        <button className="button-style">אומנויות בעבודת יד <BsArrowDownLeft/></button>
                    </div>
                    <div className="image-frame-container">
                        <img alt="Fabric leg bracelets" src={FabricLegBracelets}/>
                    </div>
                </div>
                <div className="flex-row-horizontal reversed">
                    <div className="image-frame-container">
                        <img alt="Glass peacock" src={GlassPeacock}/>
                    </div>
                    <div className="article-container">
                        <h2>פיוזינג, עיצוב בזכוכית</h2>
                        <p>נחשפתי לפיוזינג בסוף שנת 2019. אוהבת מוצרי זכוכית ובעיקר בזכוכית צבעונית. עובדת בזכוית
                            ספקטרום 96. ההשראה
                            נובעת מהטבע והסובב אותי, תוך כדי התנסות בטכניקות מגוונות.</p>
                        <button className="button-style">אומנות זכוכית <BsArrowDownLeft/></button>
                    </div>
                </div>
                <YoutubeEmbed className="video-container" embedID="AV7AnXB6ITs" customBorder={true}/>
                <span>
                    <p>משחר ילדותי אהבתי ליצור ולעסוק בטכניקות מגוונות.
בלימודי בבצלאל התמחייתי במחלקה לצורפות. התכשיט מבחינתי הינו אובייקט שיש מאחריו סיפור, גימיק, דיאלוג, זיכרון, מסר, קומפוזיציה ועניין. התכשיטים והיצירות מיועדים לקהל יעד אקסלוסיבי, לבנות נוער ולכל מין וגיל.
אל טכניקות הפיוזינג בזכוכית ואל הריקמה התימנית נחשפתי לאחר אבדן בעלי דוד לירם ז"ל. </p>
                    <p> בעל ואבא אהוב ומוכשר. את האתר אני מקדישה לזכרו.</p>
                </span>
                <img className="small-portrait" alt="David Aquarel" src={DavidAquarel}/>
            </div>
            <Footer/>
        </div>
    )
};

export default Home;
