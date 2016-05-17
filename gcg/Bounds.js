TRect.prototype = {
    left: null,
    top: null,
    right: null,
    bottom: null
}

function TBound2D() {
    if (this == window) {
        var obj = new TBound2D();
        obj.constructor.apply(bd, arguments);
        return obj;
    }
}

TBound2D.prototype = {
    Min: null, //TPosition2D  左下方坐标
    Max: null, //TPosition2D  右上方坐标
    Valid: null,
    constructor: function () {//构造函数
        this.Min = TPosition2D();
        this.Max = TPosition2D();
        this.Valid = false;
    },
    center: function () {
        return new TVector2D((this.Min.X + this.Max.X) * 0.5, (this.Min.Y + this.Max.Y) * 0.5);
    },
    size: function () {
        return new TVector2D((this.Max.X - this.Min.X), (this.Max.Y - this.Min.Y));
    },
    Clear: function () {
        this.Valid = false;
    },
    SetBound: function(p) {
        if (this.Min.X > p.X)
            this.Min.X = p.X;
        if (this.Min.Y > p.Y)
            this.Min.Y = p.Y;
        if (this.Max.X < p.X)
            this.Max.X = p.X;
        if (this.Max.Y < p.Y)
            this.Max.Y = p.Y;
        this.Valid = true;
    },
    Move: function (v) {
        this.Min.Add(v);
        this.Max.Add(v);
    },
    Scale: function (d) {
        this.Min.Mul(d);
        this.Max.Mul(d);
    },
    get_corners: function (corners) {
        corners[0].X = this.Min.X; corners[0].Y = this.Min.Y;
        corners[1].X = this.Max.X; corners[1].Y = this.Min.Y;
        corners[2].X = this.Max.X; corners[2].Y = this.Max.Y;
        corners[3].X = this.Min.X; corners[3].Y = this.Max.Y;
    }
}