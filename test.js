function TVector2D() {
    
    if(this == window){
    var vector = new TVector2D();
    
    vector.constructor.apply(vector, arguments);
    
    return vector;    
    }
    
}


TVector2D.prototype = {
    constructor: function () {
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
    }

};