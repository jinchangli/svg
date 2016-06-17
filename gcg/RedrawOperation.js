var RedrawOperation = function() {
    var that = this;
    this.constructor.apply(that, arguments);
    this.buildContextMenu();
    this.cacheData(clone(state.viewData));
    this.userCanSelectPoint = true;
}

var prototype = RedrawOperation.prototype = new TGLOperation();
prototype.redrawState = null;
prototype.startPoint = null;
prototype.endPoint = null;
prototype.newPoints = null;
prototype.oldPoints = null;
prototype.dataChangeConfirmed = false;
prototype.userCanSelectPoint = null;

prototype.buildContextMenu = function() {

    $.contextMenu({
        selector: '.cutPath',
        trigger: 'none',
        position: function(opt, x, y) {
            opt.$menu.css({
                top: window.event.clientY,
                left: window.event.clientX
            });
        },
        callback: function(key, options) {
            switch (key) {
                case "apply":
                    view.FMouseOperation.MouseOK();
                    break;
                case "done":
                    {
                        view.FMouseOperation.dataChangeConfirmed = true;
                        view.FMouseOperation.MouseOK();
                        view.MouseOperation(null);
                        break;
                    }
                case "cancel":
                    view.FMouseOperation.MouseCancel();
                    break;
                case "quit":
                    {
                        view.FMouseOperation.MouseCancel();
                        view.MouseOperation(null);
                        break;
                    }
            }
        },
        items: {
            "apply": {
                name: "应用"
            },
            "done": {
                name: "确认并结束"
            },
            "cancel": {
                name: "取消"
            },
            "sep1": "---------",
            "quit": {
                name: "结束",
                icon: function() {
                    return 'context-menu-icon context-menu-icon-quit';
                }
            }
        }
    });
}

prototype.getOverlayer = function() {
    return this.FGLView.PointSelectLayerCtx;
}

prototype.drawLines = function(newPosition) {

    var ctx = this.getOverlayer();
    var newPoints = this.newPoints;
    var view = this.FGLView;

    var screenPosition = view.FGLBase.LocalToScreen(newPosition);

    if (newPoints && newPoints.length > 0) {
        ctx.beginPath();
        var lastPosition = view.FGLBase.LocalToScreen(newPoints[newPoints.length - 1]);
        ctx.moveTo(lastPosition.X, lastPosition.Y);
        ctx.lineTo(screenPosition.X, screenPosition.Y);
        ctx.stroke();
    }

    view.DrawSelectedPoint(newPosition);
    this.newPoints.push(newPosition);
}

prototype.OnMouseDown = function(keys, position) {
    // 如果已经选择了一组点，那么用户就不能再选择新的点了，除非取消前面的选择
    if (!this.userCanSelectPoint) {
        return;
    }

    // find the nearest point first
    var view = this.FGLView;
    var nearestPosition = this.OnMouseCapture(position);

    //if there is one
    if (nearestPosition) {

        if (nearestPosition.lineIndex >= 0) { // means a new line is selected
            var lineIndex = nearestPosition.lineIndex;
            state.setSelectedPath(state.viewData.isoLines[lineIndex]);
        }

        //if the redrawState is false
        if (!this.redrawState) {
            //startPoint = nearestPosition
            position = this.startPoint = nearestPosition;
            this.redrawState = true;

            this.newPoints = [];
        }
        //else
        //endPoint = nearestPosition
        else {
            position = this.endPoint = nearestPosition;
            this.redrawState = false;
            this.userCanSelectPoint = false;
            this.drawLines(position);
        }
    }

    if (this.redrawState) {
        this.drawLines(position);
    }

}

prototype.OnMouseMove = function(keys, position, downflag) {
    //  console.log("mouse move with " + downflag);
}

prototype.OnMouseCapture = function(localPosition) {
    $("#localPosition").text(Math.floor(localPosition.X) + ", " + Math.floor(localPosition.Y));

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
                console.log(min);
            }
        }
    } else {
        var points = path.isoLine;
        var result = getNearestPointOnPath(points, min, position);
        if (result) {
            nearestPosition = result.position;
            min = result.distance;
            console.log(min);
        }
    }



    // 应该在local空间中， 只有当需要画的时候才转换
    return nearestPosition;
}

prototype.OnGetPopupMenu = function() {
    $(".cutPath").contextMenu();
}

prototype.OnMouseOK = function() {
    if (!this.newPoints || this.newPoints.length == 0) {
        return;
    }

    // find the current path
    var view = this.FGLView;
    var path = state.getSelectedPath();
    var newPathStart = this.newPoints[0];
    var newPathEnd = this.newPoints[this.newPoints.length - 1];

    // find the shortest path between startPoint and endPoint
    var remainParts = cutOffShorterPart(path.isoLine, function(point) {
            return point.X == newPathStart.X && point.Y == newPathStart.Y;
        },
        function(point) {
            return point.X == newPathEnd.X && point.Y == newPathEnd.Y;
        })

    // replace these points with newPoints
    if (!remainParts) {
        console.log("there is no selected points need to be redraw");
        return;
    }

    var newPathPoints = [];
    if (Array.isArray(remainParts)) {
        if (this.newPoints[0].X == remainParts[0].X && this.newPoints[0].Y == remainParts[0].Y) {
            this.newPoints.pop();
            while (true) {
                var p = this.newPoints.pop();
                if (this.newPoints.length == 1) {
                    break;
                }

                remainParts.push(p);
            }

            newPathPoints = remainParts;
        } else {
            remainParts = remainParts.slice(1, remainParts.length - 1);
            newPathPoints = newPathPoints.concat(this.newPoints, remainParts);
        }
    } else {

        if (remainParts.first[remainParts.first.length - 1].X == this.newPoints[0].X && remainParts.first[remainParts.first.length - 1].Y == this.newPoints[0].Y) {
            this.newPoints = this.newPoints.slice(1, this.newPoints.length);
            newPathPoints = newPathPoints.concat(remainParts.first, this.newPoints, remainParts.second);
        } else {
            while (true) {
                var p = this.newPoints.pop();
                if (this.newPoints.length == 1) {
                    break;
                }

                remainParts.first.push(p);
            }

            newPathPoints = newPathPoints.concat(remainParts.first, remainParts.second);
        }

    }

    path.isoLine = newPathPoints;
    //repaint the whole view

    calculateNotesPosition(path);

    view.Paint();

    state.clearSelectedState();

    this.OnMouseCancel();
}

prototype.OnMouseUndo = function() {
    if (!this.newPoints || this.newPoints.length == 0) {
        return;
    }
    var newPoints = clone(this.newPoints);
    var view = this.FGLView;

    view.ClearOverlayers();
    this.newPoints = [];

    if (newPoints.length > 0) {
        newPoints.pop();

        for (var i = 0; i < newPoints.length; i++) {
            this.drawLines(newPoints[i]);
        }
    }

    if (newPoints.length == 0) {
        this.redrawState = false;
    } else {
        this.redrawState = true;
    }
}

prototype.OnMouseCancel = function() {
    this.FGLView.ClearOverlayers();
    this.newPoints = [];
    this.userCanSelectPoint = true;
}

prototype.OnMouseEnd = function() {
    if (!this.dataChangeConfirmed) {
        var data = this.stacks[0];
        state.viewData = data;
        view.Paint();
    } else {

    }

    this.clearCachedData();

    $("canvas").css("cursor", "default");
    $("#stateButtones button.selected").removeClass("selected");
}
