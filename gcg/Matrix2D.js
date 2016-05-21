function TMatrix2D() {
    if (this == window) {
        var obj = new TMatrix2D();
        obj.constructor.apply(obj, arguments);
        return obj;
    }
}

TMatrix2D.prototype = {
    A00: null,
    A01: null,
    A02: null,
    A10: null,
    A11: null,
    A12: null,
    constructor: function () {//构造函数
        if (arguments.length == 0) {
            this.A00 = this.A11 = 1;
            this.A01 = this.A10 = 0;
            this.A02 = this.A12 = 0;
        } else if (arguments.length == 6) {
            this.A00 = arguments[0];
            this.A01 = arguments[1];
            this.A02 = arguments[2];
            this.A10 = arguments[3];
            this.A11 = arguments[4];
            this.A12 = arguments[5];
        }
    },
    Identity: function () {
        this.A00 = this.A11 = 1;
        this.A01 = this.A10 = 0;
        this.A02 = this.A12 = 0;
    },
    Transform: function (b00, b01, b02, b10, b11, b12) {
        var t0 = this.A00 * b00 + this.A01 * b10;
        var t1 = this.A00 * b01 + this.A01 * b11;
        this.A02 += this.A00 * b02 + this.A01 * b12;
        this.A00 = t0;
        this.A01 = t1;
        t0 = this.A10 * b00 + this.A11 * b10;
        t1 = this.A10 * b01 + this.A11 * b11;
        this.A12 += this.A10 * b02 + this.A11 * b12;
        this.A10 = t0;
        this.A11 = t1;
    },
    Scale: function () {
        if (arguments.length == 1) {
            this.A00 *= arguments[0];
            this.A01 *= arguments[0];
            this.A10 *= arguments[0];
            this.A11 *= arguments[0];
        } else if (arguments.length == 2) {
            this.A00 *= arguments[0];
            this.A01 *= arguments[1];
            this.A10 *= arguments[0];
            this.A11 *= arguments[1];
        }
    },
    Translate: function (dx, dy) {
        this.A02 += this.A00 * dx + this.A01 * dy;
        this.A12 += this.A10 * dx + this.A11 * dy;
    },
    Rotate: function (angle) {
        var c = Math.cos(angle),
            s = Math.sin(angle);
        var t = this.A00 * c - this.A01 * s;
        this.A01 = this.A01 * c + this.A00 * s;
        this.A00 = t;
        t = this.A11 * c + this.A10 * s;
        this.A10 = this.A10 * c - this.A11 * s;
        this.A11 = t;
    }
}