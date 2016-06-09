function DrawViewGridXY(viewdelta,
    gridcolor, numbercolor) {
    car ctx;
    if (this.FViewRect.width() > 0 && this.FViewRect.height() > 0) {
        var p = TPoint2D();
        var bound2d = TBound2D();
        var p = this.ViewToModel(TPoint2D());
        if (p) {
            bound2d.SetBound(p);
        }

        p = this.ViewToModel(TPoint2D(this.FViewRect.width(), 0));

        if (p) {
            bound2d.SetBound(p);
        }

        p = this.ViewToModel(TPoint2D(0, this.FViewRect.height()));
        if (p) {
            bound2d.SetBound(p);
        }
        p = this.ViewToModel(TPoint2D(this.FViewRect.width(), this.FViewRect.height()))

        if (p) {
            bound2d.SetBound(p);
        }

        if (bound2d.Valid) {
            var v = TVector2D();
            // var vr = TViewRect();
            var str = "";
            var p1 = TPoint2D(),
                p2 = TPoint2D();

            var t, direction, length;
            var modeldelta = BestNumber(viewdelta * this.ViewScale.X);
            if (modeldelta < 1)
                modeldelta = 1;
            var rect = TRect();
            rect.left = Ceil(bound2d.Min.X / modeldelta);
            rect.top = Ceil(bound2d.Min.Y / modeldelta);
            rect.right = Floor(bound2d.Max.X / modeldelta);
            rect.bottom = Floor(bound2d.Max.Y / modeldelta);

            this.BeginView();
            // glColor4fv(&gridcolor.Red);
            ctx.beginPath();
            var strokeLength = 10;
            for (var x = rect.left; x <= rect.right; ++x) {
                t = x * modeldelta;
                var point1 = this.ModelToView(TPoint2D(t, bound2d.Min.Y));
                ctx.moveTo(point1.X, point1.Y);
                ctx.lineTo(point1.X, point1.Y + strokeLength)
                var point2 = this.ModelToView(TPoint2D(t, bound2d.Max.Y));

                ctx.moveTo(point2.X, point2.Y);
                ctx.moveTo(point2.X, point2.Y - strokeLength);
            }
            for (var y = rect.top; y <= rect.bottom; ++y) {
                t = y * modeldelta;
                var point1 = this.ModelToView(TPoint2D(bound2d.Min.X, t));
                ctx.moveTo(point1.X, point1.Y);
                ctx.lineTo(point1.X+strokeLength, point1.Y);

                var point2 = this.ModelToView(TPoint2D(bound2d.Max.X, t));
                ctx.moveTo(point2.X, point2.Y);
                ctx.lineTo(point2.X-strokeLength, point2.Y);
            }

            ctx.stroke();

            this.EndView();
            // vr.SetRect(TVector2D(this.FViewRect.width(),this.FViewRect.height()));
            // glColor4fv(numbercolor.Red);
            // for(var x=rect.left;x<=rect.right;++x)
            // {
            //   t=x*modeldelta;
            //   p1=this.ModelToView(TPoint2D(t,bound2d.Min.Y));
            //   p2=this.ModelToView(TPoint2D(t,bound2d.Max.Y));
            //   if(vr.RectLine(p1,p2))
            //   {
            //     v=p2-p1;
            //     length=~v;
            //     if(length>0)
            //     {
            //       v/=length/2;
            //       direction=-RadToDeg(!v);
            //       str=NumberToStr(t,0)+"Y";
            //       TextOut(p1+v,str,14,17,7,direction);
            //       TextOut(p2-v,str,14,17,9,direction);
            //     }
            //   }
            // }
            // for(var y=rect.top;y<=rect.bottom;++y)
            // {
            //   t=y*modeldelta;
            //   p1=this.ModelToView(TPoint2D(bound2d.Min.X,t));
            //   p2=this.ModelToView(TPoint2D(bound2d.Max.X,t));
            //   if(vr.RectLine(p1,p2))
            //   {
            //     v=p2-p1;
            //     length=~v;
            //     if(length>0)
            //     {
            //       v/=length/2;
            //       direction=-RadToDeg(!v);
            //       str=NumberToStr(t,0)+"X";
            //       TextOut(p1+v,str,14,17,7,direction);
            //       TextOut(p2-v,str,14,17,9,direction);
            //     }
            //   }
            // }
        }
    }
}
