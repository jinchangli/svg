function DrawViewGridXY(viewdelta,
  gridcolor,numbercolor)
{
  if(this.FViewRect.width()>0&&this.FViewRect.height()>0)
  {
    var p = TPoint2D();
    var bound2d = TBound2D();
    var p = this.ViewToModel(TPoint2D());
    if(p){
      bound2d.SetBound(p);
    }

    p = this.ViewToModel(TPoint2D(this.FViewRect.width(),0));

    if(p){
      bound2d.SetBound(p);
    }

    p = this.ViewToModel(TPoint2D(0, this.FViewRect.height()));
    if(p){
      bound2d.SetBound(p);
    }
    p = this.ViewToModel(TPoint2D(this.FViewRect.width(),this.FViewRect.height()))

    if(p){
      bound2d.SetBound(p);
    }

    if(bound2d.Valid)
    {
      var v = TVector2D();
      var vr = TViewRect();
      var str = "";
      var p1 = TPoint2D(), p2 = TPoint2D();

      var t,direction,length;
      var modeldelta= GetBestNumber(viewdelta* this.ViewScale.X);
      if(modeldelta<1)
        modeldelta=1;
      var rect= TRect();
      rect.left = Ceil(bound2d.Min.X/modeldelta);
      rect.right = Floor(bound2d.Max.X/modeldelta);
      rect.top = Ceil(bound2d.Min.Y/modeldelta);
      rect.bottom = Floor(bound2d.Max.Y/modeldelta);

      this.BeginView();
        glColor4fv(&gridcolor.Red);
        glBegin(GL_LINES);
          for(var x=rect.left;x<=rect.right;++x)
          {
            t=x*modeldelta;
            glVertex2dv(this.ModelToView(TPoint2D(t,bound2d.Min.Y)).X);
            glVertex2dv(this.ModelToView(TPoint2D(t,bound2d.Max.Y)).X);
          }
          for(var y=rect.top;y<=rect.bottom;++y)
          {
            t=y*modeldelta;
            glVertex2dv(this.ModelToView(TPoint2D(bound2d.Min.X,t)).X);
            glVertex2dv(this.ModelToView(TPoint2D(bound2d.Max.X,t)).X);
          }
        glEnd();
        vr.SetRect(TVector2D(this.FViewRect.width(),this.FViewRect.height()));
        glColor4fv(numbercolor.Red);
        for(var x=rect.left;x<=rect.right;++x)
        {
          t=x*modeldelta;
          p1=this.ModelToView(TPoint2D(t,bound2d.Min.Y));
          p2=this.ModelToView(TPoint2D(t,bound2d.Max.Y));
          if(vr.RectLine(p1,p2))
          {
            v=p2-p1;
            length=~v;
            if(length>0)
            {
              v/=length/2;
              direction=-RadToDeg(!v);
              str=NumberToStr(t,0)+"Y";
              TextOut(p1+v,str,14,17,7,direction);
              TextOut(p2-v,str,14,17,9,direction);
            }
          }
        }
        for(var y=rect.top;y<=rect.bottom;++y)
        {
          t=y*modeldelta;
          p1=this.ModelToView(TPoint2D(bound2d.Min.X,t));
          p2=this.ModelToView(TPoint2D(bound2d.Max.X,t));
          if(vr.RectLine(p1,p2))
          {
            v=p2-p1;
            length=~v;
            if(length>0)
            {
              v/=length/2;
              direction=-RadToDeg(!v);
              str=NumberToStr(t,0)+"X";
              TextOut(p1+v,str,14,17,7,direction);
              TextOut(p2-v,str,14,17,9,direction);
            }
          }
        }
      this.EndView();
    }
  }
}


// // 最佳整数
// int LJF::BestInteger(double x)
// {
//   static const integer bs[38] =
//   {
//     1,2,5,10,20,25,50,100,200,250,500,1000,2000,2500,5000,10000,20000,
//     25000,50000,100000,200000,250000,500000,1000000,2000000,2500000,
//     5000000,10000000,20000000,25000000,50000000,100000000,200000000,
//     250000000LL,500000000LL,1000000000LL,2000000000LL,2500000000LL
//   };
//   if (x > 0)
//   {
//     int
//       start = 0,
//       end = sizeof(bs)/sizeof(bs[0])-1;
//     int i = FloorToInt(x);
//     if (i <= bs[start])
//       return (int) bs[start];
//     if (i >= bs[end])
//       return (int)bs[end];
//     while (start < end-1) // 二分搜索
//     {
//       int w = (start+end)/2;
//       if (i > bs[w])
//         start = w;
//       else if (i < bs[w])
//         end = w;
//       else
//         return (int)bs[w];
//     }
//     return (int)bs[start];
//   }
//   else if (x < 0)
//     return -BestInteger(-x);
//   return 0;
// }
//

Math.log10 = Math.log10 || function(x) {
  return Math.log(x) / Math.LN10;
};

// 最佳值
function BestNumber(x)
{
  if (x > 0)
  {
    var t = Math.log10(x);
    var n = Floor(t);
    x = Math.pow(10.0,t-n);
    if (x >= 5)
      x = 5;
    else if (x >= 2)
      x = 2;
    else
      x = 1;
    return x* Math.pow(10.0,n);
  }
  else if (x < 0)
    return -BestNumber(-x);
  return 0;
}
