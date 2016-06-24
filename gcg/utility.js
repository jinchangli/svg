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
                bound2D.SetBound(line[pointIndex].X, line[pointIndex].Y);
            }
        }

        return bound2D;
    }
}

var distance = function(x1, y1, x2, y2) {
    return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
}

var Abs = function() {
    return Math.abs.apply(Math, arguments);
}

var Exp = function() {
    return Math.exp.apply(Math, arguments);
}

var Ceil = function(number) {
    return Math.ceil.apply(Math, arguments);
}

var Floor = function() {
    return Math.floor.apply(Math, arguments);
}

var Min = function() {
    return Math.min.apply(Math, arguments);
}

var Max = function() {
    return Math.max.apply(Math, arguments);
}

Math.log10 = Math.log10 || function(x) {
    return Math.log(x) / Math.LN10;
};

// 最佳值
function BestNumber(x) {
    if (x > 0) {
        var t = Math.log10(x);
        var n = Floor(t);
        x = Math.pow(10.0, t - n);
        if (x >= 5)
            x = 5;
        else if (x >= 2)
            x = 2;
        else
            x = 1;
        return x * Math.pow(10.0, n);
    } else if (x < 0)
        return -BestNumber(-x);
    return 0;
}


var bs = [
    1, 2, 5, 10, 20, 25, 50, 100, 200, 250, 500, 1000, 2000, 2500, 5000, 10000, 20000,
    25000, 50000, 100000, 200000, 250000, 500000, 1000000, 2000000, 2500000,
    5000000, 10000000, 20000000, 25000000, 50000000, 100000000, 200000000
    //,250000000LL,500000000LL,1000000000LL,2000000000LL,2500000000LL
];


