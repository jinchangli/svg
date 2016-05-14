//---------------------------------------------------------------------------
#ifndef BoundsH
#define BoundsH
//----------------------------------------------------------------------------
class CGMBASES TMinMax
{
private:
  double FValue;
  int FIndex;
  bool FValid;                                        
public:
  TMinMax(void);
public:
  void Clear();                                                            
  bool Valid() const;
  double Value() const;
  int Index() const;
public:
  void SetMinValue(double v, int index);  
  void SetMaxValue(double v, int index);  
};
//----------------------------------------------------------------------------
//一维区间
class CGMBASES TInterval1D
{
public:
  double Min, Max;   //左、右坐标
public:
  TInterval1D();
  TInterval1D(double point1, double point2);
public:
  TInterval1D& operator+=(double v);
  TInterval1D& operator-=(double v);
  TInterval1D& operator*=(double d);
  TInterval1D& operator/=(double d);

  const TInterval1D operator-() const;
  const TInterval1D operator+(double v) const;
  const TInterval1D operator-(double v) const;
  const TInterval1D operator*(double d) const;
  const TInterval1D operator/(double d) const;

  bool operator==(const TInterval1D &interval) const;
  bool operator!=(const TInterval1D &interval) const;
  bool operator<(const TInterval1D &interval) const;
  bool operator<=(const TInterval1D &interval) const;
  bool operator>(const TInterval1D &interval) const;
  bool operator>=(const TInterval1D &interval) const;

public:
  double Center() const;    // 中心坐标
  double Size() const;      // 尺寸
  void Scale(double scale); // 中心缩放
};
//---------------------------------------------------------------------------
/*
  1、设置边界数据前一般先要使用Clear方法清空边界数据。
  2、使用边界数据前一般先要使用Valid属性判断边界数据的有效性。如果数据有效，即可使
用Min、Max变量的值。可能还需要使用Size()函数判断面积是否为0。
*/
//二维区间边界
class CGMBASES TBound1D
{
private:
  TInterval1D FInterval;
  int FIndexMin,FIndexMax;
  bool FValid; //有效标志
public:
  TBound1D();
  TBound1D(const TInterval1D &interval, bool valid);
public:
  TBound1D& operator+=(double v);
  TBound1D& operator-=(double v);
  TBound1D& operator*=(double d);
  TBound1D& operator/=(double d);

  const TBound1D operator-() const;
  const TBound1D operator+(double v) const;
  const TBound1D operator-(double v) const;
  const TBound1D operator*(double d) const;
  const TBound1D operator/(double d) const;

  bool operator==(const TBound1D &bds) const;
  bool operator!=(const TBound1D &bds) const;
  bool operator<(const TBound1D &bds) const;
  bool operator<=(const TBound1D &bds) const;
  bool operator>(const TBound1D &bds) const;
  bool operator>=(const TBound1D &bds) const;

public:
  bool Valid() const;
  const double& Min() const;
  const double& Max() const;
  int IMin() const;
  int IMax() const;  
public:
  void Clear();                           // 清除边界数据
  void SetBound(const TBound1D &bds);     // 设置边界
  void SetBound(double pos,int index=0);  // 设置边界
  bool InBound(double pos) const;         // 点是否位于边界内
public:  
  double Center() const;                  // 中心坐标
  double Size() const;                    // 尺寸
  void Scale(double scale);               // 中心缩放
};
//----------------------------------------------------------------------------
//二维区间框
class CGMBASES TInterval2D
{
public:
  TPosition2D Min, Max;   //左下、右上坐标
public:
  TInterval2D();
  TInterval2D(const TPosition2D &point1, const TPosition2D &point2);
public:
  TInterval2D& operator+=(const TVector2D &v);
  TInterval2D& operator-=(const TVector2D &v);
  TInterval2D& operator%=(const TVector2D &v);
  TInterval2D& operator*=(double d);
  TInterval2D& operator/=(double d);

