var FakeWellsOperation = function() {
    var that = this;
    this.constructor.apply(that, arguments);
    this.buildContextMenu();
    this.cacheData(clone(state.viewData));
    this.userCanSelectPoint = true;
    this.tempWellsArray = [];
    this.boundsArray = [];
    this.wellPen = new WellPen(this.FGLView);
    this.getOverlayer();
}

var prototype = FakeWellsOperation.prototype = new TGLOperation();
prototype.tempWellsArray = null;
prototype.boundsArray = null;
prototype.wellPen = null;

prototype.getOverlayer = function() {
    if (!this.ownCtx) {

        var canvas = $("#createWell");
        if (canvas.length > 0) {

        } else {
            var baseCanvas = $("#canvas");
            canvas = $('<canvas id="createWell" class="clayer" width="' + baseCanvas.width() + '" height="' + baseCanvas.height() + '"></canvas>"').insertAfter($("#OutsideLayer"));
        }

        this.ownCtx = canvas[0].getContext("2d");
    }

    return this.ownCtx;
}

prototype.ClearOverlayer = function() {

    var ctx = this.getOverlayer();

    var size = ctx.canvas.getBoundingClientRect();

    ctx.clearRect(0, 0, size.width, size.height);
}

prototype.restoreOperation = function() {

    this.ClearOverlayer();

    if (this.tempWellsArray && this.tempWellsArray.length > 0) {
        var newPoints = this.tempWellsArray;
        // this.tempWellsArray = [];

        for (var i = 0; i < newPoints.length; i++) {
            var position = TPosition2D(newPoints[i].X, newPoints[i].Y)
            this.drawWell(position, newPoints[i].N, newPoints[i].T);
        }
    }

    // if (this.boundsArray && this.boundsArray.length > 0) {
    //   this.DrawFindalBorder(this.boundsArray);
    // }
}


prototype.OnGetPopupMenu = function() {
    $(".wells").contextMenu();
}

prototype.buildContextMenu = function() {
    if (FakeWellsOperation.inited) {
        return;
    }

    FakeWellsOperation.inited = true;

    $.contextMenu({
        selector: '.wells',
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
                name: "结束"
            },
            "cancel": {
                name: "取消"
            }
        }
    });
}

prototype.MouseDown = function(keys, position) {
    //if there is one
    if (!this.wellEditing) {
        var index = this.tempWellsArray.length + "";
        var view = this.FGLView;
        var wellPosition = TPosition2D(position.X, position.Y)
        wellPosition.Z = Math.random() * 100;

        var wellType = $("#wellsOptions>.active").attr("type");
        wellType = Number(wellType);

        var name = index;
        this.drawWell(wellPosition, name, wellType);
        this.wellEditing = Well(wellPosition, wellType, name);
        this.tempWellsArray.push(this.wellEditing);
    }
}

prototype.MouseUp = function(keys, position) {
    var flags = GetMouseKeys(keys);
    if (this.wellEditing) {
        var name = this.tempWellsArray[this.tempWellsArray.length - 1].N;
        this.showWellNameEditor(position, name, (function(that) {
            return function(name) {
                that.changeWellName(that.tempWellsArray.length - 1, name);
            }
        })(this));
    }
}

prototype.DoMouseUp = function(keys, position) {

}

prototype.showWellNameEditor = function(downPosition, name, callBack) {
    var event = window.event;
    var pageX = event.pageX;
    var pageY = event.pageY;

    $("#wellNameEditor").css("left", pageX).css("top", pageY).show();
    $("#wellNameEditor input").val("").focus();

    state.listenWellNameChange(callBack);
};

prototype.changeWellName = function(index, name) {
    if (!this.tempWellsArray) {
        return;
    }

    var well = this.wellEditing;
    if (well) {
        well.N = name;
        this.wellEditing = null;
        this.restoreOperation();
    }

    state.unlistenWellNameChange();
};

prototype.drawWell = function(newPosition, wellName, wellType) {

    var ctx = this.getOverlayer();
    var view = this.FGLView;

    this.wellPen.drawWell(ctx, newPosition, wellType, wellName);
}

prototype.MouseOK = function(params) {
    if (!this.tempWellsArray || this.tempWellsArray.length == 0) {
        return;
    }

    var view = this.FGLView;
    if(!view.wellPoints){
       view.wellPoints =[];
    }
    view.wellPoints = view.wellPoints.concat(this.tempWellsArray);
    this.tempWellsArray = [];
}

prototype.DrawFindalBorder = function(newPoints) {
    var ctx = this.getOverlayer();

    var lastPosition = view.FGLBase.ModelToScreen(newPoints[0]);

    ctx.beginPath();
    ctx.moveTo(lastPosition.X, lastPosition.Y);

    for (var i = 1; i < newPoints.length - 1; i++) {
        var lastPosition = view.FGLBase.ModelToScreen(newPoints[i]);
        ctx.lineTo(lastPosition.X, lastPosition.Y);
    }

    ctx.closePath();
    ctx.stroke();
}

prototype.OnMouseUndo = function() {
    if (!this.tempWellsArray || this.tempWellsArray.length == 0) {
        return;
    }

    this.ClearOverlayer();

    this.tempWellsArray.pop();

    this.restoreOperation();
}

prototype.MouseCancel = function(params) {
    this.ClearOverlayer();
    this.tempWellsArray = [];
    this.restoreOperation();
}

prototype.MouseEnd = function(params) {
    if (this.dataChangeConfirmed) {

    } else {

    }

    endWellCreation();
}
