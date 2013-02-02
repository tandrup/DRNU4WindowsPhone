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
            });
        });
    };
    Greeter.prototype.stop = function () {
        //clearTimeout(this.timerToken);
            };
    return Greeter;
})();
window.onload = function () {
    var el = document.getElementById('content');
    var greeter = new Greeter(el);
    greeter.start();
};
//@ sourceMappingURL=app.js.map
