$(function() {

    var bound;
    var originalData;

    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");

    var view = new TGLView(ctx);
    view.AllowCapture = true;
    view.OnPaint = function() {
        var ctx = this.Canvas;

        ctx.clearRect(0, 0, $("#canvas").width(), $("#canvas").height());

        view.FGLBase.BeginView();
    }

    var operationForDot = new TGLOperation(view);
    operationForDot.OnMouseDown = function(keys, position) {
        console.log("mouse down");

        // //this.FGLView.Paint();
        // ctx.beginPath();
        // var view = this.FGLView;
        //
        // if (view.Points && view.Points.length > 0) {
        //     ctx.moveTo(view.Points[view.Points.length - 1].X, view.Points[view.Points.length - 1].Y);
        // }
        //
        // //  $.each(view.Points, function(index, ele) {
        // ctx.lineTo(position.X, position.Y);
        // //})
        //
        // ctx.stroke();
        // view.Points.push(position);
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
            if (distance <= 3 && distance < min) {
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

    $(document).keydown(function(event) {
        //  event.preventDefault();
        //event.stopImmediatePropagation();
        view.WMKeyDown(event.which);
    });

    $(document).keyup(function(event) {
        //  event.preventDefault();
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

    $(".save").click(function() {
        var pngUrl = $("#canvas")[0].toDataURL('image/png');
        if ($(".download").length > 0) {

        } else {
            $("<a class='download' download='gcg.png'>下载</a>").insertAfter($(this));
        }

        $(".download").attr("href", pngUrl);
    });

    $.ajax({
        url: "json/geo.json",
        cache: false,
        dataType: "json"
    }).done(function(data) {
        if (data) {
          originalData = data;
            bound = utility.GenBoundBox(data.isoLines);
            view.ModelBound(bound);
            view.ZoomViewExtent();

            view.Paint();
          //  view.FGLBase.GLRegions(data.isoLines);
            view.FGLBase.GLNotesMasks(data.notes, 32, 1,1);
          //  view.FGLBase.GLISOLines(data.isoLines);
            //view.FGLBase.GLNotes(data.notes, 1,1,32,"serif");

        }
    }).fail(function(message) {
        console.log(message);
    });

});
