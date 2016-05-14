//---------------------------------------------------------------------------
#include "MathBases.h"
#pragma hdrstop
#pragma package(smart_init)
//---------------------------------------------------------------------------
namespace LJF
{
static int LineCutConvexPolygon(const TVector2D &p0,const TVector2D &v,int nps,TVector2D ps[])
{
  if (nps >= 3)
  {
    double zs[8];
    bool
      flag1 = true, // 点全在右边标志
      flag2 = true; // 点全在左边标志
    for (int k=0; k<nps; ++k)
    {
      zs[k] = (ps[k]-p0)&v;
      if (zs[k] < 0)
        flag1 = false;
      else if (zs[k] > 0)
        flag2 = false;  
    }
    if (flag1)
      return 0;
    if (flag2)
      return nps;
    for (int k1=0; k1<nps; )
    {
      const double z1 = zs[k1];
      if (z1 > 0)
      {
        const int
          k0 = (k1+nps-1)%nps,
          k2 = (k1+1)%nps;
        const double
          z0 = zs[k0],
          z2 = zs[k2];
        if (z0 >= 0)
        {
          if (z2 >= 0)
          {
            if (nps > 3)
            {
              for (int k=k1+1; k<nps; ++k)
                zs[k-1] = zs[k];
              --nps;
            }
            else
              return 0;
          }
          else
          {
            ps[k1] = (ps[k1]*z2-ps[k2]*z1)/(z2-z1);
            zs[k1] = 0;
            ++k1;
          }
        }
        else
        {
          if (z2 >= 0)
          {
            ps[k1] = (ps[k1]*z0-ps[k0]*z1)/(z0-z1);
            zs[k1] = 0;
            ++k1;
          }
          else
          {
            TPosition2D p(ps[k1]);
            ps[k1] = (p*z0-ps[k0]*z1)/(z0-z1);
            zs[k1] = 0;
            ++k1;
            for (int k=nps; k>k1; --k)
            {
              ps[k] = ps[k-1];
              zs[k] = zs[k-1];
            }
            ++nps;
            ps[k1] = (p*z2-ps[k2]*z1)/(z2-z1);
            zs[k1] = 0;
            ++k1;
          }
        }
      }
      else
        ++k1;
    }
    for (int k=0; k<nps;)
    {
      const TPosition2D &p = ps[k];
      if (Abs(TVector2D::MulCrs(ps[(k+1)%nps]-p,ps[(k+2)%nps]-p))<1E-7)
      {
        for (int i=k+1; i<nps; ++i)
          ps[i-1] = ps[i];
        --nps;  
      }
      else
        ++k;
    }
    return nps>=3?nps:0;
  }
  return 0;
}
}
using namespace LJF;
//---------------------------------------------------------------------------
TVector2D::TVector2D()
  : X(0),Y(0)
{
}
TVector2D::TVector2D(double direction)
{
  SinCos(direction,Y,X);
}
TVector2D::TVector2D(double x,double y)
  : X(x),Y(y)
{
}
TVector2D::TVector2D(const TVector2F &v)
  : X(v.X),Y(v.Y)
{
}
TVector2D::TVector2D(const TVector2D &v)
  : X(v.X),Y(v.Y)
{
}
TVector2D& TVector2D::operator=(double direction)
{
  return *this = TVector2D(direction);
}
TVector2D& TVector2D::operator=(const TVector2F &v)
{
  X = v.X;
  Y = v.Y;
  return *this;
}
TVector2D& TVector2D::operator=(const TVector2D &v)
{
  if (this != &v)
  {
    X = v.X;
    Y = v.Y;
  }
  return *this;
}
TVector2D& TVector2D::operator+=(const TVector2F &v)
{
  X += v.X;
  Y += v.Y;
  return *this;
}
TVector2D& TVector2D::operator+=(const TVector2D &v)
{
  X += v.X;
  Y += v.Y;
  return *this;
}
TVector2D& TVector2D::operator-=(const TVector2F &v)
{
  X -= v.X;
  Y -= v.Y;
  return *this;
}
TVector2D& TVector2D::operator-=(const TVector2D &v)
{
  X -= v.X;
  Y -= v.Y;
  return *this;
}
TVector2D& TVector2D::operator*=(double d)
{
  X *= d;
  Y *= d;
  return *this;
}
TVector2D& TVector2D::operator/=(double d)
{
  X /= d;
  Y /= d;
  return *this;
}
TVector2D& TVector2D::operator%=(double angle)
{
  return *this = *this%angle;
}
TVector2D& TVector2D::operator%=(const TVector2D &v)
{
  const double t = X;
  X = t*v.X-Y*v.Y;
  Y = t*v.Y+Y*v.X;
  return *this;
}
TVector2D& TVector2D::operator/=(const TVector2D &v)
{
  if (Abs(v.X) >= Abs(v.Y))
  {
    const double
      ratio = v.Y/v.X,
      denom = v.X*(1+ratio*ratio),
      x = X;
    X = (x+Y*ratio)/denom;
    Y = (Y-x*ratio)/denom;
  }
  else
  {
    const double
      ratio = v.X/v.Y,
      denom = v.Y*(1+ratio*ratio),
      x = X; 
    X = (x*ratio+Y)/denom;
    Y = (Y*ratio-x)/denom;
  }
  return *this;
}
double TVector2D::operator~() const
{
  return Abs(X,Y);
}
double TVector2D::operator!() const
{
  return ArcTan(X,Y);
}
const TVector2D TVector2D::operator-() const
{
  return TVector2D(-X,-Y);
}
const TVector2D TVector2D::operator*() const
{
  return TVector2D(X,-Y);
}
const TVector2D TVector2D::operator+(const TVector2F &v) const
{
  return TVector2D(X+v.X,Y+v.Y);
}
const TVector2D TVector2D::operator+(const TVector2D &v) const
{
  return TVector2D(X+v.X,Y+v.Y);
}
const TVector2D TVector2D::operator-(const TVector2F &v) const
{
  return TVector2D(X-v.X,Y-v.Y);
}
const TVector2D TVector2D::operator-(const TVector2D &v) const
{
  return TVector2D(X-v.X,Y-v.Y);
}
const TVector2D TVector2D::operator*(double d) const
{
  return TVector2D(X*d,Y*d);
}
const TVector2D TVector2D::operator/(double d) const
{
  return TVector2D(X/d,Y/d);
}
double TVector2D::operator*(const TVector2D &v) const
{
  return X*v.X+Y*v.Y;
}
double TVector2D::operator&(const TVector2D &v) const
{
  return X*v.Y-Y*v.X;
}
const TVector2D TVector2D::operator%(double angle) const
{
  return TVector2D(*this) %= TVector2D(angle);
}
const TVector2D TVector2D::operator%(const TVector2D &v) const
{
  return TVector2D(*this) %= v;
}
const TVector2D TVector2D::operator/(const TVector2D &v) const
{
  return TVector2D(*this) /= v;
}
bool TVector2D::operator==(const TVector2D &v) const
{
  return X==v.X && Y==v.Y;
}
bool TVector2D::operator!=(const TVector2D &v) const
{
  return X!=v.X || Y!=v.Y;
}
bool TVector2D::IsZeroXY() const
{
  return X==0 && Y==0;
}
double TVector2D::AbsXY() const
{
  return Abs(X,Y);
}
double TVector2D::AbsXY2() const
{
  return X*X+Y*Y;
}
double TVector2D::ArgXY() const
{
  return Arg(X,Y);
}
const TVector2D TVector2D::SgnXY() const
{
  const double length = operator~();
  return length>0 ? *this/length : *this;
}
const TVector2D TVector2D::LPerpXY() const
{
  return TVector2D(-Y,X);
}
const TVector2D TVector2D::RPerpXY() const
{
  return TVector2D(Y,-X);
}
const TVector2D TVector2D::Add(const TVector2D &v1,const TVector2D &v2)
{
  return TVector2D(Add0(v1.X,v2.X),Add0(v1.Y,v2.Y));
}
const TVector2D TVector2D::Sub(const TVector2D &v1,const TVector2D &v2)
{
  return TVector2D(Sub0(v1.X,v2.X),Sub0(v1.Y,v2.Y));
}
double TVector2D::MulDot(const TVector2D &v1,const TVector2D &v2)
{
  return Add0(v1.X*v2.X,v1.Y*v2.Y);
}
double TVector2D::MulCrs(const TVector2D &v1,const TVector2D &v2)
{
  return Sub0(v1.X*v2.Y,v1.Y*v2.X);
}
const TVector2D TVector2D::Mul(const TVector2D &v1,const TVector2D &v2)
{
  return TVector2D(Sub0(v1.X*v2.X,v1.Y*v2.Y),Add0(v1.X*v2.Y,v1.Y*v2.X));
}
const TVector2D& TVector2D::MinByLength(const TVector2D &v1,const TVector2D &v2)
{
  return Abs2(v1)<Abs2(v2) ? v1 : v2;
}
const TVector2D& TVector2D::MaxByLength(const TVector2D &v1,const TVector2D &v2)
{
  return Abs2(v1)>Abs2(v2) ? v1 : v2;
}
const TVector2D& TVector2D::MinByX(const TVector2D &v1,const TVector2D &v2)
{
  return v1.X<v2.X ? v1 : v2;
}
const TVector2D& TVector2D::MaxByX(const TVector2D &v1,const TVector2D &v2)
{
  return v1.X>v2.X ? v1 : v2;
}
const TVector2D& TVector2D::MinByY(const TVector2D &v1,const TVector2D &v2)
{
  return v1.Y<v2.Y ? v1 : v2;
}
const TVector2D& TVector2D::MaxByY(const TVector2D &v1,const TVector2D &v2)
{
  return v1.Y>v2.Y ? v1 : v2;
}
const TVector2D& TVector2D::MinByLength(const TVector2D &v1,const TVector2D &v2,const TVector2D &v3)
{
  const double
    l1 = v1*v1,
    l2 = v2*v2,
    l3 = v3*v3;
  return l1<l2 ? (l1<l3?v1:v3) : (l2<l3?v2:v3);
}
const TVector2D& TVector2D::MaxByLength(const TVector2D &v1,const TVector2D &v2,const TVector2D &v3)
{
  const double
    l1 = v1*v1,
    l2 = v2*v2,
    l3 = v3*v3;
  return l1>l2 ? (l1>l3?v1:v3) : (l2>l3?v2:v3);
}
const TVector2D TVector2D::RST_To_XY(const TVector3D &rst, const TVector2D &p1, const TVector2D &p2, const TVector2D &p3)
{
  return p1*rst.X+p2*rst.Y+p3*rst.Z;
}
bool TVector2D::XY_To_RST(const TVector2D &p,const TVector2D &p0, const TVector2D &p1,const TVector2D &p2,TVector3D &rst)
{
  const double s = Mat3::Det(p0.X,p0.Y,p1.X,p1.Y,p2.X,p2.Y);
  if (Abs(s) > 0)
  {
    const double d = 1.0/s;    
    rst.Y = Mat3::Det(p.X,p.Y,p0.X,p0.Y,p1.X,p1.Y)*d;
    rst.Z = Mat3::Det(p.X,p.Y,p1.X,p1.Y,p2.X,p2.Y)*d;
    rst.X = Mat3::Det(p.X,p.Y,p2.X,p2.Y,p0.X,p0.Y)*d;
    return rst.X>=0 && rst.Y>=0 && rst.Z>=0;
  }
  else
  {
    rst.X = rst.Y = rst.Z = 0;
    return false;
  }
}
const TVector2D TVector2D::ST_To_XY(const TVector2D &st,const TVector2D &p0,const TVector2D &px,const TVector2D &py,const TVector2D &pxy)
{
  return p0*((1-st.X)*(1-st.Y))+px*(st.X*(1-st.Y))+py*((1-st.X)*st.Y)+pxy*(st.X*st.Y);
}
void TVector2D::DST_To_XY(const TVector2D &st, const TVector2D &p0, const TVector2D &px,
  const TVector2D &py, const TVector2D &pxy, TVector2D &ds, TVector2D &dt, TVector2D &dst)
{
  ds = (px-p0)*(1-st.Y)+(pxy-py)*st.Y;
  dt = (py-p0)*(1-st.X)+(pxy-px)*st.X;
  dst = (pxy-py)-(px-p0);
}
bool TVector2D::XY_To_ST(const TVector2D &p,const TVector2D &p0,const TVector2D &px,const TVector2D &py,const TVector2D &pxy,TVector2D &st)
{
  const TVector2D
    V(Sub(p,p0)),
    Vs(Sub(px,p0)),
    Vt(Sub(py,p0)),
    Vd(Sub(p0+pxy,px+py));
  if (IsZero(Vd))  // s*Vs+t*Vt = V
  {
    if (IsZero(Vs) || IsZero(Vt))
      return false;
    const double d = MulCrs(Vs,Vt);
    if (d == 0)
      return false;
    st.X = MulCrs(V,Vt)/d;
    st.Y = MulCrs(Vs,V)/d;
  }
  else // s*Vs+t*Vt+s*t*Vd = V
  {
    const double
      bs = MulCrs(Vs,Vd),
      bt = MulCrs(Vt,Vd),
      bv = MulCrs(V,Vd);
    switch ((bs!=0?1:0) | (bt!=0?2:0))  // s*bs+t*bt = bd
    {
      case 1: // s = bd/bs
      {       // t = (V*Vt-s*Vs*Vt)/(Vt*Vt+s*Vd*Vt)
        st.X = bv/bs;
        const double d = Add0(Vt*Vt,st.X*MulDot(Vd,Vt));
        if (d == 0)
          return false;
        st.Y = Sub0(MulDot(V,Vt),st.X*MulDot(Vs,Vt))/d;
        break;
      }
      case 2: // t = bd/bt;
      {       // s = (V*Vs-t*Vt*Vs)/(Vs*Vs+t*Vd*Vs);
        st.Y = bv/bt;
        const double d = Add0(Vs*Vs,st.Y*MulDot(Vd,Vs));
        if (d == 0)
          return false;
        st.X = Sub0(MulDot(V,Vs),st.Y*MulDot(Vt,Vs))/d;
        break;
      }
      case 3: // s*bs+t*bt = bv;
      {       // s*ds+t*dt+s*t*dd = dv;
        const double
          ds = MulDot(Vd,Vs),
          dt = MulDot(Vd,Vt),
          dd = MulDot(Vd,Vd),
          dv = MulDot(Vd,V);
        const double a = bt*dd;
        if (a != 0)
        {
          const double
            b = Add0(bt*ds,-bs*dt,-bv*dd)/a,
            c = Sub0(bs*dv,bv*ds)/a;
          const double delta2 = Sub0(b*b,4*c);
          if (delta2 < 0)
            return false;
          const double
            delta = Sqrt(delta2),
            t1 = b>=0?(-2*c)/(delta+b):(delta-b)/2,
            t2 = b>=0?-(delta+b)/2:(2*c)/(delta-b);
          st.Y = t1>=0&&t2>=0?Min(t1,t2):t1>=0?t1:t2;
          st.X = Sub0(bv,st.Y*bt)/bs;
          break;
        }  
      }
      default:
        return false;
    }
  }
  return 0<=st.X && st.X<=1 && 0<=st.Y && st.Y<=1;
}
const TVector2D TVector2D::ProportionPosition(const TVector2D &p1,const TVector2D &p2,double s)
{
  return p1*(1-s)+p2*s;
}
const TVector2D TVector2D::ProportionPosition(const TVector2D &p1,double s1,const TVector2D &p2,double s2)
{
  return (p1*s2-p2*s1) / (s2-s1);
}
bool TVector2D::PointInQuad(const TVector2D &p,
  const TVector2D &q1,const TVector2D &q2,const TVector2D &q3,const TVector2D &q4)
{
  int d = 0;
  const TPosition2D *pp[4] = {&q1,&q2,&q4,&q3};
  for (int k=1; k<=4; ++k)
  {                                             
    const TPosition2D
      &p1 = *pp[k-1],
      &p2 = *pp[k%4];
    if ((p1.Y<p.Y||p2.Y<p.Y) && (p1.Y>=p.Y||p2.Y>=p.Y) && (p1.X>p.X||p2.X>p.X) && (p.X-p2.X<(p.Y-p2.Y)*(p1.X-p2.X)/(p1.Y-p2.Y)))
      ++d;
  }
  return d&1;
}
bool TVector2D::PointInPolygon(const TVector2D &p, const int nps, const TVector2D ps[])
{
  int d = 0;
  for (int k=1; k<=nps; ++k)
  {                                             
    const TPosition2D
      &p1 = ps[k-1],
      &p2 = ps[k%nps];
    if ((p1.Y<p.Y||p2.Y<p.Y) && (p1.Y>=p.Y||p2.Y>=p.Y) && (p1.X>p.X||p2.X>p.X) && (p.X-p2.X<(p.Y-p2.Y)*(p1.X-p2.X)/(p1.Y-p2.Y)))
      ++d;
  }
  return d&1;
}
bool TVector2D::LineIntersect(const TPosition2D &p1, const TPosition2D &p2, const TPosition2D &q1, const TPosition2D &q2)
{
  TVector2D vp(p2-p1),vq(q2-q1);
  if (~vp>0 && ~vq>0)
  {
    double
      d1 = TVector2D::MulCrs(q1-p1,vp),
      d2 = TVector2D::MulCrs(q2-p1,vp);
    if (d1*d2 < 0)
    {
      d1 = TVector2D::MulCrs(p1-q1,vq);
      d2 = TVector2D::MulCrs(p2-q1,vq);
      return d1*d2 < 0;
    }
  }                                   
  return false;  
}
bool TVector2D::LineIntersect(const TVector2D &p0, const TVector2D &p1, const TVector2D &q0, const TVector2D &q1, TVector2D &pq)
{
  if (Min(p0.X,p1.X) >= Max(q0.X,q1.X))
    return false;
  if (Max(p0.X,p1.X) <= Min(q0.X,q1.X))
    return false;
  if (Min(p0.Y,p1.Y) >= Max(q0.Y,q1.Y))
    return false;
  if (Max(p0.Y,p1.Y) <= Min(q0.Y,q1.Y))
    return false;

  const TVector2D vp(p1-p0);
  const double s1 = ~vp;
  if (s1 <= 0)
    return false;
    
  TVector2D vq(q1-q0);
  const double s2 = ~vq;
  if (s2 <= 0)
    return false;
    
  double
    d1 = (p0-q0)&vq,
    d2 = (p1-q0)&vq,
    d = d1*d2;
  if (d > 0)
    return false;
  d1 = (q0-p0)&vp;
  d2 = (q1-p0)&vp;
  d = d1*d2;
  if (d > 0)
    return false;
  d1 = Abs(d1);
  d2 = Abs(d2);
  d = d1+d2;
  if (d1<=0 || d2<=0)
  {
    pq = q0;
    return true;
  }
  d1 /= d;
  pq = q0+vq*d1;
  return true;
}
int TVector2D::TriIntersect(const TPosition2D &p1,const TPosition2D &p2,const TPosition2D &p3,
  const TPosition2D &q1,const TPosition2D &q2,const TPosition2D &q3,TPosition2D polygon[])
{
  int nps = 3;
  polygon[0] = q1;
  polygon[1] = q2;
  polygon[2] = q3;
  nps = LineCutConvexPolygon(p1,p2-p1,nps,polygon);
  nps = LineCutConvexPolygon(p2,p3-p2,nps,polygon);
  nps = LineCutConvexPolygon(p3,p1-p3,nps,polygon);
  return nps;
}
double TVector2D::TriCommonArea(const TVector2D &p1,const TVector2D &p2,const TVector2D &p3,const TVector2D &q1,const TVector2D &q2,const TVector2D &q3)
{
  const double 
    area1 = ((p2-p1)&(p3-p2)),
    area2 = ((q2-q1)&(q3-q2));
  double area = 0;
  if (area1>0 && area2>0)
  {
    TPosition2D polygon[8];
    const int nps = TriIntersect(p1,p2,p3,q1,q2,q3,polygon);
    if (nps >= 3)
    {
      const TPosition2D &p0 = polygon[0];
      for (int k=2; k<nps; ++k)
        area += (polygon[k-1]-p0)&(polygon[k]-p0);
    }
  }
  else if (area1<0 && area2<0)
  {
    TPosition2D polygon[8];
    const int nps = TriIntersect(p2,p1,p3,q2,q1,q3,polygon);
    if (nps >= 3)
    {
      const TPosition2D &p0 = polygon[0];
      for (int k=2; k<nps; ++k)
        area += (polygon[k-1]-p0)&(polygon[k]-p0);
    }
  }
  return area!=0?area/2:0.0;
}
bool LJF::IsZero(const TVector2D &v)
{
  return v.X==0 && v.Y==0;
}
double LJF::Abs(const TVector2D &v)
{
  return Abs(v.X,v.Y);
}
double LJF::Abs2(const TVector2D &v)
{
  return v*v;
}
double LJF::Arg(const TVector2D &v)
{
  return Arg(v.X,v.Y);
}
const TVector2D LJF::Sgn(const TVector2D &v)
{
  const double length = Abs(v);
  return length>0 ? v/length : v;
}
double LJF::Det2D(const TVector2D &v1,const TVector2D &v2)
{
  return v1.X*v2.Y-v1.Y*v2.X;
}
double LJF::Det2D(const TVector2D &v1,const TVector2D &v2,const TVector2D &v3)
{
  return Det2D(v1,v2)+Det2D(v2,v3)+Det2D(v3,v1);  
}
double LJF::Area2D(const TPosition2D &p1,const TPosition2D &p2,const TPosition2D &p3)
{
  return ((p2-p1)&(p3-p1))*0.5;
}
double LJF::Angle2D(const TVector2D &v1,const TVector2D &v2)
{
  return !(v1%*v2);
}
const TPosition2D LJF::PolarToPosition2D(double rho,double phi)
{
  return TVector2D(phi)*rho;
}
//---------------------------------------------------------------------------
TVector3D::TVector3D()
  : TVector2D(),Z(0)
{
}
TVector3D::TVector3D(double x,double y,double z)
  : TVector2D(x,y),Z(z)
{
}
TVector3D::TVector3D(const TVector3F &v)
  : TVector2D(v),Z(v.Z)
{
}
TVector3D::TVector3D(const TVector3D &v)
  : TVector2D(v),Z(v.Z)
{
}
TVector3D::TVector3D(const TVector2F &v,float z)
  : TVector2D(v),Z(z)
{
}
TVector3D::TVector3D(const TVector2D &v,double z)
  : TVector2D(v),Z(z)
{
}
TVector3D& TVector3D::operator=(const TVector2F &v)
{
  X = v.X;
  Y = v.Y;
  return *this;
}
TVector3D& TVector3D::operator=(const TVector2D &v)
{
  X = v.X;
  Y = v.Y;
  return *this;
}
TVector3D& TVector3D::operator=(const TVector3F &v)
{
  X = v.X;
  Y = v.Y;
  Z = v.Z;
  return *this;
}
TVector3D& TVector3D::operator=(const TVector3D &v)
{
  if (this != &v)
  {
    X = v.X;
    Y = v.Y;
    Z = v.Z;
  }
  return *this;
}
TVector3D& TVector3D::operator+=(const TVector3F &v)
{
  X += v.X;
  Y += v.Y;
  Z += v.Z;
  return *this;
}
TVector3D& TVector3D::operator+=(const TVector3D &v)
{
  X += v.X;
  Y += v.Y;
  Z += v.Z;
  return *this;
}
TVector3D& TVector3D::operator-=(const TVector3F &v)
{
  X -= v.X;
  Y -= v.Y;
  Z -= v.Z;
  return *this;
}
TVector3D& TVector3D::operator-=(const TVector3D &v)
{
  X -= v.X;
  Y -= v.Y;
  Z -= v.Z;
  return *this;
}
TVector3D& TVector3D::operator*=(double d)
{
  X *= d;
  Y *= d;
  Z *= d;
  return *this;
}
TVector3D& TVector3D::operator/=(double d)
{
  X /= d;
  Y /= d;
  Z /= d;
  return *this;
}
TVector3D& TVector3D::operator*=(const TTensor3D &t)
{
  TTensor3D::MulDot(*this,t,*this);
  return *this;  
}
TVector3D& TVector3D::operator&=(const TVector3D &v)
{
  return *this = *this&v;
}
TVector3D& TVector3D::operator%=(const TVector3D &v)
{
  return *this = *this%v;
}
TVector3D& TVector3D::operator/=(const TVector3D &v)
{
  return *this = *this/v;
}
double TVector3D::operator~() const
{
  return Abs(X,Y,Z);
}
const TVector3D TVector3D::operator-() const
{
  return TVector3D(-X,-Y,-Z);
}
const TVector3D TVector3D::operator*() const
{
  return TVector3D(X,Y,-Z);
}
const TVector3D TVector3D::operator+(const TVector3F &v) const
{
  return TVector3D(X+v.X,Y+v.Y,Z+v.Z);
}
const TVector3D TVector3D::operator+(const TVector3D &v) const
{
  return TVector3D(X+v.X,Y+v.Y,Z+v.Z);
}
const TVector3D TVector3D::operator-(const TVector3F &v) const
{
  return TVector3D(X-v.X,Y-v.Y,Z-v.Z);
}
const TVector3D TVector3D::operator-(const TVector3D &v) const
{
  return TVector3D(X-v.X,Y-v.Y,Z-v.Z);
}
const TVector3D TVector3D::operator*(double d) const
{
  return TVector3D(X*d,Y*d,Z*d);
}
const TVector3D TVector3D::operator/(double d) const
{
  return TVector3D(X/d,Y/d,Z/d);
}
double TVector3D::operator*(const TVector3D &v) const
{
  return X*v.X+Y*v.Y+Z*v.Z;
}
const TVector3D TVector3D::operator&(const TVector3D &v) const
{
  return TVector3D(Y*v.Z-Z*v.Y,Z*v.X-X*v.Z,X*v.Y-Y*v.X);
}
const TVector3D TVector3D::operator%(const TVector3D &v) const
{
  const double 
    lengthv = ~v,
    length0 = ~*this;
  if (length0>0 && lengthv>0)
  {
    const TVector2D vv(lengthv);
    const TVector3D
      vx(*this/length0),
      vz(v/lengthv),
      vy(Sgn(vz&vx));
    return vx*vv.X+vy*vv.Y+vz*(vz**this);
  }
  return *this;
}
const TVector3D TVector3D::operator/(const TVector3D &v) const
{
  const TVector3D
    vx(Sgn(v)),
    vz(Sgn(v&*this)),
    vy(Sgn(vz&vx));
  return vz*Arg(vx**this,vy**this);
}
const TVector3D TVector3D::operator*(const TTensor3D &t) const
{
  TVector3D rst;
  TTensor3D::MulDot(*this,t,rst);
  return rst;    
}
bool TVector3D::operator==(const TVector3D &v) const
{
  return X==v.X && Y==v.Y && Z==v.Z;
}
bool TVector3D::operator!=(const TVector3D &v) const
{
  return X==v.X || Y!=v.Y || Z!=v.Z;
}
const TVector3D TVector3D::Add(const TVector3D &v1,const TVector3D &v2)
{
  return TVector3D(Add0(v1.X,v2.X),Add0(v1.Y,v2.Y),Add0(v1.Z,v2.Z));
}
const TVector3D TVector3D::Sub(const TVector3D &v1,const TVector3D &v2)
{
  return TVector3D(Sub0(v1.X,v2.X),Sub0(v1.Y,v2.Y),Sub0(v1.Z,v2.Z));
}
double TVector3D::MulDot(const TVector3D &v1,const TVector3D &v2)
{
  return Add0(v1.X*v2.X,v1.Y*v2.Y,v1.Z*v2.Z);
}
const TVector3D TVector3D::MulCrs(const TVector3D &v1,const TVector3D &v2)
{
  return TVector3D(Sub0(v1.Y*v2.Z,v1.Z*v2.Y),Sub0(v1.Z*v2.X,v1.X*v2.Z),Sub0(v1.X*v2.Y,v1.Y*v2.X));
}
double TVector3D::Mul(const TVector3D &v1,const TVector3D &v2,const TVector3D &v3)
{
  return MulDot(MulCrs(v1,v2),v3);  
}
const TVector3D TVector3D::Normal(const TVector3D &p1,const TVector3D &p2,const TVector3D &p3)
{
  return (p3-p1)&(p2-p1);
}
const TVector3D TVector3D::Normal(const TVector3D &p1,const TVector3D &p2,const TVector3D &p3,const TVector3D &p4)
{
  return (p3-p1)&(p2-p4);
}
TVector2D& TVector3D::XY()
{
  return *this;
}
const TVector2D& TVector3D::XY() const
{
  return *this;
}
TVector2D& TVector3D::XY(const TVector2D &v)
{
  X = v.X;
  Y = v.Y;
  return *this;
}
bool TVector3D::IsZeroXYZ() const
{
  return X==0&&Y==0&&Z==0;
}
double TVector3D::AbsXYZ() const
{
  return Abs(X,Y,Z);
}
double TVector3D::AbsXYZ2() const
{
  return *this * *this;
}
double TVector3D::ArgZ() const
{
  return ArcTan(AbsXY(),Z);
}
const TVector3D TVector3D::SgnXYZ() const
{
  return Sgn(*this);
}
const TVector3D TVector3D::PerpYZ() const
{
  return TVector3D(X,-Z,Y);
}
const TVector3D TVector3D::PerpZX() const
{
  return TVector3D(Z,Y,-X);
}
const TVector3D& TVector3D::MinByLength(const TVector3D &v1,const TVector3D &v2)
{
  return v1*v1<v2*v2 ? v1 : v2;
}
const TVector3D& TVector3D::MaxByLength(const TVector3D &v1,const TVector3D &v2)
{
  return v1*v1>v2*v2 ? v1 : v2;
}
const TVector3D& TVector3D::MinByX(const TVector3D &v1,const TVector3D &v2)
{
  return v1.X<v2.X ? v1 : v2;
}
const TVector3D& TVector3D::MaxByX(const TVector3D &v1,const TVector3D &v2)
{
  return v1.X>v2.X ? v1 : v2;
}
const TVector3D& TVector3D::MinByY(const TVector3D &v1,const TVector3D &v2)
{
  return v1.Y<v2.Y ? v1 : v2;
}
const TVector3D& TVector3D::MaxByY(const TVector3D &v1,const TVector3D &v2)
{
  return v1.Y>v2.Y ? v1 : v2;
}
const TVector3D& TVector3D::MinByZ(const TVector3D &v1,const TVector3D &v2)
{
  return v1.Z<v2.Z ? v1 : v2;
}
const TVector3D& TVector3D::MaxByZ(const TVector3D &v1,const TVector3D &v2)
{
  return v1.Z>v2.Z ? v1 : v2;
}
const TVector3D& TVector3D::MinByLength(const TVector3D &v1,const TVector3D &v2,const TVector3D &v3)
{
  const double
    l1 = v1*v1,
    l2 = v2*v2,
    l3 = v3*v3;
  return l1<l2 ? (l1<l3?v1:v3) : (l2<l3?v2:v3);
}
const TVector3D& TVector3D::MaxByLength(const TVector3D &v1,const TVector3D &v2,const TVector3D &v3)
{
  const double
    l1 = Abs2(v1),
    l2 = Abs2(v2),
    l3 = Abs2(v3);
  return l1>l2 ? (l1>l3?v1:v3) : (l2>l3?v2:v3);
}
const TVector3D TVector3D::RST_To_XYZ(const TVector3D &rst, const TVector3D &p1, const TVector3D &p2, const TVector3D &p3)
{
  return p1*rst.X+p2*rst.Y+p3*rst.Z;
}
bool TVector3D::XYZ_To_RST(const TVector3D &p, const TVector3D &p0, const TVector3D &p1, const TVector3D &p2, TVector3D &rst)
{
  const TVector3D
    v1(p1-p0),
    v2(p2-p0);
  TVector3D v12(v1&v2);
  const double length2 = v12*v12;
  if (length2 > 0)
  {
    v12 /= length2;
    rst.Y = -(v2*v12);
    rst.Z = +(v1*v12);
    rst.X = 1-rst.X-rst.Y;
    return rst.X>=0 && rst.Y>=0 && rst.Z>=0;
  }
  else
  {
    rst.X = rst.Y = rst.Z = 0;    
    return false;
  }
}
const TVector3D TVector3D::ST_To_XYZ(const TVector2D &st, const TVector3D &p0,
  const TVector3D &px, const TVector3D &py, const TVector3D &pxy)
{
  return p0*((1-st.X)*(1-st.Y))+px*(st.X*(1-st.Y))+py*((1-st.X)*st.Y)+pxy*(st.X*st.Y);
}
void TVector3D::DST_To_XYZ(const TVector2D &st, const TVector3D &p0, const TVector3D &px,
  const TVector3D &py, const TVector3D &pxy, TVector3D &ds, TVector3D &dt, TVector3D &dst)
{
  ds = (px-p0)*(1-st.Y)+(pxy-py)*st.Y;
  dt = (py-p0)*(1-st.X)+(pxy-px)*st.X;
  dst = (pxy+p0)-(px+py); 
}
bool TVector3D::XYZ_To_ST(const TVector3D &xyz, const TVector3D &p0,
  const TVector3D &px, const TVector3D &py, const TVector3D &pxy, TVector2D &st)
{
  st.X = st.Y = 0.5;
  const TVector3D D(p0-xyz),Dx(px-p0),Dy(py-p0),Dxy(pxy-px-py+p0);
  const double
    DDx = D*Dx,
    DDy = D*Dy,
    DxDy = D*Dxy+Dx*Dy,
    DxDx = Dx*Dx,
    DyDy = Dy*Dy,
    DxDxy = Dx*Dxy,
    DyDxy = Dy*Dxy,
    DxyDxy = Dxy*Dxy;
  TVector2D dst;  
  for (int k=0; k<100; ++k)
  {
    const double
      F1 = DDx+DxDy*st.Y+DxDx*st.X+DxDxy*st.X*st.Y+DyDxy*st.Y*st.Y+DxyDxy*st.X*st.Y*st.Y,
      F2 = DDy+DxDy*st.X+DyDy*st.Y+DyDxy*st.X*st.Y+DxDxy*st.X*st.X+DxyDxy*st.X*st.X*st.Y;
    double  
      d1s = (Dx*Dx) + (Dx*Dxy)*st.Y + (Dxy*Dxy)*st.Y*st.Y,
      d1t = (D*Dxy+Dx*Dy) + (Dx*Dxy)*st.X + 2*(Dy*Dxy)*st.Y + 2*(Dxy*Dxy)*st.X*st.Y,
      d2s = (D*Dxy+Dx*Dy) + (Dy*Dxy)*st.Y + 2*(Dx*Dxy)*st.X + 2*(Dxy*Dxy)*st.X*st.Y,
      d2t = (Dy*Dy) + (Dy*Dxy)*st.X + (Dxy*Dxy)*st.X*st.X;
    const double  
      d1 = d1s*d2t,
      d2 = d1t*d2s,
      d = d1-d2;
    if (Abs(F1)<=1E-10 && Abs(F2)<=1E-10)
      return true;
    if (Abs(d) <= (Abs(d1)+Abs(d2))*1E-10)
      return false;
    d1s/=d;  d1t/=d;
    d2s/=d;  d2t/=d;
    dst.X = d1s*F1+d2s*F2;
    dst.Y = d1t*F1+d2t*F2;
    st -= dst;
  }
  return false;
}
const TVector3D TVector3D::RST_To_XYZ(const TVector3D &rst,
  const TVector3D &p0, const TVector3D &px, const TVector3D &py, const TVector3D &pxy,
  const TVector3D &pz, const TVector3D &pxz, const TVector3D &pyz, const TVector3D &pxyz)
{
  return p0*((1-rst.X)*(1-rst.Y)*(1-rst.Z))+px*(rst.X*(1-rst.Y)*(1-rst.Z))
        +py*((1-rst.X)*rst.Y*(1-rst.Z))+pxy*(rst.X*rst.Y*(1-rst.Z))
        +pz*((1-rst.X)*(1-rst.Y)*rst.Z)+pxz*(rst.X*(1-rst.Y)*rst.Z)
        +pyz*((1-rst.X)*rst.Y*rst.Z)+pxyz*(rst.X*rst.Y*rst.Z);
}
const TVector3D TVector3D::RST_To_XYZ(const TVector3D &rst, const TVector3D &p0, const TVector3D &px,
  const TVector3D &py, const TVector3D &pxy, const TVector3D &pz, const TVector3D &pxz,
  const TVector3D &pyz, const TVector3D &pxyz, TVector3D &dr, TVector3D &ds, TVector3D &dt)
{
  dr = (px-p0)*((1-rst.Y)*(1-rst.Z))+(pxy-py)*(rst.Y*(1-rst.Z))+(pxz-pz)*((1-rst.Y)*rst.Z)+(pxyz-pyz)*(rst.Y*rst.Z);
  ds = (py-p0)*((1-rst.X)*(1-rst.Z))+(pxy-px)*(rst.X*(1-rst.Z))+(pyz-pz)*((1-rst.X)*rst.Z)+(pxyz-pxz)*(rst.X*rst.Z);
  dt = (pz-p0)*((1-rst.X)*(1-rst.Y))+(pxz-px)*(rst.X*(1-rst.Y))+(pyz-py)*((1-rst.X)*rst.Y)+(pxyz-pxy)*(rst.X*rst.Y);
  return p0*((1-rst.X)*(1-rst.Y)*(1-rst.Z))+px*(rst.X*(1-rst.Y)*(1-rst.Z))
        +py*((1-rst.X)*rst.Y*(1-rst.Z))+pxy*(rst.X*rst.Y*(1-rst.Z))
        +pz*((1-rst.X)*(1-rst.Y)*rst.Z)+pxz*(rst.X*(1-rst.Y)*rst.Z)
        +pyz*((1-rst.X)*rst.Y*rst.Z)+pxyz*(rst.X*rst.Y*rst.Z);
}
const TVector3D TVector3D::RST_To_XYZ(const TVector3D &rst, const TVector3D &p0, const TVector3D &px,
  const TVector3D &py, const TVector3D &pxy, const TVector3D &pz, const TVector3D &pxz,
  const TVector3D &pyz, const TVector3D &pxyz, TVector3D &dr, TVector3D &ds, TVector3D &dt,
  TVector3D &drs, TVector3D &dst, TVector3D &dtr, TVector3D &drst)
{
  dr = (px-p0)*((1-rst.Y)*(1-rst.Z))+(pxy-py)*(rst.Y*(1-rst.Z))+(pxz-pz)*((1-rst.Y)*rst.Z)+(pxyz-pyz)*(rst.Y*rst.Z);
  ds = (py-p0)*((1-rst.X)*(1-rst.Z))+(pxy-px)*(rst.X*(1-rst.Z))+(pyz-pz)*((1-rst.X)*rst.Z)+(pxyz-pxz)*(rst.X*rst.Z);
  dt = (pz-p0)*((1-rst.X)*(1-rst.Y))+(pxz-px)*(rst.X*(1-rst.Y))+(pyz-py)*((1-rst.X)*rst.Y)+(pxyz-pxy)*(rst.X*rst.Y);
  drs = ((pxy-py)-(px-p0))*(1-rst.Z)+((pxyz-pyz)-(pxz-pz))*rst.Z;
  dst = ((pyz-pz)-(py-p0))*(1-rst.X)+((pxyz-pxz)-(pxy-px))*rst.X;
  dtr = ((pxz-px)-(pz-p0))*(1-rst.Y)+((pxyz-pxy)-(pyz-py))*rst.Y;
  drst = ((pxyz-pyz)-(pxz-pz))-((pxy-py)-(px-p0)); 
  return p0*((1-rst.X)*(1-rst.Y)*(1-rst.Z))+px*(rst.X*(1-rst.Y)*(1-rst.Z))
        +py*((1-rst.X)*rst.Y*(1-rst.Z))+pxy*(rst.X*rst.Y*(1-rst.Z))
        +pz*((1-rst.X)*(1-rst.Y)*rst.Z)+pxz*(rst.X*(1-rst.Y)*rst.Z)
        +pyz*((1-rst.X)*rst.Y*rst.Z)+pxyz*(rst.X*rst.Y*rst.Z);
}
bool TVector3D::XYZ_To_RST(const TVector3D &xyz, const TVector3D &p0,
  const TVector3D &px, const TVector3D &py, const TVector3D &pxy, const TVector3D &pz,
  const TVector3D &pxz, const TVector3D &pyz, const TVector3D &pxyz, TVector3D &rst)
{
  TPosition3D p;
  TVector3D dr,ds,dt,v;
  rst.X = rst.Y = rst.Z = 0.5;
  for (int k=0; k<100; ++k)
  {
    if ((v=RST_To_XYZ(rst,p0,px,py,pxy,pz,pxz,pyz,pxyz,dr,ds,dt)-xyz).AbsXY() <= 1E-10)
      return true;
    double d = TVector3D::Mul(dr,ds,dt);
    if (Abs(d) > 0)
    {
      d = 1/d;
      rst.X += TVector3D::Mul(v,ds,dt)*d;
      rst.Y += TVector3D::Mul(dr,v,dt)*d;
      rst.Z += TVector3D::Mul(dr,ds,v)*d; 
    }
    return false;             
  }
  return false;
}
const TVector3D TVector3D::ProportionPosition(const TVector3D &p1,const TVector3D &p2,double s)
{
  return p1*(1-s)+p2*s;
}
const TVector3D TVector3D::ProportionPosition(const TVector3D &p1,double s1,const TVector3D &p2,double s2)
{
  return (p1*s2-p2*s1) / (s2-s1);
}
bool TVector3D::LineIntersect3D(const TVector2D &cutline_start,const TVector2D &cutline_end,
  const TVector3D &line_start,const TVector3D &line_end,TVector3D &cutpoint)
{
  if (Min(cutline_start.X,cutline_end.X) >= Max(line_start.X,line_end.X))
    return false;
  if (Max(cutline_start.X,cutline_end.X) <= Min(line_start.X,line_end.X))
    return false;
  if (Min(cutline_start.Y,cutline_end.Y) >= Max(line_start.Y,line_end.Y))
    return false;
  if (Max(cutline_start.Y,cutline_end.Y) <= Min(line_start.Y,line_end.Y))
    return false;
  const double s1 = ~TVector2D(cutline_start-cutline_end);
  if (s1 <= 0)
    return false;
  const double s2 = ~TVector2D(line_start-line_end);
  if (s2 <= 0)
    return false;
  double
    d1 = TVector2D(cutline_start-line_start)&TVector2D(line_end-line_start),
    d2 = TVector2D(cutline_end-line_start)&TVector2D(line_end-line_start),
    d = d1*d2;
  if (d > 0)
    return false;
  d1 = TVector2D(line_start-cutline_start)&TVector2D(cutline_end-cutline_start);
  d2 = TVector2D(line_end-cutline_start)&TVector2D(cutline_end-cutline_start);
  d = d1*d2;
  if (d > 0)
    return false;
  d1 = Abs(d1);
  d2 = Abs(d2);
  d = d1+d2;
  if (d1<=0 || d2<=0)
  {
    cutpoint = line_start;
    return true;
  }
  d1 /= d;
  cutpoint = line_start+(line_end-line_start)*d1;
  return true;
}
//---------------------------------------------------------------------------
double TVector2D::GetDistanceOfPointToLine(const TVector2D &p,const TVector2D &p1,const TVector2D &p2)
{
  double distance;
  GetDistanceOfPointToLine(p,p1,p2,distance);
  return distance;
}
int TVector2D::GetDistanceOfPointToLine(const TVector2D &p,const TVector2D &p1,const TVector2D &p2,double &distance)
{  
  TVector2D v0(p2-p1);
  double length = ~v0;
  if (length > 0)
  {
    v0 /= length;
    const TVector2D v(p-p1);
    const double t = v*v0;
    if (t < 0)
    {
      distance = ~(p-p1);
      return 0;
    }
    else if (t > length)
    {
      distance = ~(p-p2);
      return 1;
    }
    else
    {
      distance = Abs(v&v0);
      return 2;
    }  
  }
  distance = ~(p-p1);
  return -1;
}
double TVector2D::GetDistanceOfPointAtLine(const TVector2D &p,const TVector2D &p1,const TVector2D &p2,double &distance)
{  
  TVector2D v0(p2-p1);
  const double length = ~v0;
  if (length > 0)
  {
    v0 /= length;
    TVector2D v(p-p1);
    const double t = v*v0;
    if (t < 0)
    {
      distance = ~(p-p1);
      return 0;
    }
    else if (t > length)
    {
      distance = ~(p-p2);
      return 1;
    }
    else
    {
      distance = Abs(v&v0);
      return t/length;
    }  
  }
  distance = ~(p-p1);
  return 0.5;
}
double TVector2D::GetDistanceOfPointToTri(const TVector2D &p,const TVector2D &p1,const TVector2D &p2,const TVector2D &p3)
{
  const TVector2D
    v2(p2-p1),
    v3(p3-p1);
  const double area = v2&v3;
  if (Abs(area) > 0)
  {
    const TVector2D v(p-p1);
    const double
      s = (v&v3)/area,
      t = (v2&v)/area,
      st= s+t;
    if (s>=0 && t>=0 && st<=1)
      return 0;
  }
  return Min(GetDistanceOfPointToLine(p,p1,p2),GetDistanceOfPointToLine(p,p2,p3),GetDistanceOfPointToLine(p,p3,p1));
}
double TVector3D::GetDistanceOfPointToLine(const TVector3D &p,const TVector3D &p1,const TVector3D &p2)
{
  double distance;
  GetDistanceOfPointToLine(p,p1,p2,distance);
  return distance;
}
int TVector3D::GetDistanceOfPointToLine(const TVector3D &p,const TVector3D &p1,const TVector3D &p2,double &distance)
{
  TVector3D v0(p2-p1);
  const double length = ~v0;
  if (length > 0)
  {
    v0 /= length;
    const TVector3D v(p-p1);
    const double t = v*v0;
    if (t < 0)
    {
      distance = ~v;
      return 0;
    }
    else if (t > length)
    {
      distance = ~(p-p2);
      return 1;
    }
    else
    {
      distance = ~(v&v0);
      return 2;
    }  
  }
  distance = ~(p-p1);
  return -1;
}
double TVector3D::GetDistanceOfPointToTri(const TVector3D &p,const TVector3D &p1,const TVector3D &p2,const TVector3D &p3)
{
  const TVector3D
    v2(p2-p1),
    v3(p3-p1);
  TVector3D vv(v2&v3);
  const double length = ~vv;
  if (length > 0)
  {
    vv /= length;
    const TVector3D v(p-p1);
    const double
      s = v*(v3&vv),
      t = v*(vv&v2),
      d = v*vv,
      st= s+t;
    if (s>=0 && t>=0 && st<=1)
      return d;
  }
  return Min(GetDistanceOfPointToLine(p,p1,p2),GetDistanceOfPointToLine(p,p2,p3),GetDistanceOfPointToLine(p,p3,p1));
}
void TVector3D::GetOxyzByNearest(TVector3D &vx,TVector3D &vy,TVector3D &vz)
{
  TMatrix A(3,3),u(3,3),v(3,3);
  A[0][0]=vx.X;  A[1][1]=vy.Y;  A[2][2]=vz.Z;
  A[0][1]=A[1][0] = (vx.Y+vy.X)/2;
  A[0][2]=A[2][0] = (vx.Z+vz.X)/2;
  A[1][2]=A[2][1] = (vy.Z+vz.Y)/2;
  A.Eigens_RealSymmetryJacobiB(v,1E-15f);
  vx.X=A[0][0]*v[0][0];  vx.Y = A[0][0]*v[1][0];  vx.Z = A[0][0]*v[2][0];
  vy.X=A[1][1]*v[0][1];  vy.Y = A[1][1]*v[1][1];  vy.Z = A[1][1]*v[2][1];
  vz.X=A[2][2]*v[0][2];  vz.Y = A[2][2]*v[1][2];  vz.Z = A[2][2]*v[2][2];
}
bool TVector3D::GetOxyzByVx(TVector3D &vx,TVector3D &vy,TVector3D &vz)
{
  return GetOxyzByVz(vy,vz,vx);  
}
bool TVector3D::GetOxyzByVy(TVector3D &vx,TVector3D &vy,TVector3D &vz)
{
  return GetOxyzByVz(vz,vx,vy);
}
bool TVector3D::GetOxyzByVz(TVector3D &vx,TVector3D &vy,TVector3D &vz)
{
  const double
    x = Abs(vz.X),
    y = Abs(vz.Y),
    z = Abs(vz.Z);
  const double r = Abs(x,y,z);
  if (r > 0)
  {
    vz = vz/r;
    vx = vz;
    if (x <= y)
    {
      if (x <= z)
        vx.X += r;
      else if (z <= x)
        vx.Z += r;
    }
    else
    {
      if (y <= z)
        vx.Y += r;
      else if (z <= y)
        vx.Z += r;
    }
    vy = Sgn(vz&vx);
    vx = Sgn(vy&vz);
    return true;
  }
  else
  {
    vx = TVector3D(1,0,0);
    vy = TVector3D(0,1,0);
    vz = TVector3D(0,0,1);
    return false;
  }  
}

