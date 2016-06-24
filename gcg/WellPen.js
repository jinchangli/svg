var Well = function() {
    if (this == window) {
        var obj = new Well();
        obj.constructor.apply(obj, arguments);
        return obj;
    }
}

Well.Types = {
    ZiPenOil: 1,
    JiXieOil: 2,
    ZhuShui: 3,
    ZhuQi: 4,
    ZhuShuiQi: 5,
    Qi: 6,
    ShuiYuan: 7,
    Salt: 8,
    TanOil: 9,
    TanQi: 10
}

Well.prototype.T = null;
Well.prototype.X = null;
Well.prototype.Y = null;
Well.prototype.N = null;
Well.prototype.constructor = function(position, type, name) {
    this.X = position.X;
    this.Y = position.Y;
    this.T = type;
    this.N = name;
}

var WellPen = function(view) {
    this.view = view;
    this.space = "Model";
    this.direction = TVector2D(-1, 1);
    var d = this.direction;
    if(d.X<0){
      this.textAlign = "right";
    }

    if(d.X==0){
      this.textAlign = "center";
    }

    if(d.x>0){
      this.textAlign = "left";
    }
}

var prototype = WellPen.prototype = {}

var wellColors = {
    red: "#f00",
    darkBlue: "blue",
    orange: "orange",
    lightBlue: 'lightblue',
    purple: 'purple',
    yellow: 'yellow',
    white: "white"
};

prototype.getCorner = function(ctx, position, offset) {
    var view = this.view;
    var fp = convertPosition(view, ctx, position);
    var direction =
    offset.X *= direction.X;
    offset.Y *= direction.Y;

    return fp.add(offset);
}

prototype.drawWell = function(ctx, position, wellType, name, size) {
    var funcName = "drawZiPenOilWell";
    switch (wellType) {
        case Well.Types.ZiPenOil:
            funcName = "drawZiPenOilWell";
            break;
        case Well.Types.JiXieOil:
            funcName = "drawJiXieOilWell";
            break;
        case Well.Types.ZhuShui:
            funcName = "drawZhuShuiWell";
            break;
        case Well.Types.ZhuQi:
            funcName = "drawZhuQiWell";
            break;
        case Well.Types.ZhuShuiQi:
            funcName = "drawZhuShuiQiWell";
            break;
        case Well.Types.ShuiYuan:
            funcName = "drawShuiYuanWell";
            break;
        case Well.Types.Qi:
            funcName = "drawQiWell";
            break;
        case Well.Types.Salt:
            funcName = "drawSaltWell";
            break;
        case Well.Types.TanOil:
            funcName = "drawTanOilWell";
            break;
        case Well.Types.TanQi:
            funcName = "drawTanQiWell";
            break;
        default:

    }

    if (!size) {
        size = state.wellSize;
    }

    var transformStartFunc = "Begin" + this.space;
    var transformEndFunc = "End" + this.space;

    if (this.view.FGLBase[transformStartFunc]) {
        this.view.FGLBase[transformStartFunc](ctx);
    }
    ctx.save();

    this[funcName](ctx, position, name, size);
    ctx.restore();
    if (this.view.FGLBase[transformEndFunc]) {
        this.view.FGLBase[transformEndFunc](ctx);
    }
}

prototype.drawZiPenOilWell = function(ctx, position, name, size) {
    var xOffset = position.X;
    var yOffset = position.Y;

    //ctx.moveTo(xOffset, yOffset);
    if (!size) {
        size = 10;
    }

    ctx.beginPath();

    ctx.arc(xOffset, yOffset, size, 0, 2 * Math.PI);
    ctx.strokeStyle = wellColors.red;
    ctx.fillStyle = wellColors.red;
    ctx.fill();
    ctx.closePath();

    ctx.fillText(name, xOffset + size + 3, yOffset - size - 3);
}

prototype.drawJiXieOilWell = function(ctx, position, name, size) {
    var xOffset = position.X;
    var yOffset = position.Y;

    //ctx.moveTo(xOffset, yOffset);
    if (!size) {
        size = 10;
    }

    ctx.strokeStyle = wellColors.red;
    ctx.fillStyle = wellColors.red;

    ctx.beginPath();

    ctx.arc(xOffset, yOffset, size, 0, Math.PI);
    ctx.fill();

    ctx.arc(xOffset, yOffset, size, Math.PI, 2 * Math.PI);
    ctx.stroke();

    ctx.moveTo(xOffset, yOffset);
    ctx.lineTo(xOffset, yOffset - size);
    ctx.stroke();
    ctx.closePath();

    ctx.fillText(name, xOffset + size + 3, yOffset - size - 3);
}

