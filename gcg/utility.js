var utility = {
    GenBoundBox: function(isoLines) {
        if (!isoLines || isoLines.length <= 0) {
            console.log("GLRegions, isoLines is empty");
            return;
        }

        var bound2D = TBound2D();

        for (var i = 0; i < isoLines.length; i++) {
            var line = isoLines[i].isoLine;

            if (!line || line.length == 0) {
                continue;
            }

            for (var pointIndex = 1; pointIndex < line.length; pointIndex++) {
                bound2D.SetBound(line[pointIndex].x, line[pointIndex].y);
            }
        }

        return bound2D;
    }
}


var GetMouseKeys = function(event) {
    var obj = {
        left: null,
        middle: null,
        right: null,
        shift: null,
        ctrl: null,
        alt: null
    }
    obj.left = event.which == 1;
    obj.middle = event.which == 2;
    obj.right = event.which == 3;
    obj.shift = event.shiftKey;
    obj.ctrl = event.ctrlKey;
    obj.alt = event.altKey;

    return obj;
}


var addEvent = (function(window, undefined) {
    var _eventCompat = function(event) {
        var type = event.type;
        if (type == 'DOMMouseScroll' || type == 'mousewheel') {
            event.delta = (event.wheelDelta) ? event.wheelDelta / 120 : -(event.detail || 0) / 3;
        }
        //alert(event.delta);
        if (event.srcElement && !event.target) {
            event.target = event.srcElement;
        }
        if (!event.preventDefault && event.returnValue !== undefined) {
            event.preventDefault = function() {
                event.returnValue = false;
            };
        }
        /*
           ......其他一些兼容性处理 */
        return event;
    };
    if (window.addEventListener) {
        return function(el, type, fn, capture) {
            if (type === "mousewheel" && document.mozHidden !== undefined) {
                type = "DOMMouseScroll";
            }
            el.addEventListener(type, function(event) {
                fn.call(this, _eventCompat(event));
            }, capture || false);
        }
    } else if (window.attachEvent) {
        return function(el, type, fn, capture) {
            el.attachEvent("on" + type, function(event) {
                event = event || window.event;
                fn.call(el, _eventCompat(event));
            });
        }
    }
    return function() {};
})(window);


// addEvent(document, "mousewheel", function(event) {
//     if (event.delta < 0) {
//         alert("鼠标向上滚了！");
//     }
// });
