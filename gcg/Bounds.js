


function TInterval2D(point1, point2) {

}

TInterval2D.prototype = {
    Min: null, //TPosition2D  左下方坐标
    Max: null, //TPosition2D  右上方坐标
    add: function (v) {
        this.Min = this.Min.add(v);
        this.Max = this.Max.add(v);

        return this;
    },
    minus: function () {

    },
    Center: function () {
        this.Min.add(this.Max).divide(2);
    },
    Size: function () {
        this.Max.minus(this.Min);
    },
    Scale: function () {

    },
    Rotate: function () {

    },
    equals: function (item) {
        return this.Min.equals(item.Min) && this.Max.equals(item.Max);
    },
    lessOrEqalThan: function (item) {

    }
}

function TBound2D(params) {

}

TBound2D.prototype = {
    FInterval: null,
    FValid: null,
    Valid: function (params) {

    },
    Min: function (params) {

    },
    Max: function (params) {

    },
    Clear: function (params) {

    },
    SetBound: function (params) {

    },
    SetBounds: function (params) {

    }, Center: function (params) {

    }, Size: function (params) {

    }, Scale: function (params) {

    }, Rotate: function (params) {

    },
    GetCorners: function (params) {

    },
}