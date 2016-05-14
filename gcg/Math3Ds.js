function Abs() {
    return Math.abs.apply(this, arguments);
}



function TVector2D(direction) {
    
}

function TPosition2D(){
    
}

TPosition2D.prototype = TVector2D.prototype = {
    X:null,
    Y:null,
    equals:function(item){
      return this.X == item.X && this.Y == item.Y;  
    },
    Add: function (item) {
        this.X += item.X;
        this.Y += item.Y;
        return this;
    },
    Minus: function (item) {
        this.X -= item.X;
        this.Y -= item.Y;
        return this;
    },
    times: function (d) {
        this.X *= d;
        this.Y *= d;
        return this;
    },
    divide: function (d) {
        if (typeof (d) == "number") {
            if (d == 0) {
                console.log("divide 0 error");
            }

            this.X /= d;
            this.Y /= d;
            return this;
        } else {
            if (Abs(v.X) >= Abs(v.Y)) {
                var ratio = v.Y / v.X,
                var denom = v.X * (1 + ratio * ratio),
                var x = X;
                this.X = (x + this.Y * ratio) / denom;
                this.Y = (this.Y - x * ratio) / denom;
            }
            else {
                var ratio = v.X / v.Y,
                var denom = v.Y * (1 + ratio * ratio),
                    x = this.X;
                this.X = (x * ratio + this.Y) / denom;
                this.Y = (this.Y * ratio - x) / denom;
            }
            return this;
        }
    },
    
    complement:function(){
        return Abs(this.X, this.Y);
    },
    
    negation:function(){
        return ArcTan(this.X, this.Y);
    },
    
    negative: function(){
        return TVector2D(-this.X, -this.Y);
    }    
}
