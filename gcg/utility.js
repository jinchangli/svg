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
     return Math.ceil.apply(Math, arguments);
}

var Floor = function() {
  return Math.floor.apply(Math, arguments);
}

Math.log10 = Math.log10 || function(x) {
  return Math.log(x) / Math.LN10;
};

// 最佳值
function BestNumber(x)
{
  if (x > 0)
  {
    var t = Math.log10(x);
    var n = Floor(t);
    x = Math.pow(10.0,t-n);
    if (x >= 5)
      x = 5;
    else if (x >= 2)
      x = 2;
    else
      x = 1;
    return x* Math.pow(10.0,n);
  }
  else if (x < 0)
    return -BestNumber(-x);
  return 0;
}


var bs =
[
  1,2,5,10,20,25,50,100,200,250,500,1000,2000,2500,5000,10000,20000,
  25000,50000,100000,200000,250000,500000,1000000,2000000,2500000,
  5000000,10000000,20000000,25000000,50000000,100000000,200000000
  //,250000000LL,500000000LL,1000000000LL,2000000000LL,2500000000LL
];


// 最佳整数
function BestInteger(x)
{
  if (x > 0)
  {
    var start = 0,  end = bs.length-1;
    var i = Floor(x);
    if (i <= bs[start])
      return bs[start];
    if (i >= bs[end])
      return bs[end];
    while (start < end-1) // 二分搜索
    {
      var w = (start+end)/2;
      if (i > bs[w])
        start = w;
      else if (i < bs[w])
        end = w;
      else
        return bs[w];
    }
    return bs[start];
  }
  else if (x < 0)
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
    if(!note.direction || !note.order || note.order<0){
      continue;
    }

    var validOrder = 0;

    for (var j = 0; j < isoLine.isoLine.length - 1; j++) {
      var point = isoLine.isoLine[j];
      if (point.B ) {
        continue;
      }

      if (validOrder >= note.order) {
        var next = isoLine.isoLine[j + 1]
        note.direction = calculateDirection(TPosition2D(next.X, next.Y).sub(TPosition2D(point.X, point.Y)));
        if(!note.position){
          note.position = TPosition2D();
        }
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

var adjustSelectedPointsOrder = function(points, startIndex, endIndex) {
  if (!points || points.length == 0) {
    return null;
  }

  var pOrderLength = 0;
  var n = points.length;
  for(var i = startIndex; i!=endIndex; i =(i+1)%n){
    var p = points[i];
    if(p.B){
      pOrderLength = -1
      break;
    }

    pOrderLength ++;
  }

  var nOrderLength = 0;
  for(var i = startIndex; i!=endIndex; i =(i-1+n)%n){
    var p = points[i];
    if(p.B){
      nOrderLength=-1
      break;
    }

    pOrderLength ++;
  }

  if(pOrderLength>=0 && nOrderLength >= 0){
      if(pOrderLength<nOrderLength){

      }else{
          var temp = startIndex;
          startIndex = endIndex;
          endIndex = temp;
      }


  }else if(pOrderLength>=0){

  }else if(nOrderLength >= 0){
    var temp = startIndex;
    startIndex = endIndex;
    endIndex = temp;
  }else{
    return null;
  }

  return {start: startIndex, end: endIndex};
}

var cutOffShorterPart = function(points, startIndex, endIndex) {
  points = clone(points);

  if (!points || points.length == 0) {
    return null;
  }

  var result = adjustSelectedPointsOrder(points, startIndex, endIndex);

  if(result == null){
    return null;
  }

  startIndex = result.start;
  endIndex = result.end;

  if (startIndex>endIndex) {
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
