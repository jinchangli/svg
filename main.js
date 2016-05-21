$(function() {

    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");

    var view = new TGLView(ctx);
    view.AllowCapture = true;
    view.OnPaint = function() {
        var ctx = this.Canvas;

        ctx.clearRect(0, 0, $("#canvas").width(), $("#canvas").height());
//    view.FGLBase.BeginView();
//         ctx.fillStyle = "#eee";
//         ctx.fillRect(0,0,800,500);
//
// //
//       // var text = ctx.measureText("Hello");
//
//               ctx.globalCompositeOperation  = "destination-out";
//               ctx.fillStyle = "green";
//               ctx.fillRect(50, 40, 146, 48);
//
//               ctx.globalCompositeOperation  = "source-over";
//               ctx.fillStyle = "red";
//               ctx.font = "48px serif";
//               ctx.textBaseline = "top";
//               ctx.fillText("Hello", 50, 40);
//
//
//                       ctx.beginPath();
//                       ctx.moveTo(0,60);
//                       ctx.lineTo(400, 60);
//                       ctx.stroke();
//
//

// //source-over
//
//         ctx.globalCompositeOperation = "xor";
//
//         ctx.rect(10,10,10,10);
//
//         ctx.fill();
//
//         ctx.rect(10,10,20,20);
//         ctx.fill();
//
//
//         ctx.rect(10,10,10,10);
//
//         ctx.fill();
//
//         ctx.rect(10,10,20,20);
//         ctx.fill();
//



    }

    var operationForDot = new TGLOperation(view);
    operationForDot.OnMouseDown = function(keys, position) {
        console.log("mouse down");

        //this.FGLView.Paint();
        ctx.beginPath();
        var view = this.FGLView;

        if (view.Points && view.Points.length > 0) {
            ctx.moveTo(view.Points[view.Points.length - 1].X, view.Points[view.Points.length - 1].Y);
        }

        //  $.each(view.Points, function(index, ele) {
        ctx.lineTo(position.X, position.Y);
        //})

        ctx.stroke();
        view.Points.push(position);
    }

    operationForDot.OnMouseEnd = function() {
       console.log("mouse end");
    }

    operationForDot.OnMouseMove = function(keys, position, downflag) {
      //  console.log("mouse move with " + downflag);
    }

    operationForDot.OnMouseCapture = function(position) {
       var min = 10000000000;
       var nearsetPosition;

        $.each(this.FGLView.Points, function(index, ele) {
            var distance = ele.sub(position).abs();
            if(distance<=3 && distance<min){
                min = distance;
                nearsetPosition = ele;
            }
        });

        return nearsetPosition;
    }

    operationForDot.OnMouseOK = function(state) {

        this.FGLView.MouseOperation(null);
    }

    view.MouseOperation(operationForDot);

    view.Paint();

    $(document).keydown(function(event) {
        event.preventDefault();
        //event.stopImmediatePropagation();
        view.WMKeyDown(event.which);
    });

    $(document).keyup(function(event) {
        event.preventDefault();
        //event.stopImmediatePropagation();
        view.WMKeyUp(event.which);
    });

    $("#canvas").mousedown(function(event) {
        var y = event.offsetY;
        var x = event.offsetX;
        view.WMMouseDown(event, x, y);
    });

    $("#canvas").mouseup(function(event) {
        var y = event.offsetY;
        var x = event.offsetX;
        view.WMMouseUp(event, x, y);
    });

    $("#canvas").mousemove(function(event) {
        var y = event.offsetY;
        var x = event.offsetX;
        view.WMMouseMove(event, x, y);
    });
});

/**
 * 简易的事件添加方法
 */


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


addEvent(document, "mousewheel", function(event) {
    if (event.delta < 0) {
        alert("鼠标向上滚了！");
    }
});
