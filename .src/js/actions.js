(function () {
    'use strict';

    window.slides_actions = {};

    slides_actions.entering = function ($prev, $next, callback) {
        $next.removeClass('leaving');
        callback();
    };
    slides_actions.leaving = function ($prev, $next, callback) {
        $prev.addClass('leaving');
        callback();
    };
    slides_actions.video_enter_1 = function ($prev, $next, callback) {
        $('#video').html('<video src="grass.mp4" autoplay="true" loop="true"></video>');
        callback();
    };
    slides_actions.video_enter_2 = function ($prev, $next, callback) {
        $('#video2').html('<video src="clouds.mp4" autoplay="true" loop="true"></video>');
        callback();
    };
    slides_actions.video_leave = function ($prev, $next, callback) {
        $('video').html('');
        callback();
    };

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