prototype.drawZhuShuiWell = function(ctx, position, name, size) {
    var xOffset = position.X;
    var yOffset = position.Y;

    //ctx.moveTo(xOffset, yOffset);
    if (!size) {
        size = 10;
    }

    ctx.strokeStyle = wellColors.darkBlue;
    ctx.fillStyle = wellColors.darkBlue;

    ctx.beginPath();
    //ctx.scale(2,2);

    ctx.arc(xOffset, yOffset, size, 0, 2 * Math.PI);

    ctx.fill();

    ctx.lineWidth = 2;
    ctx.moveTo(xOffset + 2 * size, yOffset - 2 * size);
    ctx.lineTo(xOffset - 2 * size, yOffset + 2 * size);
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();

    var baseX = xOffset - 2 * size - 3,
        baseY = yOffset + 2 * size + 3

    ctx.moveTo(baseX, baseY);

    ctx.lineTo(baseX + 0.4 * size, baseY - size);
    ctx.lineTo(baseX + size, baseY - 0.4 * size);

    ctx.fill();
    ctx.closePath();


    ctx.fillText(name, xOffset, yOffset - size - 3);
}

prototype.drawZhuQiWell = function(ctx, position, name, size) {
    var xOffset = position.X;
    var yOffset = position.Y;

    //ctx.moveTo(xOffset, yOffset);
    if (!size) {
        size = 10;
    }

    var size2 = 2 * size;

    ctx.strokeStyle = wellColors.orange;
    ctx.fillStyle = wellColors.orange;

    ctx.beginPath();
    //ctx.scale(2,2);

    ctx.arc(xOffset, yOffset, size, 0, Math.PI);
    ctx.fill();

    ctx.arc(xOffset, yOffset, size, Math.PI, 2 * Math.PI);
    ctx.stroke();

    ctx.moveTo(xOffset, yOffset - size2);
    ctx.lineTo(xOffset, yOffset + size2);
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();

    var baseX = xOffset,
        baseY = yOffset + size2 + 2

    ctx.moveTo(baseX, baseY);

    ctx.lineTo(baseX - 0.4 * size, baseY - size);
    ctx.lineTo(baseX + 0.4 * size, baseY - size);

    ctx.fill();
    ctx.closePath();

    ctx.fillText(name, xOffset + 2, yOffset - size - 3);
}


prototype.drawZhuShuiQiWell = function(ctx, position, name, size) {
    var xOffset = position.X;
    var yOffset = position.Y;

    //ctx.moveTo(xOffset, yOffset);
    if (!size) {
        size = 10;
    }
    var size2 = 1.4 * size;

    ctx.strokeStyle = wellColors.red;
    ctx.fillStyle = wellColors.red;

    ctx.beginPath();
    //ctx.scale(2,2);

    ctx.arc(xOffset, yOffset, size, 1.75 * Math.PI, 0.75 * Math.PI);
    ctx.fill();

    ctx.arc(xOffset, yOffset, size, 0.75 * Math.PI, 1.75 * Math.PI);
    ctx.stroke();

    ctx.lineWidth = 2;
    ctx.moveTo(xOffset + size2, yOffset - size2);
    ctx.lineTo(xOffset - size2, yOffset + size2);
    ctx.stroke();

    ctx.moveTo(xOffset, yOffset);
    ctx.lineTo(xOffset - 0.7 * size, yOffset - 0.7 * size);
    ctx.stroke();

    ctx.closePath();

    ctx.beginPath();

    var baseX = xOffset - size2 - 3,
        baseY = yOffset + size2 + 3

    ctx.moveTo(baseX, baseY);

    ctx.lineTo(baseX + 0.4 * size, baseY - size);
    ctx.lineTo(baseX + size, baseY - 0.4 * size);

    ctx.fill();
    ctx.closePath();


    ctx.fillText(name, xOffset, yOffset - size - 3);
}


prototype.drawQiWell = function(ctx, position, name, size) {
    var xOffset = position.X;
    var yOffset = position.Y;

    //ctx.moveTo(xOffset, yOffset);
    if (!size) {
        size = 10;
    }

    size = 0.8 * size;

    var size2 = 2.9 * size;

    ctx.strokeStyle = wellColors.orange;
    ctx.fillStyle = wellColors.orange;
    ctx.lineWidth = 1;

    ctx.beginPath();
    // ctx.scale(2, 2);

    ctx.moveTo(xOffset, yOffset - size2);
    ctx.lineTo(xOffset - 0.95 * size, yOffset - 0.2 * size);
    ctx.lineTo(xOffset + 0.95 * size, yOffset - 0.2 * size);
    ctx.fill();

    ctx.closePath();

    ctx.beginPath();

    ctx.moveTo(xOffset, yOffset - size2 + 0.1 * size);
    ctx.lineTo(xOffset + 0.8 * size, yOffset - size2 - 0.7 * size);
    ctx.stroke();

    ctx.closePath();

    ctx.beginPath();

    ctx.fillStyle = "#fff";
    ctx.arc(xOffset, yOffset, 0.8 * size, 0, 2 * Math.PI);
    ctx.stroke();

    ctx.arc(xOffset, yOffset, 0.6 * size, 0, 2 * Math.PI);
    ctx.fill();

    ctx.closePath();

    ctx.fillStyle = wellColors.orange;
    ctx.fillText(name, xOffset + size, yOffset - size - 3);
}

