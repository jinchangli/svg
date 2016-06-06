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

var Abs = function() {
  return Math.abs.apply(Math, arguments);
}

var Exp = function() {
  return Math.exp.apply(Math, arguments);
}

var Ceil = function(number) {
   number = number + 0.5;
   return Math.floor(number);
}

var Floor = function() {
  return Math.floor.apply(Math, arguments);
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

    var pointCoor = TPosition2D(point.X, point.Y);
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

    var validOrder = 0;

    for (var j = 0; j < isoLine.isoLine.length - 1; j++) {
      var point = isoLine.isoLine[j];
      if (point.isBound) {
        continue;
      }

      if (validOrder >= note.order) {
        var next = isoLine.isoLine[j + 1]
        note.direction = calculateDirection(TPosition2D(next.X, next.Y).sub(TPosition2D(point.X, point.Y)));
        note.position.X = (next.X + point.X) / 2;
        note.position.Y = (next.Y + point.Y) / 2;
        break;
      }

      validOrder++;
    }
  }
}

var calculateDirection = function(vector) {
  return Math.atan2(vector.Y, vector.X);
}

var cutOffShorterPart = function(points, isStart, isEnd) {

  if (!points || points.length == 0) {
    return null;
  }
  points = clone(points);
  var startIndex = -1;
  var endIndex = -1;

  var length = 2 * points.length;
  var flag = 1;
  for (var i = 0; i < length; i++) {
    var index = i % points.length;
    var p = points[index];
    if (flag == 1) {
      if (isStart(p)) {
        flag = 2;
        startIndex = index;
      }
    }

    if (flag == 2) {
      if (isEnd(p)) {
        flag = 3;
        endIndex = index;
        break;
      }
    }
  }

  if (startIndex > endIndex) {
    var temp = startIndex;
    startIndex = endIndex;
    endIndex = temp;
  }

  if ((endIndex - startIndex) > (points.length / 2)) {
    return points.slice(startIndex, endIndex+1);
  } else {
    return {
      first: points.slice(0, startIndex+1),
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
