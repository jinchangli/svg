var SmoothOperation = function() {
    var that = this;
    $("canvas").css("cursor", "crosshair");
    this.constructor.apply(that, arguments);

    $.contextMenu({
        selector: '.smooth',
        trigger: 'none',
        position: function(opt, x, y) {
            opt.$menu.css({
                top: window.event.clientY,
                left: window.event.clientX
            });
        },
        callback: function(key, options) {
            switch (key) {
                case "done":
                    that.MouseOK();
                    break;
                case "quit":
                    that.MouseCancel();
                    break;
                default:

            }
        },
        items: {
            "done": {
                name: "确认"
            },
            "sep1": "---------",
            "quit": {
                name: "清空",
                icon: function() {
                    return 'context-menu-icon context-menu-icon-quit';
                }
            }
        }
    });
}

var prototype = SmoothOperation.prototype = new TGLOperation();

prototype.OnMouseDown = function(keys, position) {
    console.log("mouse down");
    var view = this.FGLView;
    var nearestPosition = this.OnMouseCapture(position);

    //如果存在最短距离点， 就将当前的等值线设为选定的等值线
    if (nearestPosition) {
        //清楚当前点的hover状态
        view.ClearHoverPoint(nearestPosition.X, nearestPosition.Y);

        if (nearestPosition.lineIndex >= 0) { // means a new line is selected
            var lineIndex = nearestPosition.lineIndex;
            state.setSelectedPath(state.viewData.isoLines[lineIndex], lineIndex);
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


                var current = nearestPosition;

                var points = clone(view.SelectedPoints);

                var needSelect = false;

                for (var pointIndex = points.length - 1; pointIndex >= 0; pointIndex--) {
                    var point = points[pointIndex % points.length];
                    if (point.isBound) {
                        continue;
                    }

                    if (current.X == point.X && current.Y == point.Y) {
                        break;
                    }

                    view.UnDrawSelectedPoint(point);
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

prototype.OnMouseEnd = function() {
    console.log("mouse end");
}

prototype.OnMouseMove = function(keys, position, downflag) {
    //  console.log("mouse move with " + downflag);
}

prototype.OnMouseCapture = function(localPosition) {
    $("#tester").text(Math.floor(localPosition.X) + ", " + Math.floor(localPosition.Y));
    var position = localPosition;
    var min = view.FGLBase.ViewToModel_Vector(TVector2D(3, 3)).X;
    var nearestPosition;
    var path = state.getSelectedPath();

    if (!path) {
        var isoLines = state.viewData.isoLines;
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

prototype.OnGetPopupMenu = function() {
    $(".smooth").contextMenu();
}

prototype.OnMouseOK = function() {
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

    calculateNotesPosition(path);

    view.Paint();
}

prototype.OnMouseCancel = function() {
    this.FGLView.ClearOverlayers();
}