//-------------------------------------------------------------------------
bool TVector3D::LineIntersectWithTri(const TVector3D &p1,const TVector3D &p2,const TVector3D &q1,const TVector3D &q2,const TVector3D &q3,TVector3D &p)
{
  const TVector3D vp(p2-p1);
  if (!IsZero(vp))
  {
    const TVector3D
      v2(q2-q1),
      v3(q3-q1);
    const double dd = Mul(v2,v3,vp);
    if (dd != 0)
    {
      const TVector3D vv(p1-q1);
      const double
        s = Mul(vv,v3,vp)/dd,
        t = Mul(vv,vp,v2)/dd,
        r = (((v2*s+v3*t)-vv)*vp)/(vp*vp);
      p = q1+v2*s+v3*t;
      return r>=0 && r<=1 && s>=0 && t>=0 && s+t<=1;
    }
  }  
  return false;
}
bool TVector3D::LineIntersectWithQuad(const TVector3D &p1,const TVector3D &p2,
  const TVector3D &q1,const TVector3D &q2,const TVector3D &q3,const TVector3D &q4,TVector3D &p)
{
  return LineIntersectWithTri(p1,p2,q1,q2,q3,p)?true:LineIntersectWithTri(p1,p2,q3,q4,q1,p);
}
bool LJF::IsZero(const TVector3D &v)
{
  return v.X==0 && v.Y==0 && v.Z==0;
}
double LJF::Abs(const TVector3D &v)
{
  return Abs(v.X,v.Y,v.Z);
}
double LJF::Abs2(const TVector3D &v)
{
  return v*v;
}
const TVector3D LJF::Sgn(const TVector3D &v)
{
  const double length = Abs(v);
  return length>0 ? v/length : v;
}
const TVector3D LJF::Area3D(const TPosition3D &p1,const TPosition3D &p2,const TPosition3D &p3)
{
  return TVector3D::MulCrs(p2-p1,p3-p1)*0.5; 
}
double LJF::Volumn(const TPosition3D &p1,const TPosition3D &p2,const TPosition3D &p3,const TPosition3D &p4)
{
  return TVector3D::Mul(p2-p1,p3-p1,p4-p1)/6;
}
double LJF::Det3D(const TVector3D &v1,const TVector3D &v2,const TVector3D &v3)
{
  return Mat3::Det(v1.X,v1.Y,v1.Z,v2.X,v2.Y,v2.Z,v3.X,v3.Y,v3.Z);
}
double LJF::DetXY(const TVector3D &v1,const TVector3D &v2,const TVector3D &v3)
{
  return Mat3::Det(v1.X,v1.Y,v2.X,v2.Y,v3.X,v3.Y);
}
double LJF::DetYZ(const TVector3D &v1,const TVector3D &v2,const TVector3D &v3)
{
  return Mat3::Det(v1.Y,v1.Z,v2.Y,v2.Z,v3.Y,v3.Z);
}
double LJF::DetZX(const TVector3D &v1,const TVector3D &v2,const TVector3D &v3)
{
  return Mat3::Det(v1.Z,v1.X,v2.Z,v2.X,v3.Z,v3.X);
}
//--------------------------------------------------------------------------
TVector2DValue::TVector2DValue()
  : Value(0)
{
}
TVector2DValue::TVector2DValue(const TVector2D &p,float value)
 : TVector2D(p),Value(value)
{
}
TVector2DValue::TVector2DValue(double x,double y,float value)
  : TVector2D(x,y),Value(value)
{ 
}
TVector2DValue& TVector2DValue::operator=(const TVector2DValue &p)
{
  if (&p != this)
  {
    TVector2D::operator=(p);
    Value = p.Value;
  }
  return *this;
}
TVector2DValue& TVector2DValue::operator=(const TVector2D &p)
{
  if (&p != this)
    TVector2D::operator=(p);
  return *this;
}
//--------------------------------------------------------------------------
TVector3DValue::TVector3DValue()
  : Value(0)
{
}
TVector3DValue::TVector3DValue(const TVector3D &p,float value)
  : TVector3D(p),Value(value)
{
}
TVector3DValue::TVector3DValue(double x,double y,double z,float value)
  : TVector3D(x,y,z),Value(value)
{
}
TVector3DValue& TVector3DValue::operator=(const TVector3DValue &p)
{
  if (&p != this)
  {
    TVector3D::operator=(p);
    Value = p.Value;
  }
  return *this;
}
TVector3DValue& TVector3DValue::operator=(const TVector3D &p)
{
  if (&p != this)
    TVector3D::operator=(p);
  return *this;
}
//------------------------------------------------------------------------
bool TComparePositionByX::operator()(const TPosition2D &p1,const TPosition2D &p2) const
{
  return p1.X<p2.X?true:p1.X>p2.X?false:p1.Y<p2.Y;
}
bool TComparePositionByY::operator()(const TPosition2D &p1,const TPosition2D &p2) const
{
  return p1.Y<p2.Y?true:p1.Y>p2.Y?false:p1.X<p2.X;
}
bool TComparePositionByZ::operator()(const TPosition3D &p1,const TPosition3D &p2) const
{
  return p1.Z<p2.Z?true:p1.Z>p2.Z?false:p1.Y<p2.Y?true:p1.Y>p2.Y?false:p1.X<p2.X;
}
float TFComparePositionByX::operator()(const TPosition2D &p1,const TPosition2D &p2) const
{
  return float(p1.X-p2.X);
}
float TFComparePositionByY::operator()(const TPosition2D &p1,const TPosition2D &p2) const
{
  return float(p1.Y-p2.Y);
}
float TFComparePositionByZ::operator()(const TPosition3D &p1,const TPosition3D &p2) const
{
  return float(p1.Z-p2.Z);
}
//------------------------------------------------------------------------
TVector4D::TVector4D()
  : W(0)
{
}
TVector4D::TVector4D(double x, double y, double z, double w)
  : TVector3D(x,y,z),W(w)
{
}
TVector4D::TVector4D(const TVector2D &v, double z, double w)
  : TVector3D(v,z),W(w)
{
}
TVector4D::TVector4D(const TVector3D &v, double w)
  : TVector3D(v),W(w)
{
}
TVector4D& TVector4D::operator=(const TVector2D &v)
{
  if (&v != this)
  {
    TVector3D::operator=(v);
    W = 0;
  }
  return *this;
}
TVector4D& TVector4D::operator=(const TVector3D &v)
{
  if (&v != this)
  {
    TVector3D::operator=(v);
    W = 0;
  }
  return *this;
}
TVector4D& TVector4D::operator=(const TVector4D &v)
{
  if (&v != this)
  {
    TVector3D::operator=(v);
    W = v.W;
  }
  return *this;
}
TVector4D& TVector4D::operator+=(const TVector4D &v)
{
  TVector3D::operator+=(v);
  W += v.W;
  return *this;
}
TVector4D& TVector4D::operator-=(const TVector4D &v)
{
  TVector3D::operator-=(v);
  W -= v.W;
  return *this;
}
TVector4D& TVector4D::operator*=(double d)
{
  TVector3D::operator*=(d);
  W *= d;
  return *this;
}
TVector4D& TVector4D::operator/=(double d)
{
  TVector3D::operator/=(d);
  W /= d;
  return *this;
}
const TVector4D& TVector4D::operator+() const
{
  return *this;
}
const TVector4D TVector4D::operator-() const
{
  return TVector4D(-X,-Y,-Z,-W); 
}
double TVector4D::operator~() const
{
  return Abs(X,Y,Z,W);
}
const TVector4D TVector4D::operator+(const TVector4D &v) const
{
  return TVector4D(X+v.X,Y+v.Y,Z+v.Z,W+v.W);
}
const TVector4D TVector4D::operator-(const TVector4D &v) const
{
  return TVector4D(X-v.X,Y-v.Y,Z-v.Z,W-v.W);
}
const TVector4D TVector4D::operator*(double d) const
{
  return TVector4D(X*d,Y*d,Z*d,W*d);
}
const TVector4D TVector4D::operator/(double d) const
{
  return TVector4D(X/d,Y/d,Z/d,W/d);
}
double TVector4D::operator*(const TVector4D &v) const
{
  return X*v.X+Y*v.Y+Z*v.Z+W*v.W;
}
bool TVector4D::operator==(const TVector4D &v) const
{
  return X==v.X && Y==v.Y && Z==v.Z && W==v.W;
}
bool TVector4D::operator!=(const TVector4D &v) const
{
  return X!=v.X || Y!=v.Y || Z!=v.Z || W!=v.W;
}
bool TVector4D::IsZeroXYZW() const
{
  return X==0 && Y==0 && Z==0 && W==0;
}
double TVector4D::AbsXYZW() const
{
  return Abs(X,Y,Z,W);
}
double TVector4D::AbsXYZW2() const
{
  return Sqr(X,Y,Z,W);
}