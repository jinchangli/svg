$(function() {

    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");

    var sin = Math.sin(Math.PI/6);
     var cos = Math.cos(Math.PI/6);
     ctx.translate(200, 200);
     var c = 0;
     for (var i=0; i <= 12; i++) {
       c = Math.floor(255 / 12 * i);
       ctx.fillStyle = "rgb(" + c + "," + c + "," + c + ")";
       ctx.fillRect(0, 0, 100, 10);
      // ctx.transform(cos, sin, -sin, cos, 0, 0);
     }

     //ctx.setTransform(-1, 0, 0, 1, 200, 200);
     ctx.fillStyle = "rgba(255, 128, 255, 0.5)";
     ctx.fillRect(0, 50, 100, 100);

     function drawSpirograph(ctx,R,r,O){
       var x1 = R-O;
       var y1 = 0;
       var i  = 1;
       ctx.beginPath();
       ctx.moveTo(x1,y1);
       do {
         if (i>20000) break;
         var x2 = (R+r)*Math.cos(i*Math.PI/72) - (r+O)*Math.cos(((R+r)/r)*(i*Math.PI/72))
         var y2 = (R+r)*Math.sin(i*Math.PI/72) - (r+O)*Math.sin(((R+r)/r)*(i*Math.PI/72))
         ctx.lineTo(x2,y2);
         x1 = x2;
         y1 = y2;
         i++;
       } while (x2 != R-O && y2 != 0 );
       ctx.stroke();
     }

    $(document).keydown(function(event) {
        //event.preventDefault();
        //event.stopImmediatePropagation();
        console.log(event.which);

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
