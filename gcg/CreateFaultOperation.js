var CreateFaultOperation = function() {
    var that = this;
    this.constructor.apply(that, arguments);
    this.buildContextMenu();
    this.cacheData(clone(state.viewData));
    this.userCanSelectPoint = true;
    this.tempFaultsArray = [];
    this.tempFault = null;
}

var prototype = CreateFaultOperation.prototype = new TGLOperation();
prototype.tempFaultsArray = null;
prototype.boundsArray = null;

prototype.getOverlayer = function() {
    if (!this.ownCtx) {

        var canvas = $("#createFaults");
        if (canvas.length > 0) {

        } else {
            var baseCanvas = $("#canvas");
            canvas = $('<canvas id="createFaults" class="clayer" width="' + baseCanvas.width() + '" height="' + baseCanvas.height() + '"></canvas>"').insertAfter($("#OutsideLayer"));
        }

        this.ownCtx = canvas[0].getContext("2d");
    }

    return this.ownCtx;
}

prototype.clearOverlayer = function() {

    var ctx = this.getOverlayer();

    var size = ctx.canvas.getBoundingClientRect();

    ctx.clearRect(0, 0, size.width, size.height);
}

prototype.restoreOperation = function() {

      this.clearOverlayer();

    if (this.tempFaultsArray && this.tempFaultsArray.length > 0) {
        var faults = this.tempFaultsArray;
        // this.tempFaultsArray = [];

        for (var i = 0; i < faults.length; i++) {
           var fault = faults[i];

           var array = [];
           for(var j=0;j<fault.length;j++){
              this.drawFault(array, fault[j]);
              array.push(fault[j]);
           }
        }
    }

    if(this.tempFault && this.tempFault.length > 0){
      var fault = this.tempFault;

      var array = [];
      for(var j=0;j<fault.length;j++){
         this.drawFault(array, fault[j]);
         array.push(fault[j]);
         this.drawSelectedPoint(fault[j]);
      }
    }

    // if (this.boundsArray && this.boundsArray.length > 0) {
    //   this.DrawFindalBorder(this.boundsArray);
    // }
}


prototype.OnGetPopupMenu = function() {
    $(".fault").contextMenu();
}

prototype.buildContextMenu = function() {
    $.contextMenu({
        selector: '.fault',
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
                        view.Paint();
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
            },
            "quit": {
                name: "结束"
            }
        }
    });
}

prototype.MouseDown = function(keys, position) {
    //if there is one
    if (position) {
        if (this.tempFault == null) {
            this.tempFault = [];
        }
        var faultPosition = TPosition2D(position.X, position.Y)
        faultPosition.Z = -999999;
        this.drawFault(this.tempFault, faultPosition);

        this.tempFault.push(faultPosition)
        this.drawSelectedPoint(faultPosition);
    }
}

prototype.drawSelectedPoint = function(modelP) {
   var ctx = this.getOverlayer();
  this.setHighLightPoint(modelP.X, modelP.Y, "blue", ctx);
};

prototype.setHighLightPoint = function(X, Y, color, layer) {
    var modelP = TPosition2D(X, Y);
     modelP = view.FGLBase.ModelToScreen(modelP);
    if (!color) {
        color = "red";
    }
    var ctx = this.LayerCtx;

    if (layer) {
        ctx = layer;
    }
    ctx.save();
    //var pen = this.SelectObject(dc, CreatePen(PS_SOLID, 0, 0x00FF0000)); //TBD HPEN
    ctx.beginPath();
    // ctx.rect(p.x - 2, p.y - 2, 5, 5);
    // ctx.fill();
    //ctx.closePath();
    ctx.fillStyle = color;
    ctx.rect(modelP.X - 4, modelP.Y - 4, 9, 9);
    ctx.fill();

    ctx.restore();
}

prototype.drawFault = function(faultArray, newPosition) {
    if (faultArray.length == 0) {
        return;
    }

    var ctx = this.getOverlayer();
    var view = this.FGLView;

    var screenPosition = view.FGLBase.ModelToScreen(newPosition);

    ctx.beginPath();
    var lastP = view.FGLBase.ModelToScreen(faultArray[faultArray.length - 1])
    ctx.moveTo(lastP.X, lastP.Y);
    ctx.lineTo(screenPosition.X, screenPosition.Y);

    ctx.stroke();
}

prototype.drawAllFaults = function() {
    var ctx = this.getOverlayer();
    var view = this.FGLView;
}

prototype.MouseOK = function(params) {
    if (!this.tempFault || this.tempFault.length == 0) {
        return;
    }
    var view = this.FGLView;

    this.tempFaultsArray.push(this.tempFault);


    if(!view.faults){
      view.faults =[];
    }
    view.faults =view.faults.concat(this.tempFaultsArray);

    this.tempFault = null;
    this.tempFaultsArray = [];
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
    if (!this.tempFault || this.tempFault.length == 0) {
        return;
    }

    this.tempFault.pop();

    this.restoreOperation();
}

prototype.MouseCancel = function(params) {

    this.tempFaultsArray = [];
    this.restoreOperation();
}

prototype.MouseEnd = function(params) {
    $(".fault").removeClass("selected");
}