// 最佳整数
function BestInteger(x) {
    if (x > 0) {
        var start = 0,
            end = bs.length - 1;
        var i = Floor(x);
        if (i <= bs[start])
            return bs[start];
        if (i >= bs[end])
            return bs[end];
        while (start < end - 1) // 二分搜索
        {
            var w = (start + end) / 2;
            if (i > bs[w])
                start = w;
            else if (i < bs[w])
                end = w;
            else
                return bs[w];
        }
        return bs[start];
    } else if (x < 0)
        return -BestInteger(-x);
    return 0;
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
        if (point.B) {
            continue;
        }

        var pointCoor = TPosition2D(point.X, point.Y);
        var distance = pointCoor.sub(target).abs();
        if (distance < min) {
            min = distance;
            nearsetPosition = pointCoor;
            nearsetPosition.pointIndex = pointIndex;
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

var IsZero = function(vector) {
    return vector.X == 0 && vector.Y == 0;
}

var eventPosition = function(event) {
    return {
        X: event.offsetX,
        Y: event.offsetY
    };
}

var calculateNotesPosition = function(isoLine) {
    if (!isoLine) {
        console.log("calculateNotesPosition, isoLine is emapy");
        return;
    }

    var notes = isoLine.notes;
    if (!notes || notes.length == 0) {
        return;
    }

    for (var i = 0; i < notes.length; i++) {
        var note = notes[i];
        if (note.order < 0) {
            continue;
        }

        var order = note.order;
        var next = (order + 1) % isoLine.isoLine.length;

        var point = isoLine.isoLine[order];
        var nextPoint = isoLine.isoLine[next]

        note.direction = calculateDirection(TPosition2D(nextPoint.X, nextPoint.Y).sub(TPosition2D(point.X, point.Y)));
        // if(isoLine.area < 0){
        //   note.direction = -note.direction;
        // }

        if (!note.position) {
            note.position = TPosition2D();
        }

        note.position.X = (nextPoint.X + point.X) / 2;
        note.position.Y = (nextPoint.Y + point.Y) / 2;
    }
}

var calculateDirection = function(vector) {
    return Math.atan2(vector.Y, vector.X);
}

var adjustSelectedPointsOrder = function(points, startIndex, endIndex) {
    if (!points || points.length == 0) {
        return null;
    }

    var pOrderLength = 0;
    var n = points.length;
    for (var i = startIndex; i != endIndex; i = (i + 1) % n) {
        var p = points[i];
        if (p.B) {
            pOrderLength = -1
            break;
        }

        pOrderLength++;
    }

    var nOrderLength = 0;
    for (var i = startIndex; i != endIndex; i = (i - 1 + n) % n) {
        var p = points[i];
        if (p.B) {
            nOrderLength = -1
            break;
        }

        nOrderLength++;
    }

    if (pOrderLength >= 0 && nOrderLength >= 0) {
        if (pOrderLength < nOrderLength) {

        } else {
            var temp = startIndex;
            startIndex = endIndex;
            endIndex = temp;
        }


    } else if (pOrderLength >= 0) {

    } else if (nOrderLength >= 0) {
        var temp = startIndex;
        startIndex = endIndex;
        endIndex = temp;
    } else {
        return null;
    }

    return {
        start: startIndex,
        end: endIndex
    };
}

var cutOffShorterPart = function(points, startIndex, endIndex) {
    points = clone(points);

    if (!points || points.length == 0) {
        return null;
    }

    var result = adjustSelectedPointsOrder(points, startIndex, endIndex);

    if (result == null) {
        return null;
    }

    startIndex = result.start;
    endIndex = result.end;

    if (startIndex > endIndex) {
        return points.slice(startIndex, endIndex + 1);
    } else {
        return {
            first: points.slice(0, startIndex + 1),
            second: points.slice(endIndex, points.length)
        };
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


function createColorLegend($root, colorTable) {
    var container = $("<div id='colorLegend'></div>");
    for (var i = colorTable.length - 1; i >= 0; i--) {
        var item = colorTable[i];

        var value = Number(item.isoValue).toFixed(0);
        var color = item.isoClr;

        var str = "<div class='item'> <div class='text'>" + value + "</div>   <div class='color' style='background-color:" + color + ";'></div></div>";
        container.append($(str));
    }

    $root.append(container);

}

// var TSimpleRegions::GenNotes(float step)
// {
//   for (int k=0,n = Count(); k<n; ++k)
//     Element(k).GenNotes(step);
// }

var reorderNotes = function(isoLine) {
    var notes = [];
    var n = isoLine.isoLine.length;
    var points = isoLine.isoLine;
    if (n >= 2) {
        var ib = -1;
        for (var i = 0; i < n; ++i) {
            if (points[i].B) {
                ib = i;
                break;
            }
        }

        if (!ib) // 以边界开始
        {
            while (ib < n) {
                var start = -1;
                for (var i = ib + 1; i < n; ++i) {
                    if (!points[i].B) {
                        start = i;
                        break;
                    }
                }

                if (start >= 0) {
                    var end = n;
                    for (var i = start + 1; i < n; ++i) {
                        if (points[i].B) {
                            end = i;
                            break;
                        }
                    }
                    DoGenNotes(start, end, notes, points);
                    ib = end;
                } else {
                    break;
                }
            }
        } else if (ib > 0) //以等值线开始
        {
            var start = 0,
                end = ib;

            for (var i = 1; i < n; ++i) {
                if (!points[n - i].B) {
                    start = n - i;
                    //break;
                } else {
                    break;
                }
            }

            var N = start > 0 ? start : n;
            DoGenNotes(start, end, notes, points);
            while (ib < N) {
                start = end = -1;
                for (var i = ib; i < N; ++i) {
                    if (!points[i].B) {
                        start = i;
                        break;
                    }
                }
                if (start >= 0) {
                    for (var i = start + 1; i < N; ++i) {
                        if (points[i].B) {
                            end = i;
                            break;
                        }
                    }
                }
                if (end >= 0) {
                    DoGenNotes(start, end, notes, points);
                    ib = end;
                } else {
                    break;
                }
            }
        } else //闭合等值线
        {
            DoGenNotes(0, 0, notes, points);
        }
    }

    isoLine.notes = notes;
}

var DoGenNotes = function(start, end, notes, points) {

    var n = points.length;

    if (start < end) {
        var m = end - start;
        if (m >= 2) {
            var lens = [];
            lens[0] = 0.0;

            var j = 0;
            for (var i = 1; i < m; ++i) {

                lens[i] = lens[i - 1] + distance(points[start + i].X, points[start + i].Y, points[start + i - 1].X, points[start + i - 1].Y);
                while (j < i && lens[j] * 2 <= lens[i])
                    ++j;
            }

            notes.push({
                order: start + j - 1
            });
        }
    } else if (start > end) {
        end += n;
        var m = end - start;
        if (m >= 2) {
            var lens = [];
            lens[0] = 0.0;

            var j = 0;
            for (var i = 1; i < m; ++i) {
                lens[i] = lens[i - 1] + distance(points[(start + i) % n].X, points[(start + i) % n].Y, points[(start + i - 1) % n].X, points[(start + i - 1) % n].Y);
                while (j < i && lens[j] * 2 <= lens[i])
                    ++j;
            }
            notes.push({
                order: (start + j - 1) % n
            });
        }
    } else {
        end += n;
        var m = end - start;
        if (m >= 3) {
            notes.push({
                order: (start + end - 1) % n
            });
        }
    }
}

function convertPosition(view, ctx, position) {
    var source = "Model";

    var space = ctx.space;
    if (!space) {
        space = 'Screen';
    }
    if (source !== space) {
        var f = source + "To" + space;
        if (view.FGLBase[f]) {
            return view.FGLBase[f](position);
        } else {
            console.log("没有找到方法");
            return null;
        }
    } else {
        return position;
    }
}

function drawModelText(ctx, position, size, direction, text, textAlign) {
    var baseScale = 1 / 32 * size;
    var font = "32px serif";

    ctx.save();
    ctx.font = font;
    ctx.textAlign = textAlign?textAlign:"center";
    ctx.textBaseline = "middle";
    ctx.translate(position.X, position.Y);
    ctx.scale(baseScale, -baseScale);
    ctx.rotate(-direction);
    ctx.fillText(text, 0, 0);
    ctx.restore();
}

function measureModelText(ctx, text) {
    ctx.font = "32px serif";
    var width = ctx.measureText(text, 0, 0).width;
    var height = 32;

    var aS = view.ViewScale() / 360;
    width = screenToModel(width / aS);
    height = screenToModel(height / aS);

    return {
        w: width,
        h: height
    };
}

function mapToModel(length) {
    return length * view.MapScale();
}

function screenToModel(length) {
    // var v = TVector2D(length, 0);
    // v = view.FGLBase.ViewToModel_Vector(v);
    // return v.X;
    var that = view.FGLBase;

    return length / (that.ViewResolution * that.FViewScale) * that.FMapScale;
}

function planTPositionArray(array) {
    var wells = [];
    if (array) {
        for (var i = 0; i < array.length; i++) {
            var well = array[i];
            wells.push(well.X);
            wells.push(well.Y);
            wells.push(well.Z);
        }
    }
    return wells;
}
