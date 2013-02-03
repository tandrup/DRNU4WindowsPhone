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
        $("#overviewList").remove("li");
        $.each(labels, function (key, value) {
            var li = $('<li/>');
            li.append($('<a/>', {
                "data-transition": "slide",
                text: key,
                click: function (e) {
                    _this.selectedLabel = key;
                    _this.showSeries(key);
                    $.mobile.changePage('#programs');
                }
            }));
            li.appendTo("#overviewList");
        });
        $("#overviewList").listview('refresh');
    };
    DRModel.prototype.showSeries = function (label) {
        var series = [];
        if(label) {
            $.each(this.series, function (i, serie) {
                $.each(serie.labels, function (i, serieLabel) {
                    if(label == serieLabel) {
                        series.push(serie);
                    }
                });
            });
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
                    $.mobile.changePage('#videos');
                }
            }));
            li.appendTo("#programsList");
        });
        //$("#programsList").listview('refresh');
            };
    DRModel.prototype.retrieveVideos = function () {
        $.getJSON('http://anyorigin.com/get?url=http%3A//www.dr.dk/NU/api/programseries/max/videos&callback=?', this.handleVideos);
    };
    DRModel.prototype.handleVideos = function (result) {
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
