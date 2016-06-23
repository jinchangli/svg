var CreateBoundsOperation = function() {
    var that = this;
    this.constructor.apply(that, arguments);
    this.buildContextMenu();
    this.cacheData(clone(state.viewData));
    this.userCanSelectPoint = true;
    this.tempBoundsArray = [];
    this.boundsArray = [];
}

var prototype = CreateBoundsOperation.prototype = new TGLOperation();
prototype.tempBoundsArray = null;
prototype.boundsArray = null;

prototype.getOverlayer = function() {
    return this.FGLView.PointSelectLayerCtx;
}

prototype.restoreOperation = function() {

    if (this.tempBoundsArray && this.tempBoundsArray.length > 0) {
      var newPoints = this.tempBoundsArray;
      this.tempBoundsArray = [];

      for (var i = 0; i < newPoints.length; i++) {
          this.drawBorder(newPoints[i]);
      }
    }

    if (this.boundsArray && this.boundsArray.length > 0) {
      this.DrawFindalBorder(this.boundsArray);
    }
}


prototype.OnGetPopupMenu = function() {
    $(".border").contextMenu();
}

prototype.buildContextMenu = function() {
    $.contextMenu({
        selector: '.border',
        trigger: 'none',
        position: function(opt, x, y) {
            opt.$menu.css({
                top: window.event.pageY,
                left: window.event.pageX
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
                        view.Paint();
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
            "done": {
                name: "确认"
            },
            "cancel": {
                name: "取消"
            }
        }
    });
}

prototype.MouseDown = function(keys, position) {

    //if there is one
    if (position) {
        this.drawBorder(TPosition2D(position.X, position.Y));
    }
}


prototype.drawBorder = function(newPosition) {

    var ctx = this.getOverlayer();
    var tempBoundsArray = this.tempBoundsArray;
    var view = this.FGLView;

    var screenPosition = view.FGLBase.ModelToScreen(newPosition);

    if (tempBoundsArray && tempBoundsArray.length > 0) {
        ctx.beginPath();
        var lastPosition = view.FGLBase.ModelToScreen(tempBoundsArray[tempBoundsArray.length - 1]);
        ctx.moveTo(lastPosition.X, lastPosition.Y);
        ctx.lineTo(screenPosition.X, screenPosition.Y);
        ctx.stroke();
    }

    view.DrawSelectedPoint(newPosition);
    this.tempBoundsArray.push(newPosition);
}

prototype.MouseOK = function(params) {
    if (!this.tempBoundsArray || this.tempBoundsArray.length == 0) {
        return;
    }

    var view = this.FGLView;

    view.ClearOverlayers();

    var newPoints = this.tempBoundsArray;
    this.DrawFindalBorder(newPoints);
    this.boundsArray = this.tempBoundsArray;
    this.tempBoundsArray =[];

    view.borderPoints = this.boundsArray;
    this.boundsArray = [];
}

prototype.DrawFindalBorder = function(newPoints) {
  var ctx = this.getOverlayer();

  var lastPosition = view.FGLBase.ModelToScreen(newPoints[0]);

  ctx.beginPath();
  ctx.moveTo(lastPosition.X, lastPosition.Y);

  for (var i = 1; i < newPoints.length; i++) {
      var lastPosition = view.FGLBase.ModelToScreen(newPoints[i]);
      ctx.lineTo(lastPosition.X, lastPosition.Y);
  }

  ctx.closePath();
  ctx.stroke();
}

prototype.OnMouseUndo = function() {
    if (!this.tempBoundsArray || this.tempBoundsArray.length == 0) {
        return;
    }

    view.ClearOverlayers();

    var newPoints = this.tempBoundsArray;
    this.tempBoundsArray = [];

    for (var i = 0; i < newPoints.length - 1; i++) {
        this.drawBorder(newPoints[i]);
    }
}

prototype.MouseCancel = function(params) {
    view.ClearOverlayers();
    this.tempBoundsArray = [];



}

prototype.MouseEnd = function(params) {
    view.ClearOverlayers();
    this.tempBoundsArray = [];
    $(".border").removeClass("selected");

    view.Paint();
}
