(function () {
    'use strict';
    window.slides_actions = {};
    var $timer = $('#oldsite-time');
    window.setInterval(function() {
        var date = new Date;
        $timer.text(date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds());
    }, 1000);
    var $blink = $('.blink');
    var blinkVisible = true;
    window.setInterval(function() {
        blinkVisible = !blinkVisible;
        $blink.css('visibility', blinkVisible ? 'visible' : 'hidden');
    }, 700);
}());
