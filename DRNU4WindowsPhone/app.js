var DRModel = (function () {
    function DRModel() {
    }
    DRModel.prototype.retrieveOverview = function () {
        var _this = this;
        $.mobile.loading('show');
        $.getJSON("http://anyorigin.com/get?url=http%3A//www.dr.dk/NU/api/programseries&callback=?", function (seriesResult) {
            return _this.handleOverview(seriesResult.contents);
        });
    };
    DRModel.prototype.handleOverview = function (series) {
        this.series = series;
        var labels = {
        };
        $.each(this.series, function (i, serie) {
            $.each(serie.labels, function (j, label) {
                return labels[label] = true;
            });
        });
        this.showLabels(labels);
        $.mobile.loading('hide');
    };
    DRModel.prototype.showLabels = function (labels) {
        var _this = this;
        $("#overviewList li").remove();
        $.each(labels, function (key, value) {
            var li = $('<li/>');
            li.append($('<a/>', {
                "data-transition": "slide",
                text: key,
                click: function (e) {
                    _this.showSeries(key);
                    $.mobile.changePage('#programs');
                }
            }));
            li.appendTo("#overviewList");
        });
        $("#overviewList").listview('refresh');
    };
    DRModel.prototype.showSeries = function (label) {
        var _this = this;
        var series = [];
        if(label) {
            $.each(this.series, function (i, serie) {
                $.each(serie.labels, function (i, serieLabel) {
                    if(label == serieLabel) {
                        series.push(serie);
                    }
                });
            });
            $("#programsTitle").html(label);
        } else {
            series = this.series;
        }
        $("#programsList li").remove();
        $.each(series, function (index, serie) {
            var li = $('<li/>');
            li.append($('<a/>', {
                "data-transition": "slide",
                text: serie.title,
                click: function (e) {
                    _this.retrieveVideos(serie.slug);
                    $.mobile.changePage('#videos');
                    $.mobile.loading('show');
                }
            }));
            li.appendTo("#programsList");
        });
    };
    DRModel.prototype.retrieveVideos = function (slug) {
        var _this = this;
        $.getJSON('http://anyorigin.com/get?url=http%3A//www.dr.dk/NU/api/programseries/' + slug + '/videos&callback=?', function (result) {
            return _this.handleVideos(result.contents);
        });
    };
    DRModel.prototype.handleVideos = function (videos) {
        var _this = this;
        $("#videosList li").remove();
        $.each(videos, function (index, video) {
            var li = $('<li/>');
            li.append($('<a/>', {
                "data-transition": "slide",
                text: video.title,
                click: function (e) {
                    _this.showVideo(video);
                }
            }));
            li.appendTo("#videosList");
        });
        $("#videosList").listview('refresh');
        $.mobile.loading('hide');
    };
    DRModel.prototype.showVideo = function (video) {
        $.getJSON('http://anyorigin.com/get?url=' + encodeURIComponent(video.videoManifestUrl) + '&callback=?', function (media) {
            var mediaUrl = media.contents.replace("rtmp://vod.dr.dk/cms/mp4:", "http://vodfiles.dr.dk/");
            mediaUrl = mediaUrl.substring(0, mediaUrl.indexOf("?ID="));
            //this.element.appendChild(document.createElement("br"));
            var videoHtml = document.createElement('video');
            $("#videos .ui-content").append(videoHtml);
            videoHtml.setAttribute("src", mediaUrl);
            videoHtml.setAttribute("poster", "http://www.dr.dk/NU/api/videos/" + video.id + "/images/400x300.jpg");
            videoHtml.setAttribute("width", "100%");
            videoHtml.setAttribute("controls");
            videoHtml.setAttribute("autoplay");
        });
    };
    return DRModel;
})();
var Greeter = (function () {
    function Greeter(element) {
        this.element = element;
        this.element.innerText += "The time is: ";
        this.span = document.createElement('span');
        this.element.appendChild(this.span);
        this.span.innerText = "Loading";
    }
    Greeter.prototype.start = function () {
        var _this = this;
        $.getJSON('http://anyorigin.com/get?url=http%3A//www.dr.dk/NU/api/programseries/max/videos&callback=?', function (data) {
            var video = data.contents[0];
            _this.span.innerText = video.videoManifestUrl;
            $.getJSON('http://anyorigin.com/get?url=' + encodeURIComponent(video.videoManifestUrl) + '&callback=?', function (media) {
                var mediaUrl = media.contents.replace("rtmp://vod.dr.dk/cms/mp4:", "http://vodfiles.dr.dk/");
                mediaUrl = mediaUrl.substring(0, mediaUrl.indexOf("?ID="));
                _this.element.appendChild(document.createElement("br"));
                var videoHtml = document.createElement('video');
                _this.element.appendChild(videoHtml);
                videoHtml.setAttribute("src", mediaUrl);
                videoHtml.setAttribute("poster", "http://www.dr.dk/NU/api/videos/" + video.id + "/images/400x300.jpg");
                videoHtml.setAttribute("width", "100%");
            });
        });
    };
    Greeter.prototype.stop = function () {
        //clearTimeout(this.timerToken);
            };
    return Greeter;
})();
var model = new DRModel();
window.onload = function () {
    model.retrieveOverview();
};
//@ sourceMappingURL=app.js.map
