$(function() {

    var bound;
    var originalData;

    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");

    var view = window.view = new TGLView(ctx);
    view.AllowCapture = true;
    view.OnPaint = function() {
        window.ctx = this.Canvas;
        var data = originalData;

        ctx.clearRect(0, 0, $("#canvas").width(), $("#canvas").height());

        var bound = utility.GenBoundBox(data.isoLines);
        view.ModelBound(bound);
        view.ZoomViewExtent();
        view.FGLBase.BeginLocal();

        view.FGLBase.GLRegions(data.isoLines);

        ctx.save();
        view.FGLBase.GLNotesMasks(data.notes, 32, "serif", 1, 1);
        view.FGLBase.GLISOLines(data.isoLines);
        ctx.restore();

        view.FGLBase.GLNotes(data.notes, 1, 1, 32, "serif");

         view.FGLBase.EndView();
    }

    var operationForDot = new TGLOperation(view);
    operationForDot.OnMouseDown = function(keys, position) {
        console.log("mouse down");

        var nearestPosition = this.OnMouseCapture(position);

        //如果存在最短距离点， 就将当前的等值线设为选定的等值线
        if (nearestPosition) {
            var lineIndex = nearestPosition.lineIndex;
            state.setSelectedPath(originalData.isoLines[lineIndex]);


            // 将当前最近点置于选中状态
            view.DrawCapturedPoint(nearestPosition.X, nearestPosition.Y);
        }
    }

    operationForDot.OnMouseEnd = function() {
        console.log("mouse end");
    }

    operationForDot.OnMouseMove = function(keys, position, downflag) {
        //  console.log("mouse move with " + downflag);
    }

    operationForDot.OnMouseCapture = function(position) {
        position = view.FGLBase.ViewToLocal(position);
        var min = view.FGLBase.ViewToModel_Vector(TVector2D(3,3)).X;
        var nearestPosition;
        var path = state.getSelectedPath();

        if (!path) {
            var isoLines = this.FGLView.FGLBase.ISOLines;
            for (var lineIndex = 0; lineIndex < isoLines.length; lineIndex++) {
                var line = isoLines[lineIndex];
                var points = line.isoLine;
                if (!points) {
                    continue;
                }

                var result = getNearestPointOnPath(points, min, position);
                if (result) {
                    nearestPosition = result.position;
                    nearestPosition.lineIndex = lineIndex;
                    min = result.distance;
                }
            }
        } else {
            var points = path.isoLine;
            var result = getNearestPointOnPath(points, 3, position);
            if (result) {
                nearestPosition = result.position;
                min = result.distance;
            }
        }

        return nearestPosition;
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

    //放大
    $(".zoomin").mousemove(function(event) {

    });

    //缩小
    $(".zoomout").mousemove(function(event) {
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
            view.Paint();
        }
    }).fail(function(message) {
        console.log(message);
    });

});
