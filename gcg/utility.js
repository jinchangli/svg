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

var getFontStyle = function(fontSize, fontFamily) {
    return fontSize + "px" + " " + fontFamily;
}

function clone(obj) {
    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        var copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        var copy = [];
        for (var i = 0, len = obj.length; i < len; ++i) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        var copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}

var getNearestPointOnPath = function(points, min, target) {
    if (!points || points.length == 0) {
        return null;
    }
    var nearsetPosition = null;
    for (var pointIndex = 0; pointIndex < points.length; pointIndex++) {
        var point = points[pointIndex];
        if (point.isBound) {
            continue;
        }

        var pointCoor = TPosition2D(point.x, point.y);
        var distance = pointCoor.sub(target).abs();
        if (distance < min) {
            min = distance;
            nearsetPosition = pointCoor;
        }
    }

    if (nearsetPosition) {
        return {
            position: nearsetPosition,
            distance: min
        };
    } else {
        return null;
    }
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
