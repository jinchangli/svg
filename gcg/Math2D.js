function TVector2D() {
    if (this == window) {
        var obj = new TVector2D();
        obj.constructor.apply(obj, arguments);
        return obj;
    }
}
function TPosition2D() {
    if (this == window) {
        var obj = new TPosition2D();
        obj.constructor.apply(obj, arguments);
        return obj;
    }
}

TPosition2D.prototype = TVector2D.prototype = {
    X: null,
    Y: null,
    constructor: function () {//构造函数
        if (arguments.length == 0) {
            this.X = this.Y = 0;
        } else if (arguments.length == 1) {
            if (typeof (arguments[0]) == "number") {
                this.X = Math.cos(arguments[0]);
                this.Y = Math.sin(arguments[0]);
            } else {
                this.X = arguments[0].X;
                this.Y = arguments[0].Y;
            }
        } else {
            this.X = arguments[0];
            this.Y = arguments[1];
        }
    },
    Add: function (v) {// +=
        this.X += v.X;
        this.Y += v.Y;
    },
    Sub: function (v) {// -=
        this.X -= v.X;
        this.Y -= v.Y;
    },
    Mul: function (v) {// *=
        if (typeof (v) == "number") {// 数乘
            this.X *= v;
            this.Y *= v;
        } else {// 复数乘法
            var x = (this.X);
            this.X = x * v.X - this.Y * v.Y;
            this.Y = x * v.Y + this.Y * v.X;
        }
    },
    Div: function (v) {// /=
        if (typeof (v) == "number") {
            if (v == 0) {
                console.log("divide 0 error");
            }
            this.X /= v;
            this.Y /= v;
        } else {// 复数除法
            if (Abs(v.X) >= Abs(v.Y)) {
                var r = v.Y / v.X,
                    d = v.X * (1 + r * r),
                    x = (this.X);
                this.X = (x + this.Y * r) / d;
                this.Y = (this.Y - x * r) / d;
            }
            else {
                var r = v.X / v.Y,
                    d = v.Y * (1 + r * r),
                    x = (this.X);
                this.X = (x * r + this.Y) / d;
                this.Y = (this.Y * r - x) / d;
            }
        }
    },
    LPerp: function () {// 左转90°
        var x = (this.X);
        this.X = -this.Y;
        this.Y = x;
    },
    RPerp: function () {// 右转90°
        var x = (this.X);
        this.X = this.Y;
        this.Y = -x;
    },
    Conj: function () {// 共轭
        this.Y = -this.Y;
    },
    add: function (v) { // +
        return TVector2D(this.X + v.X, this.Y + v.Y);
    },
    sub: function (v) { // -
        return TVector2D(this.X - v.X, this.Y - v.Y);
    },
    mul: function (v) { // *
        if (typeof (v) == "number") {// 数乘
            return TVector2D(this.X * v, this.Y * v);
        } else {// 复数乘法
            return TVector2D(this.X * v.X - this.Y * v.Y, this.X * v.Y + this.Y * v.X);
        }
    },
    div: function (v) {
        if (typeof (v) == "number") {// 数除
            if (v == 0) {
                console.log("divide 0 error");
            }
            return TVector2D(this.X / v, this.Y / v);
        } else {//复数除法
            if (Abs(v.X) >= Abs(v.Y)) {
                var r = v.Y / v.X,
                    d = v.X * (1 + r * r);
                return TVector2D((this.X + this.Y * r) / d, (this.Y - this.X * r) / d);
            }
            else {
                var r = v.X / v.Y,
                    d = v.Y * (1 + r * r);
                return TVector2D((this.X * r + this.Y) / d, (this.Y * r - this.X) / d);
            }
        }
    },
    is_zero: function () {// 判断：为0？
        return this.X == 0.0 && this.Y == 0.0;
    },
    is_eql: function (v) {// 判断：相等？
        return this.X == v.X && this.Y == v.Y;
    },
    dot: function (v) {// 点积
        return this.X * v.X + this.Y * v.Y;
    },
    crs: function (v) {// 叉积
        return this.X * v.Y - this.Y * v.X;
    },
    abs: function () {//长度
        return Math.sqrt(this.X * this.X + this.Y * this.Y);
    },
    abs2: function () {//长度平方
        return (this.X * this.X + this.Y * this.Y);
    },
    dir: function () {//方向[-Pi,Pi)
        return Math.atan2(this.Y, this.X);
    },
    arg: function () {//辐角[0,2Pi)
        var rst = Math.atan2(this.Y, this.X);
        return rst < 0 ? rst + Math.PI * 2 : rst;
    },
    neg: function () {//反向
        return TVector2D(-this.X, -this.Y);
    },
    sgn: function () {//单位向量
        var len = this.Abs();
        if (len > 0) {
            return TVector2D(this).Div(len);
        }
        return TVector2D(this);
    },
    lperp: function () {// 左转90°
        return TVector2D(-this.Y, this.X);
    },
    rperp: function () {// 右转90°
        return TVector2D(this.Y, -this.X);
    },
    conj: function () {// 共轭
        return TVector2D(this.X, -this.Y);
    }
}
