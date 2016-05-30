$(function() {

    var bound;
    var originalData;

    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");

    var view = window.view = new TGLView(ctx);
    view.AllowCapture = true;
    view.OnPaint = function() {
        window.ctx = this.Canvas;
        var data = state.viewData;

        view.ClearView();

        view.FGLBase.BeginLocal();

        view.FGLBase.GLRegions(data.isoLines);

        ctx.save();
        view.FGLBase.GLNotesMasks(data.notes, 32, "serif", 1, 1);
        view.FGLBase.GLISOLines(data.isoLines);
        ctx.restore();

        view.FGLBase.GLNotes(data.notes, 1, 1, 32, "serif");

        view.FGLBase.EndLocal();
    }

    var operationForDot = new TGLOperation(view);
    operationForDot.OnMouseDown = function(keys, position) {
        console.log("mouse down");

        var nearestPosition = this.OnMouseCapture(position);

        //如果存在最短距离点， 就将当前的等值线设为选定的等值线
        if (nearestPosition) {
            //清楚当前点的hover状态
            view.ClearHoverPoint(nearestPosition.X, nearestPosition.Y);

            if (nearestPosition.lineIndex >= 0) { // means a new line is selected
                var lineIndex = nearestPosition.lineIndex;
                state.setSelectedPath(state.viewData.isoLines[lineIndex]);
            }


            // if there is selected points
            if (view.HasSelectedPoint()) {
                var index = view.IsPointSelected(nearestPosition);
                if (index != null) {
                    //if the point was selected, we need to unselect all the points between the last selected point and the current ones

                    if (index == 0) {
                        // if this the very first point, unselect all of the points
                        view.UnDrawAllPoints();
                        return;
                    }

                    var lastSelectedPoint = view.GetLastSelectedPoint();
                    var current = nearestPosition;
                    var path = state.getSelectedPath();
                    var points = path.isoLine;

                    var needSelect = false;

                    for (var pointIndex = points.length * 2 - 1; pointIndex >= 0; pointIndex--) {
                        var point = points[pointIndex % points.length];
                        if (point.isBound) {
                            continue;
                        }

                        if (!needSelect) {
                            if (lastSelectedPoint.X == point.X && lastSelectedPoint.Y == point.Y) {
                                view.UnDrawSelectedPoint(point);
                                needSelect = true;
                            }
                        } else {
                            view.UnDrawSelectedPoint(point);
                            if (current.X == point.X && current.Y == point.Y) {
                                break;
                            }
                        }
                    }


                } else {
                    //if the point was not selected, we need to add all the points between the selected ones and the new one to be selected
                    var lastSelectedPoint = view.GetLastSelectedPoint();
                    var current = nearestPosition;
                    var path = state.getSelectedPath();
                    var points = path.isoLine;

                    var needSelect = false;

                    for (var pointIndex = points.length * 2 - 1; pointIndex >= 0; pointIndex--) {
                        var point = points[pointIndex % points.length];
                        if (point.isBound) {
                            continue;
                        }

                        if (!needSelect) {
                            if (lastSelectedPoint.X == point.X && lastSelectedPoint.Y == point.Y) {
                                view.DrawSelectedPoint(point);
                                needSelect = true;
                            }
                        } else {
                            view.DrawSelectedPoint(point);
                            if (current.X == point.X && current.Y == point.Y) {
                                break;
                            }
                        }
                    }
                }
            } else {
                // 将当前最近点置于选中状态
                view.DrawSelectedPoint(nearestPosition);
            }
        }
    }

    operationForDot.OnMouseEnd = function() {
        console.log("mouse end");
    }

    operationForDot.OnMouseMove = function(keys, position, downflag) {
        //  console.log("mouse move with " + downflag);
    }

    operationForDot.OnMouseCapture = function(localPosition) {
        $("#tester").text(Math.floor(localPosition.X) + ", " + Math.floor(localPosition.Y));
        var position = localPosition;
        var min = view.FGLBase.ViewToModel_Vector(TVector2D(3, 3)).X;
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

        // if (nearestPosition) {
        //     var lineIndex = nearestPosition.lineIndex;
        //     nearestPosition = view.FGLBase.LocalToScreen(nearestPosition);
        //     nearestPosition.lineIndex = lineIndex;
        // }

        // 应该在local空间中， 只有当需要画的时候才转换
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

    $("canvas").mousedown(function(event) {
      event.preventDefault();
      event.stopImmediatePropagation();

        var y = event.offsetY;
        var x = event.offsetX;
        view.WMMouseDown(event, x, y);
    });

    $("canvas").mouseup(function(event) {
        event.preventDefault();
        event.stopImmediatePropagation();

        var y = event.offsetY;
        var x = event.offsetX;
        view.WMMouseUp(event, x, y);
    });

    $("canvas").click(function(event) {
        event.preventDefault();
        event.stopImmediatePropagation();
    });


    $("canvas").mousemove(function(event) {
        var y = event.offsetY;
        var x = event.offsetX;

        view.WMMouseMove(event, x, y);
    });

    //放大
    $(".zoomin").click(function(event) {
        view.ZoomViewIn();
        view.Paint();
    });

    //缩小
    $(".zoomout").click(function(event) {
        view.ZoomViewOut();
        view.Paint();
    });

    $(".zoomextent").click(function(event) {
        view.ZoomViewExtent();
        view.Paint();
    });

    $(".smooth").click(function(event) {
        event.stopPropagation();
        var path = state.getSelectedPath();
        var index = state.getSelectedPathIndex();

        if (path) {
            var points = path.isoLine;
            var newPoints = [];

            for (var i = 0; i < points.length; i++) {
                var point = points[i];
                var newPoint = clone(point);

                var last = (i - 1 + points.length) % points.length;
                var next = (i + 1) % points.length;

                if (view.IsPointSelected(point)) {
                    newPoint.X = (points[last].X + 2 * point.X + points[next].X) / 4;
                    newPoint.Y = (points[last].Y + 2 * point.Y + points[next].Y) / 4;
                }

                newPoints.push(newPoint);
            }

            path.isoLine = newPoints;
        }

        view.Paint();
    });

    $(".cutPath").click(function(event) {
        event.stopPropagation();

        cutPathByRemovingDots();
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
            state.viewData = clone(data);
            var bound = utility.GenBoundBox(data.isoLines);
            view.ModelBound(bound);
            view.ZoomViewExtent();
            view.Paint();
        }
    }).fail(function(message) {
        console.log(message);
    });

});
