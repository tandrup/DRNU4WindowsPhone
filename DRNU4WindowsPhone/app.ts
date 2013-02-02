/// <reference path="jquery.d.ts" />

interface AnyOriginResult {
    contents;
    headers;
    status;
}

interface DRVideo {
    bitrateKbps: number;
    broadcastChannel;
    broadcastTime;
    chapters: any[];
    description: string;
    duration: string;
    expired: bool;
    expireTime: string;
    formattedBroadcastHourForTVSchedule: string;
    formattedBroadcastTime: string;
    formattedBroadcastTimeForTVSchedule: string;
    formattedExpireTime: string;
    height: number;
    id: number;
    isHq: bool;
    premiere: bool;
    programSerieSlug: string;
    publishTime: string;
    rtmpVideoHost: string;
    title: string;
    videoManifestUrl: string;
    videoResourceUrl: string;
    webCmsImagePath: string;
    width: number;

}

interface DRVideoResult extends AnyOriginResult {
    contents: DRVideo[];
}

class Greeter {
    element: HTMLElement;
    span: HTMLElement;
    timerToken: number;
    
    constructor (element: HTMLElement) { 
        this.element = element;
        this.element.innerText += "The time is: ";
        this.span = document.createElement('span');
        this.element.appendChild(this.span);
        this.span.innerText = "Loading";
    }

    start() {
        $.getJSON('http://anyorigin.com/get?url=http%3A//www.dr.dk/NU/api/programseries/max/videos&callback=?',
(data: DRVideoResult) => {
    var video = data.contents[0];
    this.span.innerText = video.videoManifestUrl;
    $.getJSON('http://anyorigin.com/get?url=' + encodeURIComponent(video.videoManifestUrl) + '&callback=?', (media: AnyOriginResult) => {
        var mediaUrl = media.contents.replace("rtmp://vod.dr.dk/cms/mp4:", "http://vodfiles.dr.dk/");
        mediaUrl = mediaUrl.substring(0, mediaUrl.indexOf("?ID="));
        this.element.appendChild(document.createElement("br"));
        var videoHtml = document.createElement('video');
        this.element.appendChild(videoHtml);
        videoHtml.setAttribute("src", mediaUrl);
    });
});
    }

    stop() {
        //clearTimeout(this.timerToken);
    }

}

window.onload = () => {
    var el = document.getElementById('content');
    var greeter = new Greeter(el);
    greeter.start();
};