  const TInterval2D operator-() const;
  const TInterval2D operator+(const TVector2D &v) const;
  const TInterval2D operator-(const TVector2D &v) const;
  const TInterval2D operator%(const TVector2D &v) const;
  const TInterval2D operator*(double d) const;
  const TInterval2D operator/(double d) const;

  bool operator==(const TInterval2D &interval) const;
  bool operator!=(const TInterval2D &interval) const;
  bool operator<(const TInterval2D &interval) const;
  bool operator<=(const TInterval2D &interval) const;
  bool operator>(const TInterval2D &interval) const;
  bool operator>=(const TInterval2D &interval) const;

public:
  const TPosition2D Center() const;// 中心坐标
  const TPosition2D Size() const;  // 区间框尺寸
  void Scale(double scale);     // 中心缩放
  void Rotate(double angle);    // 中心旋转
};
//---------------------------------------------------------------------------
/*
  1、设置边界数据前一般先要使用Clear方法清空边界数据。
  2、使用边界数据前一般先要使用Valid属性判断边界数据的有效性。如果数据有效，即可使
用Min、Max变量的值。可能还需要使用Size()函数判断面积是否为0。
*/
//二维区间边界
class CGMBASES TBound2D 
{
private:
  TInterval2D FInterval;
  bool FValid; //有效标志
public:
  TBound2D();
  TBound2D(const TInterval2D &interval, bool valid);
public:
  TBound2D& operator=(const TBound2D& bds);
  TBound2D& operator+=(const TVector2D &v);
  TBound2D& operator-=(const TVector2D &v);
  TBound2D& operator%=(const TVector2D &v);
  TBound2D& operator*=(double d);
  TBound2D& operator/=(double d);

  const TBound2D operator-() const;
  const TBound2D operator+(const TVector2D &v) const;
  const TBound2D operator-(const TVector2D &v) const;
  const TBound2D operator%(const TVector2D &v) const;
  const TBound2D operator*(double d) const;
  const TBound2D operator/(double d) const;

