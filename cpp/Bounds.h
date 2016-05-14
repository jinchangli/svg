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
//һά����
class CGMBASES TInterval1D
{
public:
  double Min, Max;   //��������
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
  double Center() const;    // ��������
  double Size() const;      // �ߴ�
  void Scale(double scale); // ��������
};
//---------------------------------------------------------------------------
/*
  1�����ñ߽�����ǰһ����Ҫʹ��Clear������ձ߽����ݡ�
  2��ʹ�ñ߽�����ǰһ����Ҫʹ��Valid�����жϱ߽����ݵ���Ч�ԡ����������Ч������ʹ
��Min��Max������ֵ�����ܻ���Ҫʹ��Size()�����ж�����Ƿ�Ϊ0��
*/
//��ά����߽�
class CGMBASES TBound1D
{
private:
  TInterval1D FInterval;
  int FIndexMin,FIndexMax;
  bool FValid; //��Ч��־
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
  void Clear();                           // ����߽�����
  void SetBound(const TBound1D &bds);     // ���ñ߽�
  void SetBound(double pos,int index=0);  // ���ñ߽�
  bool InBound(double pos) const;         // ���Ƿ�λ�ڱ߽���
public:  
  double Center() const;                  // ��������
  double Size() const;                    // �ߴ�
  void Scale(double scale);               // ��������
};
//----------------------------------------------------------------------------
//��ά�����
class CGMBASES TInterval2D
{
public:
  TPosition2D Min, Max;   //���¡���������
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
  const TPosition2D Center() const;// ��������
  const TPosition2D Size() const;  // �����ߴ�
  void Scale(double scale);     // ��������
  void Rotate(double angle);    // ������ת
};
//---------------------------------------------------------------------------
/*
  1�����ñ߽�����ǰһ����Ҫʹ��Clear������ձ߽����ݡ�
  2��ʹ�ñ߽�����ǰһ����Ҫʹ��Valid�����жϱ߽����ݵ���Ч�ԡ����������Ч������ʹ
��Min��Max������ֵ�����ܻ���Ҫʹ��Size()�����ж�����Ƿ�Ϊ0��
*/
//��ά����߽�
class CGMBASES TBound2D 
{
private:
  TInterval2D FInterval;
  bool FValid; //��Ч��־
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
  void Clear();                           // ����߽�����
  void SetBound(const TBound2D &bds);     // ���ñ߽�
  void SetBound(double x, double y);      // ���ñ߽�
  void SetBound(const TPosition2D &pos);     // ���ñ߽�
  void SetBounds(const TPosition2Ds &points); // ���ñ߽�
  template<typename TArr> void SetBounds(const TArr &points);
  bool InBound(const TPosition2D &pos) const;// ���Ƿ�λ�ڱ߽���
  
public:
  const TPosition2D Center() const; // ��������
  const TVector2D Size() const;   // �����ߴ�
  void Scale(double scale);      // ��������
  void Rotate(double angle);     // ������ת
	void GetCorners(TPosition2D corners[4]) const;
};
template<typename TArr>
void TBound2D::SetBounds(const TArr &points)
{
  for (int k=0,n=points.Count(); k<n; ++k)
    SetBound(points[k]);
}
//---------------------------------------------------------------------------
//��ά�����
class CGMBASES TInterval3D
{
public:
  TPosition3D Min, Max;   //���¡���������
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
  const TPosition3D Center() const;// ��������
  const TPosition3D Size() const;  // ����ߴ�
  void Scale(double scale);     // ��������
};
//---------------------------------------------------------------------------
/*
  1�����ñ߽�����ǰһ����Ҫʹ��Clear������ձ߽����ݡ�
  2��ʹ�ñ߽�����ǰһ����Ҫʹ��Valid�����жϱ߽����ݵ���Ч�ԡ����������Ч������ʹ
��Min��Max������ֵ�����ܻ���Ҫʹ��Size()�����ж�����Ƿ�Ϊ0��
*/
//��ά������߽�
class CGMBASES TBound3D
{
private:
  TInterval3D FInterval;
  bool FValid; //��Ч��־
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
  void Clear();  // ����߽�����
  void SetBound(const TBound3D &bds);                       // ���ñ߽�
  void SetBound(const TPosition3D &pos);                    // ���ñ߽�
  void SetBound(const TPosition2D &pos, double z);          // ���ñ߽�
  void SetBound(double x, double y, double z);              // ���ñ߽�
  void SetBounds(const TPosition2Ds &points,double z);  // ���ñ߽�
  void SetBounds(const TPosition3Ds &points);           // ���ñ߽�
  template<typename TArr> void SetBounds(const TArr &points,double z);
  template<typename TArr> void SetBounds(const TArr &points);
  bool InBound(const TPosition3D &pos) const;      // ���Ƿ�λ�ڱ߽���
public:
  const TPosition3D Center() const; // ��������
  const TVector3D Size() const;     // ����ߴ�
  void Scale(double scale);         // ��������
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
//��ά�����
class CGMBASES TInterval4D
{
public:
  TPosition4D Min, Max;   //���¡���������
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
  const TPosition4D Center() const;// ��������
  const TPosition4D Size() const;  // ����ߴ�
  void Scale(double scale); // ��������
};
//---------------------------------------------------------------------------
/*
  1�����ñ߽�����ǰһ����Ҫʹ��Clear������ձ߽����ݡ�
  2��ʹ�ñ߽�����ǰһ����Ҫʹ��Valid�����жϱ߽����ݵ���Ч�ԡ����������Ч������ʹ
��Min��Max������ֵ�����ܻ���Ҫʹ��Size()�����ж�����Ƿ�Ϊ0��
*/
//��ά������߽�
class CGMBASES TBound4D
{
private:
  TInterval4D FInterval;
  bool FValid; //��Ч��־
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
  void Clear();  // ����߽�����
  void SetBound(const TBound4D &bds);                       // ���ñ߽�
  void SetBound(const TPosition4D &pos);                    // ���ñ߽�
  void SetBound(const TPosition3D &pos, double w);          // ���ñ߽�
  void SetBound(double x, double y, double z, double w);    // ���ñ߽�
  void SetBounds(const TPosition3Ds &points,double w);  // ���ñ߽�
  void SetBounds(const TPosition4Ds &points);           // ���ñ߽�
  template<typename TArr> void SetBounds(const TArr &points,double w);
  template<typename TArr> void SetBounds(const TArr &points);
  bool InBound(const TPosition4D &pos) const;      // ���Ƿ�λ�ڱ߽���
public:
  const TPosition4D Center() const; // ��������
  const TVector4D Size() const;     // ����ߴ�
  void Scale(double scale);         // ��������
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
// ��ͼ������
class CGMBASES TViewRect
{
public:
  TPosition2D Points[4]; //��ʱ������
public:
  void SetRect(const TVector2D &size); // ������ͼ����
  bool InRect(const TPosition2D &point) const; // ���Ƿ�λ�ھ�����
  bool RectLine(TPosition2D &p1, TPosition2D &p2) const;  // �����߶�,������ͼ�ڲ���
  bool RectLine3D(TPosition3D &p1, TPosition3D &p2) const;// �����߶�,������ͼ�ڲ���
protected:
  bool DoInRect(int k, const TPosition2D &point) const;
  bool DoRectLine(int k, TPosition2D &p1, TPosition2D &p2) const;
  bool DoRectLine3D(int k, TPosition3D &p1, TPosition3D &p2) const;
};
//---------------------------------------------------------------------------
#endif