import React, {Component} from "react";
import './YoutubeEmbed.css'

interface YoutubeProps {
    embedID: string;
    className?: string;
    customBorder?: boolean;
};

class YoutubeEmbed extends Component<YoutubeProps> {
    private readonly embedID: string;
    private readonly className: string;
    private readonly customBorder: boolean;

    constructor(props: YoutubeProps) {
        super(props);
        this.embedID = props.embedID;
        this.className = (props.className) ? props.className : '';
        this.customBorder = props.customBorder as boolean;
    }

    /* TODO: get oEmbed info from https://youtube.com/oembed?url=<videourl>&format=json */

    /* for example:
    {
        provider_url: "http://www.youtube.com/"
        title: "Trololo"
        html: "<object width="425" height="344"><param name="movie" value="http://www.youtube.com/v/iwGFalTRHDA?version=3"></param><param name="allowFullScreen" value="true"></param><param name="allowscriptaccess" value="always"></param><embed src="http://www.youtube.com/v/iwGFalTRHDA?version=3" type="application/x-shockwave-flash" width="425" height="344" allowscriptaccess="always" allowfullscreen="true"></embed></object>"
        author_name: "KamoKatt"
        height: 344
        thumbnail_width: 480
        width: 425
        version: "1.0"
        author_url: "http://www.youtube.com/user/KamoKatt"
        provider_name: "YouTube"
        thumbnail_url: "http://i2.ytimg.com/vi/iwGFalTRHDA/hqdefault.jpg"
        type: "video"
        thumbnail_height: 360
     }
     */
    render() {
        /* TODO: should we care about wmode=opaque? */
        let youtubeURL = new URL(`https://www.youtube-nocookie.com/embed/${this.embedID}`)
        let youtubeURLParams = new URLSearchParams({
            'loop': '0',
            'controls': '1',
            'mute': '0'
        });
        youtubeURL = new URL(`${youtubeURL.origin}${youtubeURL.pathname}?${youtubeURLParams.toString()}`)
        return (<iframe className={this.className + ((this.customBorder) ? '' : ' no-border')}
                        allowFullScreen
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        title="Test Title"
                        src={youtubeURL.href}/>
        );
    }
}

export default YoutubeEmbed;
