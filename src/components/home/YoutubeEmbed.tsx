import React from "react";
import './YoutubeEmbed.css'

interface YoutubeProps {
    embedID: string;
    className?: string;
    customBorder?: boolean;
}

const YoutubeEmbed = ({ embedID, className = '', customBorder = false }: YoutubeProps) => {
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

    /* TODO: should we care about wmode=opaque? */
    const youtubeURL = new URL(`https://www.youtube-nocookie.com/embed/${embedID}`)
    const youtubeURLParams = new URLSearchParams({
        'loop': '0',
        'controls': '1',
        'mute': '0'
    });
    const finalURL = new URL(`${youtubeURL.origin}${youtubeURL.pathname}?${youtubeURLParams.toString()}`)

    return (
        <iframe
            className={className + (customBorder ? '' : ' no-border')}
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            title="Test Title"
            src={finalURL.href}
        />
    );
}

export default YoutubeEmbed;