//---------------------------------------------------------------------------
#include "CGMBases.h"
#pragma hdrstop
#pragma package(smart_init)
//---------------------------------------------------------------------------
namespace LJF
{
static bool operator<(const TVector2D &v1,const TVector2D &v2)
{                                                                                   
  return v1.X<=v2.X && v1.Y<=v2.Y && (v1.X!=v2.X || v1.Y!=v2.Y);
}
static bool operator<=(const TVector2D &v1,const TVector2D &v2)
{
  return v1.X<=v2.X && v1.Y<=v2.Y;
}
static bool operator>(const TVector2D &v1,const TVector2D &v2)
{
  return v1.X>=v2.X && v1.Y>=v2.Y && (v1.X!=v2.X || v1.Y!=v2.Y);
}
static bool operator>=(const TVector2D &v1,const TVector2D &v2)
{
  return v1.X>=v2.X && v1.Y>=v2.Y;
}
static bool operator<(const TVector3D &v1,const TVector3D &v2)
{
  return v1.X<=v2.X && v1.Y<=v2.Y && v1.Z<=v2.Z && (v1.X!=v2.X || v1.Y!=v2.Y || v1.Z!=v2.Z);
}
static bool operator<=(const TVector3D &v1,const TVector3D &v2)
{
  return v1.X<=v2.X && v1.Y<=v2.Y && v1.Z<=v2.Z;
}
static bool operator>(const TVector3D &v1,const TVector3D &v2)
{
  return v1.X>=v2.X && v1.Y>=v2.Y && v1.Z>=v2.Z && (v1.X!=v2.X || v1.Y!=v2.Y || v1.Z!=v2.Z);
}
static bool operator>=(const TVector3D &v1,const TVector3D &v2)
{
  return v1.X>=v2.X && v1.Y>=v2.Y && v1.Z>=v2.Z;
}
}
using namespace LJF;
//---------------------------------------------------------------------------
TMinMax::TMinMax()
  : FValue(0),FIndex(0),FValid(false)
{
}
void TMinMax::Clear()
{
  FValue = 0;
  FIndex = 0;
  FValid = false;
}
bool TMinMax::Valid() const
{
  return FValid;
}
double TMinMax::Value() const
{
  return FValue;
}
int TMinMax::Index() const
{
  return FIndex;
}
void TMinMax::SetMinValue(double v,int index)
{
  if (!FValid)
  {
    FValue = v;
    FIndex = index;
    FValid = true;
  }
  else if (v < FValue)
  {
    FValue = v;
    FIndex = index;
  }
}
void TMinMax::SetMaxValue(double v,int index)
{
  if (!FValid)
  {
    FValue = v;
    FIndex = index;
    FValid = true;
  }
  else if (v > FValue)
  {
    FValue = v;
    FIndex = index;
  }
}
//---------------------------------------------------------------------------
TInterval1D::TInterval1D()
{
}
TInterval1D::TInterval1D(double point1,double point2)
{
  Min = ::Min(point1,point2);
  Max = ::Max(point1,point2);
}
bool TInterval1D::operator==(const TInterval1D &interval) const
{
  return Min==interval.Min && Max==interval.Max;  
}
bool TInterval1D::operator!=(const TInterval1D &interval) const
{
  return Min!=interval.Min || Max!=interval.Max;
}
bool TInterval1D::operator<(const TInterval1D &interval) const
{
  return operator<=(interval) && operator!=(interval);  
}
bool TInterval1D::operator<=(const TInterval1D &interval) const
{
  return Min>=interval.Min && interval.Max>=Max;
}
bool TInterval1D::operator>(const TInterval1D &interval) const
{
  return operator>=(interval) && operator!=(interval);
}
bool TInterval1D::operator>=(const TInterval1D &interval) const
{
  return Min<=interval.Min && interval.Max<=Max;
}
double TInterval1D::Center() const
{
  return (Min+Max) / 2;
}
double TInterval1D::Size() const
{
  return Max-Min;
}
void TInterval1D::Scale(double scale)
{
  double center = Center();
  Min = center+(Min-center)*scale;
  Max = center+(Max-center)*scale;
}
TInterval1D& TInterval1D::operator+=(double v)
{
  Min += v;
  Max += v;
  return *this;
}
TInterval1D& TInterval1D::operator-=(double v)
{
  Min -= v;
  Max -= v;
  return *this;
}
TInterval1D& TInterval1D::operator*=(double d)
{
  return *this=TInterval1D(Min*d,Max*d);
}
TInterval1D& TInterval1D::operator/=(double d)
{
  return *this=TInterval1D(Min/d,Max/d);
}
const TInterval1D TInterval1D::operator-() const
{
  return TInterval1D(-Min,-Max);
}
const TInterval1D TInterval1D::operator+(double v) const
{
  return TInterval1D(Min+v,Max+v);
}
const TInterval1D TInterval1D::operator-(double v) const
{
  return TInterval1D(Min-v,Max-v);
}
const TInterval1D TInterval1D::operator*(double d) const
{
  return TInterval1D(Min*d,Max*d);
}
const TInterval1D TInterval1D::operator/(double d) const
{
  return TInterval1D(Min/d,Max/d);
}
//---------------------------------------------------------------------------
TBound1D::TBound1D()
  : FValid(false),FIndexMin(-1),FIndexMax(-1)
{
}
TBound1D::TBound1D(const TInterval1D &interval,bool valid)
  : FInterval(interval),FValid(valid),FIndexMin(-1),FIndexMax(-1)
{
}
TBound1D& TBound1D::operator+=(double v)
{
  FInterval += v;
  return *this;
}
TBound1D& TBound1D::operator-=(double v)
{
  FInterval -= v;
  return *this;  
}
TBound1D& TBound1D::operator*=(double d)
{
  FInterval *= d;
  return *this;
}
TBound1D& TBound1D::operator/=(double d)
{
  FInterval /= d;
  return *this;
}
const TBound1D TBound1D::operator-() const
{
  return TBound1D(-FInterval,FValid);
}
const TBound1D TBound1D::operator+(double v) const
{
  return TBound1D(FInterval+v,FValid);
}
const TBound1D TBound1D::operator-(double v) const
{
  return TBound1D(FInterval-v,FValid);
}
const TBound1D TBound1D::operator*(double d) const
{
  return TBound1D(FInterval*d,FValid);
}
const TBound1D TBound1D::operator/(double d) const
{
  return TBound1D(FInterval/d,FValid);
}
bool TBound1D::operator==(const TBound1D &bds) const
{
  return !FValid&&!bds.FValid || FValid&&bds.FValid&&FInterval==bds.FInterval;
}
bool TBound1D::operator!=(const TBound1D &bds) const
{
  return !operator==(bds);
}
bool TBound1D::operator<(const TBound1D &bds) const
{
  return bds.FValid && (!FValid || FInterval<bds.FInterval);
}
bool TBound1D::operator<=(const TBound1D &bds) const
{
  return bds.FValid && (!FValid || FInterval<=bds.FInterval);
}
bool TBound1D::operator>(const TBound1D &bds) const
{
  return FValid && (!bds.FValid || FInterval>bds.FInterval);
}
bool TBound1D::operator>=(const TBound1D &bds) const
{
  return FValid && (!bds.FValid || FInterval>=bds.FInterval);
}
bool TBound1D::Valid() const
{
  return FValid;
}
const double& TBound1D::Min() const
{
  return FInterval.Min;
}
const double& TBound1D::Max() const
{
  return FInterval.Max;
}
int TBound1D::IMin() const
{
  return FIndexMin;
}
int TBound1D::IMax() const
{
  return FIndexMax;
}
void TBound1D::SetBound(const TBound1D &bds)
{
  if (bds.FValid)
  {
    SetBound(bds.FInterval.Min);
    SetBound(bds.FInterval.Max);
  }
}
void TBound1D::SetBound(double pos,int index)
{
  if (!FValid)
  {
    FInterval.Min = FInterval.Max = pos;
    FIndexMin = FIndexMax = index;
    FValid = true;
  }
  else
  {
    if (pos < FInterval.Min)
    {
      FInterval.Min = pos;
      FIndexMin = index;
    }
    if (pos > FInterval.Max)
    {
      FInterval.Max = pos;
      FIndexMax = index;
    }  
  }
}
void TBound1D::Clear()
{
  FValid = false;
  FInterval.Min = FInterval.Max = 0;
  FIndexMin = FIndexMax = -1;
}
bool TBound1D::InBound(double pos) const
{
  return FValid ? Between(FInterval.Min,pos,FInterval.Max) : false;
}
double TBound1D::Center() const
{
  return FInterval.Center();
}
double TBound1D::Size() const
{
  return FInterval.Size();
}
void TBound1D::Scale(double scale)
{
  return FInterval.Scale(scale);
}
//---------------------------------------------------------------------------
TInterval2D::TInterval2D()
{
}
TInterval2D::TInterval2D(const TVector2D &point1,const TVector2D &point2)
{
  Min.X = ::Min(point1.X,point2.X);
  Min.Y = ::Min(point1.Y,point2.Y);
  Max.X = ::Max(point1.X,point2.X);
  Max.Y = ::Max(point1.Y,point2.Y);
}
bool TInterval2D::operator==(const TInterval2D &interval) const
{
  return Min==interval.Min && Max==interval.Max;  
}
bool TInterval2D::operator!=(const TInterval2D &interval) const
{
  return Min!=interval.Min || Max!=interval.Max;
}
bool TInterval2D::operator<(const TInterval2D &interval) const
{
  return operator<=(interval) && operator!=(interval);  
}
bool TInterval2D::operator<=(const TInterval2D &interval) const
{
  return Min>=interval.Min && interval.Max>=Max;
}
bool TInterval2D::operator>(const TInterval2D &interval) const
{
  return operator>=(interval) && operator!=(interval);
}
bool TInterval2D::operator>=(const TInterval2D &interval) const
{
  return Min<=interval.Min && interval.Max<=Max;
}
const TVector2D TInterval2D::Center() const
{
  return (Min+Max) / 2;
}
const TVector2D TInterval2D::Size() const
{
  return Max-Min;
}
TInterval2D& TInterval2D::operator+=(const TVector2D &v)
{
  Min += v;
  Max += v;
  return *this;
}
TInterval2D& TInterval2D::operator-=(const TVector2D &v)
{
  Min -= v;
  Max -= v;
  return *this;
}
TInterval2D& TInterval2D::operator%=(const TVector2D &v)
{
  return *this=TInterval2D(Min%v,Max%v);
}
TInterval2D& TInterval2D::operator*=(double d)
{
  return *this=TInterval2D(Min*d,Max*d);
}
TInterval2D& TInterval2D::operator/=(double d)
{
  return *this=TInterval2D(Min/d,Max/d);
}
const TInterval2D TInterval2D::operator-() const
{
  return TInterval2D(-Min,-Max);
}
const TInterval2D TInterval2D::operator+(const TVector2D &v) const
{
  return TInterval2D(Min+v,Max+v);
}
const TInterval2D TInterval2D::operator-(const TVector2D &v) const
{
  return TInterval2D(Min-v,Max-v);
}
const TInterval2D TInterval2D::operator%(const TVector2D &v) const
{
  return TInterval2D(Min%v,Max%v);
}
const TInterval2D TInterval2D::operator*(double d) const
{
  return TInterval2D(Min*d,Max*d);
}
const TInterval2D TInterval2D::operator/(double d) const
{
  return TInterval2D(Min/d,Max/d);
}
void TInterval2D::Scale(double scale)
{
  TPosition2D center = Center();
  Min = center+(Min-center)*scale;
  Max = center+(Max-center)*scale;
}
void TInterval2D::Rotate(double angle)
{
  TPosition2D center = Center();
  Min = center+(Min-center)%angle;
  Max = center+(Max-center)%angle;
}
//---------------------------------------------------------------------------
TBound2D::TBound2D()
  : FValid(false)
{
}
TBound2D::TBound2D(const TInterval2D &interval,bool valid)
  : FInterval(interval),FValid(valid)
{
}
TBound2D& TBound2D::operator=(const TBound2D& bound2d)
{
  if (this != &bound2d )
  {
    FInterval = bound2d.FInterval;
    FValid = bound2d.FValid;
  }
  return *this;
}
TBound2D& TBound2D::operator+=(const TVector2D &v)
{
  FInterval += v;
  return *this;  
}
TBound2D& TBound2D::operator-=(const TVector2D &v)
{
  FInterval -= v;
  return *this;  
}
TBound2D& TBound2D::operator%=(const TVector2D &v)
{
  FInterval %= v;
  return *this;  
}
TBound2D& TBound2D::operator*=(double d)
{
  FInterval *= d;
  return *this;
}
TBound2D& TBound2D::operator/=(double d)
{
  FInterval /= d;
  return *this;
}
const TBound2D TBound2D::operator-() const
{
  return TBound2D(-FInterval,FValid);
}
const TBound2D TBound2D::operator+(const TVector2D &v) const
{
  return TBound2D(FInterval+v,FValid);
}
const TBound2D TBound2D::operator-(const TVector2D &v) const
{
  return TBound2D(FInterval-v,FValid);
}
const TBound2D TBound2D::operator%(const TVector2D &v) const
{
  return TBound2D(FInterval%v,FValid);
}
const TBound2D TBound2D::operator*(double d) const
{
  return TBound2D(FInterval*d,FValid);
}
const TBound2D TBound2D::operator/(double d) const
{
  return TBound2D(FInterval/d,FValid);
}
bool TBound2D::operator==(const TBound2D &bds) const
{
  return !FValid&&!bds.FValid || FValid&&bds.FValid&&FInterval==bds.FInterval;
}
bool TBound2D::operator!=(const TBound2D &bds) const
{
  return !operator==(bds);
}
bool TBound2D::operator<(const TBound2D &bds) const
{
  return bds.FValid && (!FValid || FInterval<bds.FInterval);
}
bool TBound2D::operator<=(const TBound2D &bds) const
{
  return bds.FValid && (!FValid || FInterval<=bds.FInterval);
}
bool TBound2D::operator>(const TBound2D &bds) const
{
  return FValid && (!bds.FValid || FInterval>bds.FInterval);
}
bool TBound2D::operator>=(const TBound2D &bds) const
{
  return FValid && (!bds.FValid || FInterval>=bds.FInterval);
}
bool TBound2D::Valid() const
{
  return FValid;
}
const TPosition2D& TBound2D::Min() const
{
  return FInterval.Min;
}
const TPosition2D& TBound2D::Max() const
{
  return FInterval.Max;
}
const TInterval2D& TBound2D::Interval() const
{
  return FInterval; 
}
void TBound2D::SetBound(const TBound2D &bds)
{
  if (bds.FValid)
  {
    SetBound(bds.FInterval.Min);
    SetBound(bds.FInterval.Max);
  }    
}
void TBound2D::SetBound(double x,double y)
{
  SetBound(TPosition2D(x,y));  
}
void TBound2D::SetBound(const TPosition2D &pos)
{
  if (!FValid)
  {
    FInterval.Min = FInterval.Max = pos;
    FValid = true;
  }
  else
  {
    FInterval.Min.X = ::Min(FInterval.Min.X,pos.X);
    FInterval.Min.Y = ::Min(FInterval.Min.Y,pos.Y);
    FInterval.Max.X = ::Max(FInterval.Max.X,pos.X);
    FInterval.Max.Y = ::Max(FInterval.Max.Y,pos.Y);
  }
}
void TBound2D::SetBounds(const TPosition2Ds &points)
{
  for (int k=0,n=points.Count(); k<n; ++k)
    SetBound(points[k]);
}
void TBound2D::Clear()
{
  FValid = false;
  FInterval.Min = FInterval.Max = TPosition2D();
}
bool TBound2D::InBound(const TPosition2D &pos) const
{
  return FValid ? Between(FInterval.Min.X, pos.X, FInterval.Max.X)
    && Between(FInterval.Min.Y, pos.Y, FInterval.Max.Y) : false;
}
const TPosition2D TBound2D::Center() const
{
  return FInterval.Center();
}
const TPosition2D TBound2D::Size() const
{
  return FInterval.Size();
}
void TBound2D::Scale(double scale)
{
  FInterval.Scale(scale);
}
void TBound2D::Rotate(double angle)
{
  FInterval.Rotate(angle);
}
void TBound2D::GetCorners(TPosition2D corners[4]) const
{
	corners[0].X = corners[3].X = Min().X;
	corners[1].X = corners[2].X = Max().X;
	corners[0].Y = corners[1].Y = Min().Y;
	corners[2].Y = corners[3].Y = Max().Y;
}
//---------------------------------------------------------------------------
TInterval3D::TInterval3D()
{
}
TInterval3D::TInterval3D(const TPosition3D &point1,const TPosition3D &point2)
{
  Min.X = ::Min(point1.X,point2.X);
  Min.Y = ::Min(point1.Y,point2.Y);
  Min.Z = ::Min(point1.Z,point2.Z);
  Max.X = ::Max(point1.X,point2.X);
  Max.Y = ::Max(point1.Y,point2.Y);
  Max.Z = ::Max(point1.Z,point2.Z);
}
bool TInterval3D::operator==(const TInterval3D &interval) const
{
  return Min==interval.Min && Max==interval.Max;
}
bool TInterval3D::operator!=(const TInterval3D &interval) const
{
  return Min!=interval.Min || Max!=interval.Max;
}
bool TInterval3D::operator<(const TInterval3D &interval) const
{
  return operator<=(interval) && operator!=(interval);
}
bool TInterval3D::operator<=(const TInterval3D &interval) const
{
  return Min>=interval.Min && interval.Max>=Max;
}
bool TInterval3D::operator>(const TInterval3D &interval) const
{
  return operator>=(interval) && operator!=(interval);
}
bool TInterval3D::operator>=(const TInterval3D &interval) const
{
  return Min<=interval.Min && interval.Max<=Max;
}
const TPosition3D TInterval3D::Center() const
{
  return (Min+Max)/2;
}
const TVector3D TInterval3D::Size() const
{
  return Max-Min;
}
void TInterval3D::Scale(double scale)
{
  TPosition3D center = Center();
  Min = center+(Min-center)*scale;
  Max = center+(Max-center)*scale;  
}
TInterval3D& TInterval3D::operator+=(const TVector3D &v)
{
  Min += v;
  Max += v;
  return *this;
}
TInterval3D& TInterval3D::operator-=(const TVector3D &v)
{
  Min -= v;
  Max -= v;
  return *this;
}
TInterval3D& TInterval3D::operator&=(const TVector3D &v)
{
  return *this=TInterval3D(Min&v,Max&v);
}
TInterval3D& TInterval3D::operator*=(double d)
{
  return *this=TInterval3D(Min*d,Max*d);
}
TInterval3D& TInterval3D::operator/=(double d)
{
  return *this=TInterval3D(Min/d,Max/d);
}
const TInterval3D TInterval3D::operator-() const
{
  return TInterval3D(-Min,-Max);
}
const TInterval3D TInterval3D::operator+(const TVector3D &v) const
{
  return TInterval3D(Min+v,Max+v);
}
const TInterval3D TInterval3D::operator-(const TVector3D &v) const
{
  return TInterval3D(Min-v,Max-v);
}
const TInterval3D TInterval3D::operator&(const TVector3D &v) const
{
  return TInterval3D(Min&v,Max&v);
}
const TInterval3D TInterval3D::operator*(double d) const
{
  return TInterval3D(Min*d,Max*d);
}
const TInterval3D TInterval3D::operator/(double d) const
{
  return TInterval3D(Min/d,Max/d);
}
//---------------------------------------------------------------------------
TBound3D::TBound3D()
  : FValid(false)
{
}
TBound3D::TBound3D(const TInterval3D &interval,bool valid)
  : FInterval(interval),FValid(valid)
{
}
TBound3D& TBound3D::operator=(const TBound3D& bounds)
{
  if (this != &bounds)
  {
    FInterval = bounds.FInterval;
    FValid = bounds.FValid;
  }
  return *this;
}
TBound3D& TBound3D::operator+=(const TVector3D &v)
{
  FInterval += v;
  return *this;
}
TBound3D& TBound3D::operator-=(const TVector3D &v)
{
  FInterval -= v;
  return *this;
}
TBound3D& TBound3D::operator&=(const TVector3D &v)
{
  FInterval &= v;
  return *this;
}
TBound3D& TBound3D::operator*=(double d)
{
  FInterval *= d;
  return *this;
}
TBound3D& TBound3D::operator/=(double d)
{
  FInterval /= d;
  return *this;
}
const TBound3D TBound3D::operator-() const
{
  return TBound3D(-FInterval,FValid);
}
const TBound3D TBound3D::operator+(const TVector3D &v) const
{
  return TBound3D(FInterval+v,FValid);
}
const TBound3D TBound3D::operator-(const TVector3D &v) const
{
  return TBound3D(FInterval-v,FValid);
}
const TBound3D TBound3D::operator&(const TVector3D &v) const
{
  return TBound3D(FInterval&v,FValid);
}
const TBound3D TBound3D::operator*(double d) const
{
  return TBound3D(FInterval*d,FValid);
}
const TBound3D TBound3D::operator/(double d) const
{
  return TBound3D(FInterval/d,FValid);
}
bool TBound3D::operator==(const TBound3D &bds) const
{
  return !FValid&&!bds.FValid || FValid && bds.FValid && FInterval==bds.FInterval;
}
bool TBound3D::operator!=(const TBound3D &bds) const
{
  return !operator==(bds);
}
bool TBound3D::operator<(const TBound3D &bds) const
{
  return bds.FValid && (!FValid || FInterval<bds.FInterval);
}
bool TBound3D::operator<=(const TBound3D &bds) const
{
  return bds.FValid && (!FValid || FInterval<=bds.FInterval);
}
bool TBound3D::operator>(const TBound3D &bds) const
{
  return FValid && (!bds.FValid || FInterval>bds.FInterval);
}
bool TBound3D::operator>=(const TBound3D &bds) const
{
  return FValid && (!bds.FValid || FInterval>=bds.FInterval);
}
bool TBound3D::Valid() const
{
  return FValid;
}
const TPosition3D& TBound3D::Min() const
{
  return FInterval.Min;
}
const TPosition3D& TBound3D::Max() const
{
  return FInterval.Max;
}
void TBound3D::Clear()
{
  FValid = false;
  FInterval.Min = FInterval.Max = TPosition3D();
}
void TBound3D::SetBound(const TBound3D &bds)
{
  if (bds.Valid())
  {
    SetBound(bds.FInterval.Min);
    SetBound(bds.FInterval.Max);
  }
}
void TBound3D::SetBound(double x,double y,double z)
{
  SetBound(TPosition3D(x,y,z));
}
void TBound3D::SetBound(const TPosition2D &pos,double z)
{
  SetBound(TPosition3D(pos,z));
}
void TBound3D::SetBound(const TPosition3D &pos)
{
  if (!FValid)
  {
    FInterval.Min = FInterval.Max = pos;
    FValid = true;
  }
  else
  {
    FInterval.Min.X = ::Min(FInterval.Min.X,pos.X);
    FInterval.Min.Y = ::Min(FInterval.Min.Y,pos.Y);
    FInterval.Min.Z = ::Min(FInterval.Min.Z,pos.Z);
    FInterval.Max.X = ::Max(FInterval.Max.X,pos.X);
    FInterval.Max.Y = ::Max(FInterval.Max.Y,pos.Y);
    FInterval.Max.Z = ::Max(FInterval.Max.Z,pos.Z);
  }
}
void TBound3D::SetBounds(const TPosition2Ds &points,double z)
{
  for (int k=0,n=points.Count(); k<n; ++k)
    SetBound(points[k],z);
}
void TBound3D::SetBounds(const TPosition3Ds &points)
{
  for (int k=0,n=points.Count(); k<n; ++k)
    SetBound(points[k]);
}
bool TBound3D::InBound(const TPosition3D &pos) const
{
  return FValid ? Between(FInterval.Min.X,pos.X,FInterval.Max.X)
      &&Between(FInterval.Min.Y,pos.Y,FInterval.Max.Y)
      &&Between(FInterval.Min.Z,pos.Z,FInterval.Max.Z) : false;
}
const TPosition3D TBound3D::Center() const
{
  return FInterval.Center();
}
const TPosition3D TBound3D::Size() const
{
  return FInterval.Size();
}
void TBound3D::Scale(double scale)
{
  FInterval.Scale(scale);
}
void TBound3D::GetCorners(TPosition2D corners[4]) const
{
	corners[0].X = corners[3].X = Min().X;
	corners[1].X = corners[2].X = Max().X;
	corners[0].Y = corners[1].Y = Min().Y;
	corners[2].Y = corners[3].Y = Max().Y;
}
//---------------------------------------------------------------------------
TInterval4D::TInterval4D()
{
}
TInterval4D::TInterval4D(const TPosition4D &point1,const TPosition4D &point2)
{
  Min.X = ::Min(point1.X,point2.X);
  Min.Y = ::Min(point1.Y,point2.Y);
  Min.Z = ::Min(point1.Z,point2.Z);
  Max.X = ::Max(point1.X,point2.X);
  Max.Y = ::Max(point1.Y,point2.Y);
  Max.Z = ::Max(point1.Z,point2.Z);
}
bool TInterval4D::operator==(const TInterval4D &interval) const
{
  return Min==interval.Min && Max==interval.Max;
}
bool TInterval4D::operator!=(const TInterval4D &interval) const
{
  return Min!=interval.Min || Max!=interval.Max;
}
bool TInterval4D::operator<(const TInterval4D &interval) const
{
  return operator<=(interval) && operator!=(interval);
}
bool TInterval4D::operator<=(const TInterval4D &interval) const
{
  return Min>=interval.Min && interval.Max>=Max;
}
bool TInterval4D::operator>(const TInterval4D &interval) const
{
  return operator>=(interval) && operator!=(interval);
}
bool TInterval4D::operator>=(const TInterval4D &interval) const
{
  return Min<=interval.Min && interval.Max<=Max;
}
const TPosition4D TInterval4D::Center() const
{
  return (Min+Max)/2.0;
}
const TVector4D TInterval4D::Size() const
{
  return Max-Min;
}
void TInterval4D::Scale(double scale)
{
  TPosition4D center = Center();
  Min = center+(Min-center)*scale;
  Max = center+(Max-center)*scale;  
}
TInterval4D& TInterval4D::operator+=(const TVector4D &v)
{
  Min += v;
  Max += v;
  return *this;
}
TInterval4D& TInterval4D::operator-=(const TVector4D &v)
{
  Min -= v;
  Max -= v;
  return *this;
}
TInterval4D& TInterval4D::operator*=(double d)
{
  return *this=TInterval4D(Min*d,Max*d);
}
TInterval4D& TInterval4D::operator/=(double d)
{
  return *this=TInterval4D(Min/d,Max/d);
}
const TInterval4D TInterval4D::operator-() const
{
  return TInterval4D(-Min,-Max);
}
const TInterval4D TInterval4D::operator+(const TVector4D &v) const
{
  return TInterval4D(Min+v,Max+v);
}
const TInterval4D TInterval4D::operator-(const TVector4D &v) const
{
  return TInterval4D(Min-v,Max-v);
}
const TInterval4D TInterval4D::operator*(double d) const
{
  return TInterval4D(Min*d,Max*d);
}
const TInterval4D TInterval4D::operator/(double d) const
{
  return TInterval4D(Min/d,Max/d);
}
//---------------------------------------------------------------------------
TBound4D::TBound4D()
  : FValid(false)
{
}
TBound4D::TBound4D(const TInterval4D &interval,bool valid)
  : FInterval(interval),FValid(valid)
{
}
TBound4D& TBound4D::operator=(const TBound4D& bounds)
{
  if (this != &bounds)
  {
    FInterval = bounds.FInterval;
    FValid = bounds.FValid;
  }
  return *this;
}
TBound4D& TBound4D::operator+=(const TVector4D &v)
{
  FInterval += v;
  return *this;
}
TBound4D& TBound4D::operator-=(const TVector4D &v)
{
  FInterval -= v;
  return *this;
}
TBound4D& TBound4D::operator*=(double d)
{
  FInterval *= d;
  return *this;
}
TBound4D& TBound4D::operator/=(double d)
{
  FInterval /= d;
  return *this;
}
const TBound4D TBound4D::operator-() const
{
  return TBound4D(-FInterval,FValid);
}
const TBound4D TBound4D::operator+(const TVector4D &v) const
{
  return TBound4D(FInterval+v,FValid);
}
const TBound4D TBound4D::operator-(const TVector4D &v) const
{
  return TBound4D(FInterval-v,FValid);
}
const TBound4D TBound4D::operator*(double d) const
{
  return TBound4D(FInterval*d,FValid);
}
const TBound4D TBound4D::operator/(double d) const
{
  return TBound4D(FInterval/d,FValid);
}
bool TBound4D::operator==(const TBound4D &bds) const
{
  return !FValid&&!bds.FValid || FValid&&bds.FValid&&FInterval==bds.FInterval;
}
bool TBound4D::operator!=(const TBound4D &bds) const
{
  return !operator==(bds);
}
bool TBound4D::operator<(const TBound4D &bds) const
{
  return bds.FValid && (!FValid || FInterval<bds.FInterval);
}
bool TBound4D::operator<=(const TBound4D &bds) const
{
  return bds.FValid && (!FValid || FInterval<=bds.FInterval);
}
bool TBound4D::operator>(const TBound4D &bds) const
{
  return FValid && (!bds.FValid || FInterval>bds.FInterval);
}
bool TBound4D::operator>=(const TBound4D &bds) const
{
  return FValid && (!bds.FValid || FInterval>=bds.FInterval);
}
bool TBound4D::Valid() const
{
  return FValid;
}
const TPosition4D& TBound4D::Min() const
{
  return FInterval.Min;
}
const TPosition4D& TBound4D::Max() const
{
  return FInterval.Max;
}
void TBound4D::Clear()
{
  FValid = false;
  FInterval.Min = FInterval.Max = TPosition4D();
}
void TBound4D::SetBound(const TBound4D &bds)
{
  if (bds.Valid())
  {
    SetBound(bds.FInterval.Min);
    SetBound(bds.FInterval.Max);
  }
}
void TBound4D::SetBound(double x,double y,double z,double w)
{
  SetBound(TPosition4D(x,y,z,w));
}
void TBound4D::SetBound(const TPosition3D &pos,double w)
{
  SetBound(TPosition4D(pos,w));
}
void TBound4D::SetBound(const TPosition4D &pos)
{
  if (!FValid)
  {
    FInterval.Min = FInterval.Max = pos;
    FValid = true;
  }
  else
  {
    FInterval.Min.X = ::Min(FInterval.Min.X,pos.X);
    FInterval.Min.Y = ::Min(FInterval.Min.Y,pos.Y);
    FInterval.Min.Z = ::Min(FInterval.Min.Z,pos.Z);
    FInterval.Min.W = ::Min(FInterval.Min.W,pos.W);
    FInterval.Max.X = ::Max(FInterval.Max.X,pos.X);
    FInterval.Max.Y = ::Max(FInterval.Max.Y,pos.Y);
    FInterval.Max.Z = ::Max(FInterval.Max.Z,pos.Z);
    FInterval.Max.W = ::Max(FInterval.Max.W,pos.W);
  }
}
void TBound4D::SetBounds(const TPosition3Ds &points,double w)
{
  for (int k=0,n=points.Count(); k<n; ++k)
    SetBound(points[k],w);
}
void TBound4D::SetBounds(const TPosition4Ds &points)
{
  for (int k=0,n=points.Count(); k<n; ++k)
    SetBound(points[k]);
}
bool TBound4D::InBound(const TPosition4D &pos) const
{
  return FValid ? Between(FInterval.Min.X, pos.X, FInterval.Max.X)
               && Between(FInterval.Min.Y, pos.Y, FInterval.Max.Y)
               && Between(FInterval.Min.Z, pos.Z, FInterval.Max.Z)
               && Between(FInterval.Min.W, pos.W, FInterval.Max.W) : false;
}
const TPosition4D TBound4D::Center() const
{
  return FInterval.Center();
}
const TPosition4D TBound4D::Size() const
{
  return FInterval.Size();
}
void TBound4D::Scale(double scale)
{
  FInterval.Scale(scale);
}
//---------------------------------------------------------------------------
bool TViewRect::InRect(const TPosition2D &point) const
{
  for (int k=0; k<4; ++k)
  {
    if (!DoInRect(k,point))
      return false;
  }
  return true;
}
bool TViewRect::DoInRect(int k,const TPosition2D &point) const
{
  TPosition2D q(Points[k]);
  return ((point-q)&(Points[(k+1)&3]-q)) < 0;
}
bool TViewRect::RectLine(TPosition2D &p1,TPosition2D &p2) const
{
  for (int k=0; k<4; ++k)
  {
    if (!DoRectLine(k,p1,p2))
      return false;
  }
  return true;
}
bool TViewRect::RectLine3D(TPosition3D &p1,TPosition3D &p2) const
{
  for (int k=0; k<4; ++k)
  {
    if (!DoRectLine(k,p1,p2))
      return false;
  }
  return true;
}
bool TViewRect::DoRectLine(int k,TPosition2D &p1,TPosition2D &p2) const
{
  TPosition2D q(Points[k]);
  TVector2D v(Points[(k+1)&3]-q);
  const double v1((p1-q)&v),v2((p2-q)&v);
  if (v1>=0 && v2>=0)
    return false;
  if (v1<=0 && v2<=0)
    return true;
  (v1>=0?p1:p2) = TVector2D::ProportionPosition(p1,v1,p2,v2);
  return true;
}
bool TViewRect::DoRectLine3D(int k,TPosition3D &p1,TPosition3D &p2) const
{
  TPosition2D q(Points[k]);
  TVector2D v(Points[(k+1)&3]-q);
  double v1(((const TPosition2D)p1-q)&v),v2(((const TPosition2D)p2-q)&v);
  if (v1>=0 && v2>=0)
    return false;
  if (v1<=0 && v2<=0)
    return true;
  (v1>=0?p1:p2) = TPosition3D::ProportionPosition(p1,v1,p2,v2);
  return true;
}
void TViewRect::SetRect(const TVector2D &size)
{
  Points[0] = TPosition2D();
  Points[1] = TPosition2D(size.X,0);
  Points[2] = size;
  Points[3] = TPosition2D(0,size.Y);
}
//---------------------------------------------------------------------------