var SmoothOperation = function() {
    var that = this;
    $("canvas").css("cursor", "crosshair");
    this.constructor.apply(that, arguments);
    this.buildContextMenu();
    this.cacheData(clone(state.viewData));
    this.selectedPoints = [];
}


var prototype = SmoothOperation.prototype = new TGLOperation();

prototype.dataChangeConfirmed = false;
prototype.selectedPoints = null;
prototype.selectedPointStartIndex = null;
prototype.selectedPointEndIndex = null;

prototype.buildContextMenu = function() {
    var that = this;
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

                case "apply":
                    view.MouseOK();
                    break;
                case "done":
                    {
                        view.FMouseOperation.dataChangeConfirmed = true;
                        view.MouseCancel();
                        view.MouseOperation(null);
                        break;
                    }
                case "cancel":
                    view.MouseCancel();
                    break;
                case "quit":
                    {
                        view.MouseCancel();
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
                icon: 'context-menu-icon context-menu-icon-quit'
            }
        }
    });
}

prototype.restoreOperation = function() {
  var path = state.getSelectedPath();
  var index = state.getSelectedPathIndex();

  if (path) {
      var points = path.isoLine;
      var start, end;
      if (this.smoothWholePath) {
          this.selectOneSectionOnPath(path, this.selectedPointStartIndex);
      } else if(this.selectedPoints && this.selectedPoints.length >0){
          // var result = adjustSelectedPointsOrder(points, this.selectedPointStartIndex, this.selectedPointEndIndex);
          // if (result == null) {
          //     return;
          // }
          //
          // var start = result.start;
          // var end = (result.end + 1) % points.length;
          //
          // this.selectedPoints = [];
          // for (var i = start; i != end; i = (i + 1) % points.length) {
          //     view.DrawSelectedPoint(points[i]);
          //     this.selectedPoints.push(points[i]);
          // }

        //  this.selectedPoints = [];
          for (var i = 0; i < this.selectedPoints.length; i++) {
              view.DrawSelectedPoint(this.selectedPoints[i]);
          }
      }
  }
}

prototype.OnMouseDown = function(keys, position) {
    console.log("mouse down");
    var view = this.FGLView;
    var nearestPosition = this.OnMouseCapture(position);

    //如果存在最短距离点， 就将当前的等值线设为选定的等值线
    if (nearestPosition) {
        //清楚当前点的hover状态
        view.ClearHoverPoint(nearestPosition.X, nearestPosition.Y);
        this.FGLView.ClearOverlayers();

        if (nearestPosition.lineIndex >= 0) { // means a new line is selected
            var lineIndex = nearestPosition.lineIndex;
            state.setSelectedPath(state.viewData.isoLines[lineIndex], lineIndex);
        }


        // if there is selected points
        if (this.selectedPoints.length > 0) {
            var path = state.getSelectedPath();
            var points = path.isoLine;

            var currentPosition = nearestPosition;

            var result = adjustSelectedPointsOrder(points, this.selectedPointStartIndex, currentPosition.pointIndex);

            if (result == null) {
                return;
            }

            var start = result.start;
            var end = (result.end + 1) % points.length;

            this.selectedPoints = [];
            for (var i = start; i != end; i = (i + 1) % points.length) {
                view.DrawSelectedPoint(points[i]);
                this.selectedPoints.push(points[i]);
            }

            this.selectedPointEndIndex = currentPosition.pointIndex;
        } else {
            // 将当前最近点置于选中状态
            view.DrawSelectedPoint(nearestPosition);
            this.selectedPoints.push(nearestPosition);
            this.selectedPointStartIndex = nearestPosition.pointIndex;
        }
    }
}

