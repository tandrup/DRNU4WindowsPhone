/// <reference path="jquery.d.ts" />
/// <reference path="jquerymobile.d.ts" />

interface AnyOriginResult {
    contents;
    headers;
    status;
}

interface DRProgramSerie {
    slug: string;
    title: string;
    description: string;
    shortName: string;
    newestVideoId: number;
    newestVideoPublishTime: string;
    videoCount: number;
    labels: string[];
    webCmsImagePath: string;
}

interface DRProgramSerieResult extends AnyOriginResult {
    contents: DRProgramSerie[];
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

class DRModel {
    series: DRProgramSerie[];
    selectedLabel: string;

    constructor() {
    }

    retrieveOverview() {
        $.mobile.loading('show');
        $.getJSON("http://anyorigin.com/get?url=http%3A//www.dr.dk/NU/api/programseries&callback=?", (seriesResult: DRProgramSerieResult) => this.handleOverview(seriesResult.contents));
    }

    private handleOverview(series: DRProgramSerie[]) {
        this.series = series;
        var labels = {};
        $.each(this.series, (i, serie: DRProgramSerie) => {
            $.each(serie.labels, (j, label: string) => labels[label] = true);
        });

        this.showLabels(labels);
        $.mobile.loading('hide');
    }

    private showLabels(labels) {
        $("#overviewList").remove("li");
        $.each(labels, (key: string, value) => {
            var li = $('<li/>');
            li.append($('<a/>', {
                "data-transition": "slide",
                text: key,
                click: (e) => {
                    this.selectedLabel = key;
                    this.showSeries(key);
                    $.mobile.changePage('#programs');
                }
            }));
            li.appendTo("#overviewList");
        });

        $("#overviewList").listview('refresh');
    }

    private showSeries(label: string) {
        var series = [];
        if (label) {
            $.each(this.series, (i, serie: DRProgramSerie) => {
                $.each(serie.labels, (i, serieLabel: string) => {
                    if (label == serieLabel) {
                        series.push(serie);
                    }
                });
            });
        } else {
            series = this.series;
        }

        $("#programsList li").remove();
        $.each(series, (index, serie: DRProgramSerie) => {
            var li = $('<li/>');
            li.append($('<a/>', {
                "data-transition": "slide",
                text: serie.title,
                click: (e) => {
                    $.mobile.changePage('#videos');
                }
            }));
            li.appendTo("#programsList");
        });
    }

    retrieveVideos() {
        $.getJSON('http://anyorigin.com/get?url=http%3A//www.dr.dk/NU/api/programseries/max/videos&callback=?', this.handleVideos);
    }

    private handleVideos(result: DRVideoResult) {

    }
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
        videoHtml.setAttribute("poster", "http://www.dr.dk/NU/api/videos/" + video.id + "/images/400x300.jpg");
        videoHtml.setAttribute("width", "100%");
    });
});
    }

    stop() {
        //clearTimeout(this.timerToken);
    }

}

var model = new DRModel();

window.onload = () => {
    model.retrieveOverview();
};