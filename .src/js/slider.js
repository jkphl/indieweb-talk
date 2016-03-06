(function (global, $) {
    'use strict';

    var CYCLE = true;
    var $slides = $('.slides>li');
    var current = 1;
    var currentStep = 0;
    var currentSteps = [];
    var min_index = 0;
    var max_index = $slides.length - 1;

    // reverse z-index stack so that first slide is on top
    $slides.each(function (i) {
        $(this).css('z-index', max_index - i).data('slide-index', i);
        if (i > 0) {
            $(this).css('display', 'none');
        }
    });

    function call(commands, $prev, $next, callback) {
        (function next() {
            if (0 === commands.length) {
                return callback($prev, $next);
            }
            var action = window.slides_actions[commands.shift()];
            if (action) {
                action($prev, $next, next);
            } else {
                next();
            }
        }());
    }

    function leave($prev, $next, callback) {
        if (!$prev) {
            if (callback) {
                callback();
            }
            return;
        }
        $prev.removeClass('active');
        step($prev, 0);
        var commands = $prev.attr('data-onleave');
        call(commands ? commands.split(',') : [], $prev, $next, callback);
    }

    function enter($prev, $next, callback) {
        var list = 0;
        if (!$next) {
            if (callback) {
                callback();
            }
            return;
        }
        var steps = $next.attr('data-steps');
        if (steps && steps.length) {
            currentSteps = steps.split(' ');
        } else if (list = $next.find('ul li').length) {
            currentSteps = [];
            for (var s = 0; s <= list; ++s) {
                currentSteps.push('step-' + s);
            }
        } else {
            currentSteps = [''];
        }
        step($next, 0);
        var commands = $next.attr('data-onenter');
        call(commands ? commands.split(',') : [], $prev, $next, shuffle);
        setTimeout(function () {
            $next.addClass('active');
        }, 10);
    }

    function shuffle($prev, $next) {
        $slides.css('z-index', min_index);
        if ($prev) {
            $prev.stop().css('z-index', max_index - 1);
        }
        $next.stop().css('z-index', max_index).show().css('display', '');
    }

    function transition(prev, next) {
        window.location.hash = '#' + current;
        leave(-1 === prev ? null : $slides.eq(prev), $slides.eq(next), enter);
    }

    function prev(index, cycle) {
        if (currentStep > 0) {
            step($slides.eq(index), currentStep - 1);
            return index;
        } else {
            var new_index = index - 1;
            return new_index >= min_index ? new_index : cycle ? max_index : min_index;
        }
    }

    function next(index, cycle) {
        if (currentStep < currentSteps.length - 1) {
            step($slides.eq(index), currentStep + 1);
            return index;
        } else {
            var new_index = index + 1;
            return new_index <= max_index ? new_index : cycle ? min_index : max_index;
        }
    }

    function step($slide, step) {
        if (currentSteps[currentStep]) {
            $slide.removeClass(currentSteps[currentStep]);
        }
        currentStep = step;
        if (currentSteps[currentStep]) {
            $slide.addClass(currentSteps[currentStep]);
        }
    }

    function toggleMouse() {
        $('body').css('cursor', 'none' === $('body').css('cursor') ? 'crosshair' : 'none');
    }

    function key_down($event) {
        var old = current;
        switch ($event.keyCode) {
            case 33: // [Page up]
            case 37: // ←
            case 38: // ↑
                current = prev(old, CYCLE);
                break;
            case 32: // [space]
            case 34: // [Page down]
            case 39: // →
            case 40: // ↓
            case 13: // ←┘
                current = next(old, CYCLE);
                break;
            case 27: // [esc]
                return;
            case 17: // [ctrl]
                toggleMouse();
                return;
            default:
                return;
        }
        if (current !== old) {
            transition(old, current);
        }
    }

    function mouse_down($event) {
        //var old = current;
        //current = next(old, CYCLE);
        //transition(old, current, 'forward');
    }

    if (window.location.hash) {
        current = parseInt(location.hash.replace('#', '') || 0, 10) || current;
    }

    $(document).on('keydown', key_down).on('mousedown', mouse_down).ready(function () {
        $('body').css('cursor', 'none');
        transition(0, current);
    });

}(window, window.jQuery));