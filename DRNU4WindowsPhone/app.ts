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
        $("#overviewList li").remove();

        var li = $('<li/>');
        li.append($('<a/>', {
            "data-transition": "slide",
            text: "alle",
            click: (e) => {
                this.showSeries(null);
                $.mobile.changePage('#programs');
            }
        }));
        li.appendTo("#overviewList");

        $.each(labels, (key: string, value) => {
            var li = $('<li/>');
            li.append($('<a/>', {
                "data-transition": "slide",
                text: key,
                click: (e) => {
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
            $("#programsTitle").html(label);
        } else {
            series = this.series;
            $("#programsTitle").html("Alle");
        }

        $("#programsList li").remove();
        $.each(series, (index, serie: DRProgramSerie) => {
            var li = $('<li/>');
            var text = serie.title;
            if (label) {
                text = '<img src="http://www.dr.dk/NU/api/programseries/' + serie.slug + '/images/80x80.jpg" class="ui-li-thumb"><h3 class="ui-li-heading">' + serie.title + '</h3><p class="ul-li-desc">' + serie.description + '</p>';
            }
            li.append($('<a/>', {
                "data-transition": "slide",
                html: text,
                click: (e) => {
                    this.retrieveVideos(serie);
                    $.mobile.changePage('#videos');
                    $.mobile.loading('show');
                }
            }));
            li.appendTo("#programsList");
        });
    }

    retrieveVideos(serie: DRProgramSerie) {
        $("#videosTitle").html(serie.title);
        $("#videosList li").remove();
        $.getJSON('http://anyorigin.com/get?url=http%3A//www.dr.dk/NU/api/programseries/' + serie.slug + '/videos&callback=?', (result: DRVideoResult) => this.handleVideos(serie, result.contents));
    }

    private handleVideos(serie: DRProgramSerie, videos: DRVideo[]) {
        $.each(videos, (index, video: DRVideo) => {
            var li = $('<li/>');
            var title = video.title;
            if (title.trim().toLowerCase() == serie.title.trim().toLowerCase() && video.formattedBroadcastTime != null && video.formattedBroadcastTime.trim().length > 0) {
                title = video.formattedBroadcastTime;
            }
            li.append($('<a/>', {
                "data-transition": "slide",
                html: '<img src="http://www.dr.dk/NU/api/videos/' + video.id + '/images/80x80.jpg" class="ui-li-thumb"><h3 class="ui-li-heading">' + title + '</h3><p class="ul-li-desc">' + video.description + '</p>',
                click: (e) => {
                    this.showVideo(video);
                }
            }));
            li.appendTo("#videosList");
        });

        $("#videosList").listview('refresh');
        $.mobile.loading('hide');
    }

    private showVideo(video: DRVideo) {
        $.getJSON('http://anyorigin.com/get?url=' + encodeURIComponent(video.videoManifestUrl) + '&callback=?', (media: AnyOriginResult) => {
            var mediaUrl = media.contents.replace("rtmp://vod.dr.dk/cms/mp4:", "http://vodfiles.dr.dk/");
            mediaUrl = mediaUrl.substring(0, mediaUrl.indexOf("?ID="));
            //this.element.appendChild(document.createElement("br"));
            $("#videosList video").remove();
            var videoHtml = document.createElement('video');
            $("#videos .ui-content").append(videoHtml);
            videoHtml.setAttribute("src", mediaUrl);
            videoHtml.setAttribute("poster", "http://www.dr.dk/NU/api/videos/" + video.id + "/images/400x300.jpg");
            videoHtml.setAttribute("width", "100%");
            videoHtml.setAttribute("controls");
            videoHtml.setAttribute("autoplay");
            $('html, body').scrollTop($("#videos video").offset().top);
        });
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