prototype.OnMouseDbClick = function(modelPosition) {
    var nearestPosition = this.OnMouseCapture(modelPosition);

    if (!nearestPosition) {
        return;
    }

    if (nearestPosition.lineIndex >= 0) { // means a new line is selected
        state.clearSelectedState();
        var lineIndex = nearestPosition.lineIndex;
        state.setSelectedPath(state.viewData.isoLines[lineIndex], lineIndex);
    }

    var path = state.getSelectedPath();
    this.selectOneSectionOnPath(path,nearestPosition.pointIndex);
}

prototype.selectOneSectionOnPath = function(path, onePointIndex) {
  var points = path.isoLine;
  var start = (onePointIndex + 1) % points.length;
  var end = onePointIndex;

  for (var pointIndex = start; pointIndex != end; pointIndex = (pointIndex + 1) % points.length) {
      var point = points[pointIndex % points.length];
      if (point.B) {
          break;
      }

      view.DrawSelectedPoint(point);
      this.selectedPointEndIndex = pointIndex;
  }

  if (pointIndex != end) {
      start = (onePointIndex - 1 + points.length) % points.length;
      end = onePointIndex;
      for (var pointIndex = start; pointIndex != end; pointIndex = (pointIndex - 1+ points.length) % points.length) {
          var point = points[pointIndex % points.length];
          if (point.B) {
              break;
          }

          view.DrawSelectedPoint(point);
          this.selectedPointStartIndex = pointIndex;
      }

  } else {
      this.selectedPointStartIndex = 0;
      this.selectedPointEndIndex = points.length - 1;
  }

  this.smoothWholePath = true;
}

prototype.OnMouseCapture = function(modelPosition) {
    $("#localPosition").text(Math.floor(modelPosition.X) + ", " + Math.floor(modelPosition.Y));
    var position = modelPosition;
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
        var result = getNearestPointOnPath(points, min, position);
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
    var selectedPoints = [];

    if (path) {
        var points = path.isoLine;
        var start, end;
        if (this.smoothWholePath) {
            start = this.selectedPointStartIndex;
            end = this.selectedPointEndIndex;
            for (var i = start;  i != end; i = (i + 1) % points.length) {
                var point = points[i];
                var newPoint = clone(point);

                var last = (i - 1 + points.length) % points.length;
                var next = (i + 1) % points.length;

                newPoint.X = (points[last].X + 2 * point.X + points[next].X) / 4;
                newPoint.Y = (points[last].Y + 2 * point.Y + points[next].Y) / 4;
                selectedPoints.push(newPoint);

                points[i] = newPoint;
            }
        } else {
            var result = adjustSelectedPointsOrder(points, this.selectedPointStartIndex, this.selectedPointEndIndex);
            if (result == null) {
                return;
            }

            start = result.start;
            end = (result.end + 1) % points.length;
            for (var i = start; i != end; i = (i + 1) % points.length) {
                var point = points[i];
                var newPoint = clone(point);

                var last = (i - 1 + points.length) % points.length;
                var next = (i + 1) % points.length;

                newPoint.X = (points[last].X + 2 * point.X + points[next].X) / 4;
                newPoint.Y = (points[last].Y + 2 * point.Y + points[next].Y) / 4;
                selectedPoints.push(newPoint);

                points[i] = newPoint;
            }
        }
    }

    calculateNotesPosition(path);

    view.Paint();

    for (var i = 0; i < selectedPoints.length; i++) {
        view.DrawSelectedPoint(selectedPoints[i]);
    }
}

prototype.OnMouseCancel = function() {
    this.FGLView.ClearOverlayers();
    this.selectedPoints = [];
    state.clearSelectedState();
    this.selectedPointStartIndex = -1;
    this.selectedPointEndIndex = -1;
    this.smoothWholePath = false;
}

prototype.OnMouseEnd = function() {
    if (!this.dataChangeConfirmed) {
        var data = this.stacks[0];
        state.viewData = data;
        view.Paint();
    } else {

    }

    this.clearCachedData();
    this.OnMouseCancel();

    $("canvas").css("cursor", "default");
    $(".smooth").removeClass("selected");
}