  bool operator==(const TBound2D &bds) const;
  bool operator!=(const TBound2D &bds) const;
  bool operator<(const TBound2D &bds) const;
  bool operator<=(const TBound2D &bds) const;
  bool operator>(const TBound2D &bds) const;
  bool operator>=(const TBound2D &bds) const;

public:
  bool Valid() const;
  const TPosition2D& Min() const;
  const TPosition2D& Max() const;
  const TInterval2D& Interval() const;
  
public:
  void Clear();                           // 清除边界数据
  void SetBound(const TBound2D &bds);     // 设置边界
  void SetBound(double x, double y);      // 设置边界
  void SetBound(const TPosition2D &pos);     // 设置边界
  void SetBounds(const TPosition2Ds &points); // 设置边界
  template<typename TArr> void SetBounds(const TArr &points);
  bool InBound(const TPosition2D &pos) const;// 点是否位于边界内
  
public:
  const TPosition2D Center() const; // 中心坐标
  const TVector2D Size() const;   // 区间框尺寸
  void Scale(double scale);      // 中心缩放
  void Rotate(double angle);     // 中心旋转
	void GetCorners(TPosition2D corners[4]) const;
};
template<typename TArr>
void TBound2D::SetBounds(const TArr &points)
{
  for (int k=0,n=points.Count(); k<n; ++k)
    SetBound(points[k]);
}
//---------------------------------------------------------------------------
//三维区间框
class CGMBASES TInterval3D
{
public:
  TPosition3D Min, Max;   //左下、右上坐标
public:
  TInterval3D();
  TInterval3D(const TPosition3D &point1, const TPosition3D &point2);
public:
  TInterval3D& operator+=(const TVector3D &v);
  TInterval3D& operator-=(const TVector3D &v);
  TInterval3D& operator&=(const TVector3D &v);
  TInterval3D& operator*=(double d);
  TInterval3D& operator/=(double d);
  const TInterval3D operator-() const;
  const TInterval3D operator+(const TVector3D &v) const;
  const TInterval3D operator-(const TVector3D &v) const;
  const TInterval3D operator&(const TVector3D &v) const;
  const TInterval3D operator*(double d) const;
  const TInterval3D operator/(double d) const;
  bool operator==(const TInterval3D &interval) const;
  bool operator!=(const TInterval3D &interval) const;
  bool operator<(const TInterval3D &interval) const;
  bool operator<=(const TInterval3D &interval) const;
  bool operator>(const TInterval3D &interval) const;
  bool operator>=(const TInterval3D &interval) const;
public:
  const TPosition3D Center() const;// 中心坐标
  const TPosition3D Size() const;  // 区间尺寸
  void Scale(double scale);     // 中心缩放
};
//---------------------------------------------------------------------------
/*
  1、设置边界数据前一般先要使用Clear方法清空边界数据。
  2、使用边界数据前一般先要使用Valid属性判断边界数据的有效性。如果数据有效，即可使
用Min、Max变量的值。可能还需要使用Size()函数判断体积是否为0。
*/
//三维长方体边界
class CGMBASES TBound3D
{
private:
  TInterval3D FInterval;
  bool FValid; //有效标志
public:
  TBound3D();
  TBound3D(const TInterval3D &interval, bool valid);
public:
  TBound3D& operator=(const TBound3D &bds);
  TBound3D& operator+=(const TVector3D &v);
  TBound3D& operator-=(const TVector3D &v);
  TBound3D& operator&=(const TVector3D &v);
  TBound3D& operator*=(double d);
  TBound3D& operator/=(double d);
  const TBound3D operator-() const;
  const TBound3D operator+(const TVector3D &v) const;
  const TBound3D operator-(const TVector3D &v) const;
  const TBound3D operator&(const TVector3D &v) const;
  const TBound3D operator*(double d) const;
  const TBound3D operator/(double d) const;
  bool operator==(const TBound3D &bds) const;
  bool operator!=(const TBound3D &bds) const;
  bool operator<(const TBound3D &bds) const;
  bool operator<=(const TBound3D &bds) const;
  bool operator>(const TBound3D &bds) const;
  bool operator>=(const TBound3D &bds) const;
public:
  bool Valid() const;
  const TPosition3D& Min() const;
  const TPosition3D& Max() const;
public:
  void Clear();  // 清除边界数据
  void SetBound(const TBound3D &bds);                       // 设置边界
  void SetBound(const TPosition3D &pos);                    // 设置边界
  void SetBound(const TPosition2D &pos, double z);          // 设置边界
  void SetBound(double x, double y, double z);              // 设置边界
  void SetBounds(const TPosition2Ds &points,double z);  // 设置边界
  void SetBounds(const TPosition3Ds &points);           // 设置边界
  template<typename TArr> void SetBounds(const TArr &points,double z);
  template<typename TArr> void SetBounds(const TArr &points);
  bool InBound(const TPosition3D &pos) const;      // 点是否位于边界内
public:
  const TPosition3D Center() const; // 中心坐标
  const TVector3D Size() const;     // 区间尺寸
  void Scale(double scale);         // 中心缩放
  void GetCorners(TPosition2D corners[4]) const;
};
template<typename TArr>
void TBound3D::SetBounds(const TArr &points,double z)
{
  for (int k=0,n=points.Count(); k<n; ++k)
    SetBound(points[k],z);
}
template<typename TArr>
void TBound3D::SetBounds(const TArr &points)
{
  for (int k=0,n=points.Count(); k<n; ++k)
    SetBound(points[k]);
}
//---------------------------------------------------------------------------
//三维区间框
class CGMBASES TInterval4D
{
public:
  TPosition4D Min, Max;   //左下、右上坐标
public:
  TInterval4D();
  TInterval4D(const TPosition4D &point1, const TPosition4D &point2);
public:
  TInterval4D& operator+=(const TVector4D &v);
  TInterval4D& operator-=(const TVector4D &v);
  TInterval4D& operator*=(double d);
  TInterval4D& operator/=(double d);
  const TInterval4D operator-() const;
  const TInterval4D operator+(const TVector4D &v) const;
  const TInterval4D operator-(const TVector4D &v) const;
  const TInterval4D operator*(double d) const;
  const TInterval4D operator/(double d) const;
  bool operator==(const TInterval4D &interval) const;
  bool operator!=(const TInterval4D &interval) const;
  bool operator<(const TInterval4D &interval) const;
  bool operator<=(const TInterval4D &interval) const;
  bool operator>(const TInterval4D &interval) const;
  bool operator>=(const TInterval4D &interval) const;
public:
  const TPosition4D Center() const;// 中心坐标
  const TPosition4D Size() const;  // 区间尺寸
  void Scale(double scale); // 中心缩放
};
//---------------------------------------------------------------------------
/*
  1、设置边界数据前一般先要使用Clear方法清空边界数据。
  2、使用边界数据前一般先要使用Valid属性判断边界数据的有效性。如果数据有效，即可使
用Min、Max变量的值。可能还需要使用Size()函数判断体积是否为0。
*/
//三维长方体边界
class CGMBASES TBound4D
{
private:
  TInterval4D FInterval;
  bool FValid; //有效标志
public:
  TBound4D();
  TBound4D(const TInterval4D &interval, bool valid);
public:
  TBound4D& operator=(const TBound4D &bds);
  TBound4D& operator+=(const TVector4D &v);
  TBound4D& operator-=(const TVector4D &v);
  TBound4D& operator*=(double d);
  TBound4D& operator/=(double d);
  const TBound4D operator-() const;
  const TBound4D operator+(const TVector4D &v) const;
  const TBound4D operator-(const TVector4D &v) const;
  const TBound4D operator*(double d) const;
  const TBound4D operator/(double d) const;
  bool operator==(const TBound4D &bds) const;
  bool operator!=(const TBound4D &bds) const;
  bool operator<(const TBound4D &bds) const;
  bool operator<=(const TBound4D &bds) const;
  bool operator>(const TBound4D &bds) const;
  bool operator>=(const TBound4D &bds) const;
public:
  bool Valid() const;
  const TPosition4D& Min() const;
  const TPosition4D& Max() const;
public:
  void Clear();  // 清除边界数据
  void SetBound(const TBound4D &bds);                       // 设置边界
  void SetBound(const TPosition4D &pos);                    // 设置边界
  void SetBound(const TPosition3D &pos, double w);          // 设置边界
  void SetBound(double x, double y, double z, double w);    // 设置边界
  void SetBounds(const TPosition3Ds &points,double w);  // 设置边界
  void SetBounds(const TPosition4Ds &points);           // 设置边界
  template<typename TArr> void SetBounds(const TArr &points,double w);
  template<typename TArr> void SetBounds(const TArr &points);
  bool InBound(const TPosition4D &pos) const;      // 点是否位于边界内
public:
  const TPosition4D Center() const; // 中心坐标
  const TVector4D Size() const;     // 区间尺寸
  void Scale(double scale);         // 中心缩放
};
template<typename TArr>
void TBound4D::SetBounds(const TArr &points,double w)
{
  for (int k=0,n=points.Count(); k<n; ++k)
    SetBound(points[k],w);
}
template<typename TArr>
void TBound4D::SetBounds(const TArr &points)
{
  for (int k=0,n=points.Count(); k<n; ++k)
    SetBound(points[k]);
}
//---------------------------------------------------------------------------
// 视图矩形类
class CGMBASES TViewRect
{
public:
  TPosition2D Points[4]; //逆时针排列
public:
  void SetRect(const TVector2D &size); // 设置视图矩形
  bool InRect(const TPosition2D &point) const; // 点是否位于矩形内
  bool RectLine(TPosition2D &p1, TPosition2D &p2) const;  // 剪裁线段,返回视图内部分
  bool RectLine3D(TPosition3D &p1, TPosition3D &p2) const;// 剪裁线段,返回视图内部分
protected:
  bool DoInRect(int k, const TPosition2D &point) const;
  bool DoRectLine(int k, TPosition2D &p1, TPosition2D &p2) const;
  bool DoRectLine3D(int k, TPosition3D &p1, TPosition3D &p2) const;
};
//---------------------------------------------------------------------------
#endif