prototype.drawShuiYuanWell = function(ctx, position, name, size) {
        var xOffset = position.X;
        var yOffset = position.Y;

        //ctx.moveTo(xOffset, yOffset);
        if (!size) {
            size = 100;
        }

        ctx.beginPath();

        ctx.strokeStyle = wellColors.lightBlue;
        ctx.fillStyle = wellColors.lightBlue;
        ctx.arc(xOffset, yOffset, size, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();

        ctx.strokeStyle = wellColors.white;
        ctx.fillStyle = wellColors.white;
        ctx.arc(xOffset, yOffset, 0.9 * size, 0, Math.PI);
        ctx.fill();
        ctx.closePath();

        var offset = TVector2D(size, size);
        var nP = this.getCorner(ctx, position, offset);
        ctx.fillStyle = wellColors.lightBlue;
        drawModelText(ctx, nP, state.wellNameSize, 0, name, this.textAlign);
        };

        prototype.drawSaltWell = function(ctx, position, name, size) {
            var xOffset = position.X;
            var yOffset = position.Y;

            //ctx.moveTo(xOffset, yOffset);
            if (!size) {
                size = 10;
            }

            size = 0.8 * size;

            var size2 = 2.9 * size;

            ctx.strokeStyle = wellColors.purple;
            ctx.fillStyle = wellColors.purple;
            ctx.lineWidth = 1;

            ctx.beginPath();
            // ctx.scale(2, 2);

            ctx.moveTo(xOffset, yOffset - size2);
            ctx.lineTo(xOffset - 0.95 * size, yOffset - 0.2 * size);
            ctx.lineTo(xOffset + 0.95 * size, yOffset - 0.2 * size);
            ctx.fill();

            ctx.closePath();

            ctx.beginPath();

            ctx.fillStyle = "#fff";
            ctx.arc(xOffset, yOffset, 0.8 * size, 0, 2 * Math.PI);
            ctx.stroke();

            ctx.arc(xOffset, yOffset, 0.6 * size, 0, 2 * Math.PI);
            ctx.fill();

            ctx.closePath();

            ctx.fillStyle = wellColors.purple;
            ctx.fillText(name, xOffset + size, yOffset - size - 3);
        }

        prototype.drawTanOilWell = function(ctx, position, name, size) {
            var xOffset = position.X;
            var yOffset = position.Y;

            //ctx.moveTo(xOffset, yOffset);
            if (!size) {
                size = 10;
            }

            size = 1.5 * size;

            ctx.strokeStyle = wellColors.red;
            ctx.fillStyle = wellColors.red;
            ctx.lineWidth = 1;

            ctx.beginPath();
            ctx.arc(xOffset, yOffset, size, 0, 2 * Math.PI);
            ctx.fill();
            ctx.closePath();

            ctx.beginPath();
            ctx.fillStyle = "#fff";
            ctx.arc(xOffset, yOffset, size - 1, 0, 2 * Math.PI);
            ctx.fill();
            ctx.closePath();

            ctx.beginPath();
            ctx.fillStyle = wellColors.red;
            ctx.arc(xOffset, yOffset, 0.6 * size, 0, 2 * Math.PI);
            ctx.fill();

            ctx.closePath();

            ctx.fillStyle = wellColors.red;
            ctx.fillText(name, xOffset + size, yOffset - size - 3);
        }


        prototype.drawTanQiWell = function(ctx, position, name, size) {
            var xOffset = position.X;
            var yOffset = position.Y;

            //ctx.moveTo(xOffset, yOffset);
            if (!size) {
                size = 10;
            }

            size = 1.5 * size;

            ctx.strokeStyle = wellColors.yellow;
            ctx.fillStyle = wellColors.yellow;
            ctx.lineWidth = 1;

            ctx.beginPath();
            ctx.arc(xOffset, yOffset, size, 0, 2 * Math.PI);
            ctx.fill();
            ctx.closePath();

            ctx.beginPath();
            ctx.fillStyle = "#fff";
            ctx.arc(xOffset, yOffset, size - 1, 0, 2 * Math.PI);
            ctx.fill();
            ctx.closePath();

            ctx.beginPath();
            ctx.fillStyle = wellColors.yellow;
            ctx.arc(xOffset, yOffset, 0.6 * size, 0, 2 * Math.PI);
            ctx.fill();

            ctx.closePath();

            ctx.fillStyle = wellColors.yellow;
            ctx.fillText(name, xOffset + size, yOffset - size - 3);
        }
