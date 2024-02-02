import React, {Component} from "react";
import ShiraPhoto from "../../assets/images/home/shira-photo.webp";
import ShiraBusinessCard from "../../assets/images/home/shira-business-card.webp";
import './Footer.css'
import {BsArrow90DegUp} from "react-icons/bs";

class Footer extends Component {
    render() {
        return (
            <div className="footer-container">
                <div className="scroll-up-icon">
                    <p onClick={() => {
                        window.scrollTo({top: 0, left: 0, behavior: 'smooth'})
                    }}>חזרו למעלה <BsArrow90DegUp/></p>
                </div>
                <div className="footer-business-card-row">
                    <img className="ImagePortrait" alt="Shira's portrait" src={ShiraPhoto}/>
                    <h2>שירה שוחט לירם<br/>מעצבת תכשיטים ואמנית</h2>
                    <img className="business-card" alt="Shira Business Card" src={ShiraBusinessCard}/>
                </div>
            </div>
        )
    }
}

export default Footer;
