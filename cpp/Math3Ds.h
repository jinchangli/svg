//---------------------------------------------------------------------------
#ifndef Math3DsH
#define Math3DsH
//---------------------------------------------------------------------------
class TVector2F;
class TVector3F;
class TVector2D;
class TVector3D;
class TTensor3D;
//---------------------------------------------------------------------------

//��ά����
//-----------------------------------------
class MATHBASES TVector2D
{
public:
  double X, Y; // ��������

public:
  TVector2D(); // ����0����:(0,0)
  TVector2D(double dir);  // ���쵥λ����:(cos,sin)
  TVector2D(double x, double y);
  TVector2D(const TVector2F &v);
  TVector2D(const TVector2D &v);

public:
  TVector2D& operator=(double dir);   // ��λ����
  TVector2D& operator*=(double d);    // ����
  TVector2D& operator/=(double d);    // ����
  TVector2D& operator%=(double angle);// ������ת:��ʱ��[0-2*pi)

public:
  TVector2D& operator=(const TVector2F &v);
  TVector2D& operator+=(const TVector2F &v); // �����͡�������
  TVector2D& operator-=(const TVector2F &v); // �����������

public:
  TVector2D& operator=(const TVector2D &v);
  TVector2D& operator+=(const TVector2D &v); // �����͡�������
  TVector2D& operator-=(const TVector2D &v); // �����������

public:
  TVector2D& operator%=(const TVector2D &v); // ������
  TVector2D& operator/=(const TVector2D &v); // ������

public:
  double operator~() const; // ��������
  double operator!() const; // ������λ��, ��X������ʱ�뷽��(-Pi,Pi]

public:
  const TVector2D operator-() const;  // ��������
  const TVector2D operator*() const;  // ��������

public:
  const TVector2D operator*(double d) const;    // ��������
  const TVector2D operator/(double d) const;    // ��������
  const TVector2D operator%(double angle) const;// ������ת

public:
  const TVector2D operator+(const TVector2F &v) const; // �����͡�������
  const TVector2D operator-(const TVector2F &v) const; // �����������

public:
  const TVector2D operator+(const TVector2D &v) const; // �����͡�������
  const TVector2D operator-(const TVector2D &v) const; // �����������

public:
  double operator*(const TVector2D &v) const;   // �����ڻ�
  double operator&(const TVector2D &v) const;   // �������

public:
  const TVector2D operator%(const TVector2D &v) const; // ������
  const TVector2D operator/(const TVector2D &v) const; // ������

public:
  bool operator==(const TVector2D &v) const; // �������
  bool operator!=(const TVector2D &v) const; // ��������

public:
  bool IsZeroXY() const;  // �ж��Ƿ�0���� 
  double AbsXY() const;   // �������ȣ�����ģ
  double AbsXY2() const;  // ��������ƽ��������ģƽ��
  double ArgXY() const;   // ��������[0,2PI)
  const TVector2D SgnXY() const;  // ��λ����
  const TVector2D LPerpXY() const;// ��(��ʱ��)��ת90��
  const TVector2D RPerpXY() const;// ��(˳ʱ��)��ת90��

public:// ��������
  static const TVector2D Add(const TVector2D &v1, const TVector2D &v2);
  static const TVector2D Sub(const TVector2D &v1, const TVector2D &v2);

public:
  static double MulDot(const TVector2D &v1, const TVector2D &v2);
  static double MulCrs(const TVector2D &v1, const TVector2D &v2);
  static const TVector2D Mul(const TVector2D &v1, const TVector2D &v2);

public:// ��������
  static const TVector2D& MinByX(const TVector2D &v1, const TVector2D &v2);
  static const TVector2D& MaxByX(const TVector2D &v1, const TVector2D &v2);

  static const TVector2D& MinByY(const TVector2D &v1, const TVector2D &v2);
  static const TVector2D& MaxByY(const TVector2D &v1, const TVector2D &v2);

  static const TVector2D& MinByLength(const TVector2D &v1, const TVector2D &v2);
  static const TVector2D& MinByLength(const TVector2D &v1, const TVector2D &v2, const TVector2D &v3);

  static const TVector2D& MaxByLength(const TVector2D &v1, const TVector2D &v2);
  static const TVector2D& MaxByLength(const TVector2D &v1, const TVector2D &v2, const TVector2D &v3);

public://���ȷֵ�:
  static const TVector2D ProportionPosition(const TVector2D &p1, const TVector2D &p2, double s); //s = p1p:p1p2
  static const TVector2D ProportionPosition(const TVector2D &p1, double s1, const TVector2D &p2, double s2); //s1:s2 = pp1:pp2

public:// ��������任
  static const TVector2D RST_To_XY(const TVector3D &rst/*��������(rst)*/, const TVector2D &p1, const TVector2D &p2, const TVector2D &p3);
  static  bool XY_To_RST(const TVector2D &p/*ֱ������*/, const TVector2D &p1, const TVector2D &p2, const TVector2D &p3, TVector3D &rst/*��������(rst)*/);

public:// ˫��������任
  static const TVector2D ST_To_XY(const TVector2D &st/*˫��������(st)*/, const TVector2D &p0, const TVector2D &px, const TVector2D &py, const TVector2D &pxy);
  static void DST_To_XY(const TVector2D &st/*˫��������(st)*/, const TVector2D &p0, const TVector2D &px, const TVector2D &py, const TVector2D &pxy, TVector2D &ds, TVector2D &dt, TVector2D &dst);
  static bool XY_To_ST(const TVector2D &p, const TVector2D &p0, const TVector2D &px, const TVector2D &py, const TVector2D &pxy, TVector2D &st/*˫��������(st)*/);

public://�㵽�߶εľ���
  static double GetDistanceOfPointToLine(const TVector2D &p, const TVector2D &p1, const TVector2D &p2);
  static int GetDistanceOfPointToLine(const TVector2D &p, const TVector2D &p1, const TVector2D &p2, double &distance);
  static double GetDistanceOfPointAtLine(const TVector2D &p, const TVector2D &p1, const TVector2D &p2, double &distance);

public://�㵽�����εľ���
  static double GetDistanceOfPointToTri(const TVector2D &p, const TVector2D &p1, const TVector2D &p2, const TVector2D &p3);

public://�߶��󽻵�
  static bool LineIntersect(const TVector2D &p0, const TVector2D &p1, const TVector2D &q0, const TVector2D &q1);
  static bool LineIntersect(const TVector2D &p0, const TVector2D &p1, const TVector2D &q0, const TVector2D &q1, TVector2D &pq);

public://��������
  static int TriIntersect(const TVector2D &p1, const TVector2D &p2, const TVector2D &p3, const TVector2D &q1, const TVector2D &q2, const TVector2D &q3, TVector2D polygon[]);
  static double TriCommonArea(const TVector2D &p1, const TVector2D &p2, const TVector2D &p3, const TVector2D &q1, const TVector2D &q2, const TVector2D &q3);

public://�ı�����
  static bool PointInQuad(const TVector2D &p, const TVector2D &q1, const TVector2D &q2, const TVector2D &q3, const TVector2D &q4);

public://�ı�����
  static bool PointInPolygon(const TVector2D &p, const int nps, const TVector2D ps[]);
};
//--------------------------------------------
typedef TVector2D TPosition2D; // 2D��

TEMPLATE_CLASS_MATHBASES1(TArrFix,TVector2D,TVector2Ds)      // 2Dʸ���̶���
TEMPLATE_CLASS_MATHBASES1(TArrMax,TVector2D,TVector2DsMax)   // 2Dʸ����̶���
TEMPLATE_CLASS_MATHBASES1(TArrStk,TVector2D,TVector2DsStk)   // 2Dʸ��������
TEMPLATE_CLASS_MATHBASES1(TArrQue,TVector2D,TVector2DsQue)   // 2Dʸ������
TEMPLATE_CLASS_MATHBASES1(TListStk,TPosition2D,TPosition2DsList) // ������
TEMPLATE_CLASS_MATHBASES1(TArrFix,TVector2Ds,TVector2Dses)    // 2Dʸ�����̶���
TEMPLATE_CLASS_MATHBASES1(TArrStk,TVector2Ds,TVector2DsesStk) // 2Dʸ����������

typedef TVector2Ds TPosition2Ds; // 2D��̶���
typedef TVector2DsMax TPosition2DsMax; // 2D���̶���
typedef TVector2DsStk TPosition2DsStk; // 2D��������
typedef TVector2DsQue TPosition2DsQue; // 2D�����
typedef TVector2Dses TPosition2Dses;        // 2D�㼯�̶���
typedef TVector2DsesStk TPosition2DsesStk;  // 2D�㼯������

TEMPLATE_CLASS_MATHBASES2(TSimplePair,TPosition2D,TPosition2D,TPosition2D2) // 2D���
TEMPLATE_CLASS_MATHBASES1(TArrFix,TPosition2D2,TPosition2D2s)      // 2D��Թ̶���
TEMPLATE_CLASS_MATHBASES1(TArrStk,TPosition2D2,TPosition2D2sStk) // 2D���������

TEMPLATE_CLASS_MATHBASES1(TArrFix,TPosition2Ds,TPosition2Dses);
TEMPLATE_CLASS_MATHBASES1(TArrStk,TPosition2Ds,TPosition2DsesStk);
//------------------------------------------
MATHBASES bool IsZero(const TVector2D &v); // 0����?

MATHBASES double Abs(const TVector2D &v); // 2D�����ĳ���
MATHBASES double Abs2(const TVector2D &v); // 2D�����ĳ���
MATHBASES double Arg(const TVector2D &v); // 2D�����ķ�λ��[0,2Pi)
MATHBASES const TVector2D Sgn(const TVector2D &v); // 2D�����ĵ�λ����

MATHBASES double Det2D(const TVector2D &v1,const TVector2D &v2); // 2D����������ʽ
MATHBASES double Det2D(const TVector2D &v1,const TVector2D &v2,const TVector2D &v3); // 2D����������ʽ
MATHBASES double Angle2D(const TVector2D &v1,const TVector2D &v2);   // �����н�
MATHBASES double Area2D(const TPosition2D &p1,const TPosition2D &p2,const TPosition2D &p3); // ���������

MATHBASES const TPosition2D PolarToPosition2D(double rho, double phi=0.0); // ������-->��

//---------------------------------------------------------------------------
//��άʸ��
//------------------------------------------
class MATHBASES TVector3D : public TVector2D
{
public:
  double Z; //����ά����

public:
  TVector3D(); // ����0ʸ��
  TVector3D(const TVector3F &v);
  TVector3D(const TVector3D &v);
  TVector3D(double x, double y, double z=0.0);
  TVector3D(const TVector2F &v, float z=0.0f);
  TVector3D(const TVector2D &v, double z=0.0);

public:
  TVector3D& operator*=(double d); // ʸ������
  TVector3D& operator/=(double d); // ʸ������
  TVector3D& operator*=(const TTensor3D &t); // ���������

public:
  TVector3D& operator=(const TVector2F &v);
  TVector3D& operator=(const TVector2D &v);

public:
  TVector3D& operator=(const TVector3F &v);
  TVector3D& operator+=(const TVector3F &v); // ʸ����
  TVector3D& operator-=(const TVector3F &v); // ʸ����

public:
  TVector3D& operator=(const TVector3D &v);
  TVector3D& operator+=(const TVector3D &v); // ʸ����                        
  TVector3D& operator-=(const TVector3D &v); // ʸ����
  TVector3D& operator&=(const TVector3D &v); // ʸ��ʸ��
  TVector3D& operator%=(const TVector3D &v); // ʸ����v��ʱ����ת~v����
  TVector3D& operator/=(const TVector3D &v); 

public:
  double operator~() const;           // ʸ������

public:
  const TVector3D operator-() const;  // ����ʸ��
  const TVector3D operator*() const;  // Z��������

public:
  const TVector3D operator+(const TVector3F &v) const; // ʸ����
  const TVector3D operator-(const TVector3F &v) const; // ʸ����

  const TVector3D operator+(const TVector3D &v) const; // ʸ����
  const TVector3D operator-(const TVector3D &v) const; // ʸ����

public:
  const TVector3D operator*(double d) const;    // ʸ������
  const TVector3D operator/(double d) const;    // ʸ������

public:
  double operator*(const TVector3D &v) const;   // ʸ���ڻ�
  const TVector3D operator*(const TTensor3D &t) const;
  const TVector3D operator&(const TVector3D &v) const; // ʸ��ʸ��
  const TVector3D operator%(const TVector3D &v) const; // ʸ����ת
  const TVector3D operator/(const TVector3D &v) const; // ʸ������

public:
  bool operator==(const TVector3D &v) const; // ʸ�����
  bool operator!=(const TVector3D &v) const; // ʸ������

public:
  static const TVector3D Normal(const TVector3D &p1,
    const TVector3D &p2, const TVector3D &p3);
  static const TVector3D Normal(const TVector3D &p1,
    const TVector3D &p2, const TVector3D &p3, const TVector3D &p4);

public:
  TVector2D& XY();                  // ��ά����
  const TVector2D& XY() const;      // ��ά����
  TVector2D& XY(const TVector2D &v);// ��ά����

public:
  bool IsZeroXYZ() const;         // �ж��Ƿ�0ʸ��
  double AbsXYZ() const;          // ʸ������
  double AbsXYZ2() const;         // ʸ������ƽ��
  double ArgZ() const;            // ���[-PI/2,PI/2]
  const TVector3D SgnXYZ() const; // ��λʸ��
  const TVector3D PerpYZ() const; // YZ������ת90��
  const TVector3D PerpZX() const; // ZX������ת90��

public:
  static const TVector3D Add(const TVector3D &v1, const TVector3D &v2);
  static const TVector3D Sub(const TVector3D &v1, const TVector3D &v2);

public:
  static double MulDot(const TVector3D &v1, const TVector3D &v2);
  static const TVector3D MulCrs(const TVector3D &v1, const TVector3D &v2);
  static double Mul(const TVector3D &v1, const TVector3D &v2, const TVector3D &v3);

public:  
  static const TVector3D& MinByX(const TVector3D &v1, const TVector3D &v2);
  static const TVector3D& MaxByX(const TVector3D &v1, const TVector3D &v2);

  static const TVector3D& MinByY(const TVector3D &v1, const TVector3D &v2);
  static const TVector3D& MaxByY(const TVector3D &v1, const TVector3D &v2);

  static const TVector3D& MinByZ(const TVector3D &v1, const TVector3D &v2);
  static const TVector3D& MaxByZ(const TVector3D &v1, const TVector3D &v2);

  static const TVector3D& MinByLength(const TVector3D &v1, const TVector3D &v2);
  static const TVector3D& MinByLength(const TVector3D &v1, const TVector3D &v2, const TVector3D &v3);

  static const TVector3D& MaxByLength(const TVector3D &v1, const TVector3D &v2);
  static const TVector3D& MaxByLength(const TVector3D &v1, const TVector3D &v2, const TVector3D &v3);

public:// ��������������任
  static const TVector3D RST_To_XYZ(const TVector3D &rst/*��������*/, const TVector3D &p1, const TVector3D &p2, const TVector3D &p3);
  static bool XYZ_To_RST(const TVector3D &p/*ֱ������*/, const TVector3D &p1, const TVector3D &p2, const TVector3D &p3, TVector3D &rst/*��������*/);

public:// ˫���Ա任
  static const TVector3D ST_To_XYZ(const TVector2D &st/*˫��������(st)*/, const TVector3D &p0, const TVector3D &px, const TVector3D &py, const TVector3D &pxy);// �ı��ε�
  static void DST_To_XYZ(const TVector2D &st/*˫��������(st)*/,
    const TVector3D &p0, const TVector3D &px, const TVector3D &py, const TVector3D &pxy,// �ı��ε�
    TVector3D &ds, TVector3D &dt, TVector3D &dst);
  static bool XYZ_To_ST(const TVector3D &xyz/*ֱ������*/, const TVector3D &p0,
    const TVector3D &px, const TVector3D &py, const TVector3D &pxy, TVector2D &st/*˫��������(st)*/);

public:// �����Ա任
  static const TVector3D RST_To_XYZ(const TVector3D &rst/*˫��������*/,
    const TVector3D &p0, const TVector3D &px, const TVector3D &py, const TVector3D &pxy,
    const TVector3D &pz, const TVector3D &pxz, const TVector3D &pyz, const TVector3D &pxyz);// �������
  static const TVector3D RST_To_XYZ(const TVector3D &rst/*˫��������*/,
    const TVector3D &p0, const TVector3D &px, const TVector3D &py, const TVector3D &pxy,
    const TVector3D &pz, const TVector3D &pxz, const TVector3D &pyz, const TVector3D &pxyz,// �������
    TVector3D &dr, TVector3D &ds, TVector3D &dt);
  static const TVector3D RST_To_XYZ(const TVector3D &rst/*˫��������*/,
    const TVector3D &p0, const TVector3D &px, const TVector3D &py, const TVector3D &pxy,
    const TVector3D &pz, const TVector3D &pxz, const TVector3D &pyz, const TVector3D &pxyz,// �������
    TVector3D &dr, TVector3D &ds, TVector3D &dt, TVector3D &drs, TVector3D &dst, TVector3D &dtr, TVector3D &drst);
  static bool XYZ_To_RST(const TVector3D &xyz/*ֱ������*/, const TVector3D &p0,
    const TVector3D &px, const TVector3D &py, const TVector3D &pxy, const TVector3D &pz,
    const TVector3D &pxz, const TVector3D &pyz, const TVector3D &pxyz, TVector3D &rst/*����������(st)*/);

public://���ȷֵ�
  static const TVector3D ProportionPosition(const TVector3D &p1, const TVector3D &p2, double s); // s = p1p:p1p2
  static const TVector3D ProportionPosition(const TVector3D &p1, double s1, const TVector3D &p2, double s2); // pp1:pp2=s1:s2

public://�㵽�߶εľ���
  static double GetDistanceOfPointToLine(
    const TVector3D &p, const TVector3D &p1, const TVector3D &p2);
  static int GetDistanceOfPointToLine(
    const TVector3D &p, const TVector3D &p1, const TVector3D &p2, double &distance);

public://�㵽�����εľ���
  static double GetDistanceOfPointToTri(const TVector3D &p,
    const TVector3D &p1, const TVector3D &p2, const TVector3D &p3);

public://��ά�߶��и���ά�߶�
  static bool LineIntersect3D(const TVector2D &cutlinestart, const TVector2D &cutlineend,
    const TVector3D &linestart, const TVector3D &lineend, TVector3D &cutpoint);

public://���������ཻ
  static bool LineIntersectWithTri(const TVector3D &p1, const TVector3D &p2,
    const TVector3D &q1, const TVector3D &q2, const TVector3D &q3, TVector3D &p);
  static bool LineIntersectWithQuad(const TVector3D &p1, const TVector3D &p2,
    const TVector3D &q1, const TVector3D &q2, const TVector3D &q3, const TVector3D &q4, TVector3D &p);

public:// �ֲ������
  static void GetOxyzByNearest(TVector3D &vx,TVector3D &vy,TVector3D &vz);
  static bool GetOxyzByVx(TVector3D &vx,TVector3D &vy,TVector3D &vz);
  static bool GetOxyzByVy(TVector3D &vx,TVector3D &vy,TVector3D &vz);
  static bool GetOxyzByVz(TVector3D &vx,TVector3D &vy,TVector3D &vz);
};

//---------------------------------------------------------------------------

typedef TVector3D TPosition3D; // 3D��

TEMPLATE_CLASS_MATHBASES1(TArrFix,TVector3D,TVector3Ds)      // 3Dʸ���̶���
TEMPLATE_CLASS_MATHBASES1(TArrMax,TVector3D,TVector3DsMax)   // 3Dʸ���붨��
TEMPLATE_CLASS_MATHBASES1(TArrStk,TVector3D,TVector3DsStk)   // 3Dʸ��������
TEMPLATE_CLASS_MATHBASES1(TArrQue,TVector3D,TVector3DsQue)   // 3Dʸ������
TEMPLATE_CLASS_MATHBASES1(TListStk,TPosition3D,TPosition3DsList) // ������

typedef TVector3Ds TPosition3Ds;       // 3D��̶���
typedef TVector3DsMax TPosition3DsMax; // 3D��붨��
typedef TVector3DsStk TPosition3DsStk; // 3D��������
typedef TVector3DsQue TPosition3DsQue; // 3D�����

TEMPLATE_CLASS_MATHBASES2(TSimplePair,TPosition3D,TVector2D,TPosition3DNormal2D) // 3D�㷨��
TEMPLATE_CLASS_MATHBASES1(TArrFix,TPosition3DNormal2D,TPosition3DNormal2Ds)   // 3D�㷨�߹̶���
TEMPLATE_CLASS_MATHBASES1(TArrStk,TPosition3DNormal2D,TPosition3DNormal2DsStk)   // 3D�㷨��������

TEMPLATE_CLASS_MATHBASES2(TSimplePair,TPosition3D,TVector3D,TPosition3DNormal3D) // 3D�㷨��
TEMPLATE_CLASS_MATHBASES1(TArrFix,TPosition3DNormal3D,TPosition3DNormal3Ds) // 3D�㷨�߹̶���
TEMPLATE_CLASS_MATHBASES1(TArrStk,TPosition3DNormal3D,TPosition3DNormal3DsStk) // 3D�㷨��������

TEMPLATE_CLASS_MATHBASES2(TSimplePair,TPosition3D,TPosition3D,TPosition3D2) // 3D���
TEMPLATE_CLASS_MATHBASES1(TArrFix,TPosition3D2,TPosition3D2s)    // 3D��Թ̶���
TEMPLATE_CLASS_MATHBASES1(TArrStk,TPosition3D2,TPosition3D2sStk) // 3D���������

TEMPLATE_CLASS_MATHBASES1(TArrFix,TPosition3Ds,TPosition3Dses);
TEMPLATE_CLASS_MATHBASES1(TArrStk,TPosition3Ds,TPosition3DsesStk);
//---------------------------------------------------------------------------

MATHBASES double Abs(const TVector3D &v); // 3D�����ĳ���
MATHBASES double Abs2(const TVector3D &v); // 3D�����ĳ���

MATHBASES bool IsZero(const TVector3D &v); // 0����?
MATHBASES const TVector3D Sgn(const TVector3D &v); // 3D�����ĵ�λ����

MATHBASES const TVector3D Angle3D(const TVector3D &v1,const TVector3D &v2);   // 3D�����н�
MATHBASES const TVector3D Area3D(const TPosition3D &p1,const TPosition3D &p2,const TPosition3D &p3); // ���������
MATHBASES double Volumn(const TPosition3D &p1,const TPosition3D &p2,const TPosition3D &p3,const TPosition3D &p4); // ���������

MATHBASES double Det3D(const TVector3D &v1,const TVector3D &v2,const TVector3D &v3); // 3D����������ʽ
MATHBASES double DetXY(const TVector3D &v1,const TVector3D &v2,const TVector3D &v3); // 3D����������ʽ
MATHBASES double DetYZ(const TVector3D &v1,const TVector3D &v2,const TVector3D &v3); // 3D����������ʽ
MATHBASES double DetZX(const TVector3D &v1,const TVector3D &v2,const TVector3D &v3); // 3D����������ʽ

//---------------------------------------------------------------------------
// 2D������
//---------------------------------------------------------------------------
class MATHBASES TVector2DValue : public TVector2D
{
public:
  float Value;

public:
  TVector2DValue();
  TVector2DValue(const TVector2D &p, float value=0.0);
  TVector2DValue(double x, double y, float value=0.0);

public:
  TVector2DValue& operator=(const TVector2DValue &p);
  TVector2DValue& operator=(const TVector2D &p);
};
typedef TVector2DValue TPosition2DValue;

TEMPLATE_CLASS_MATHBASES1(TArrFix,TVector2DValue,TVector2DValues)
TEMPLATE_CLASS_MATHBASES1(TArrStk,TVector2DValue,TVector2DValuesStk)
TEMPLATE_CLASS_MATHBASES1(TArray,TVector2DValue,TVector2DValuesBase)
TEMPLATE_CLASS_MATHBASES1(TArrayFixed,TVector2DValue,TVector2DValuesFixed)
TEMPLATE_CLASS_MATHBASES1(TArrayStack,TVector2DValue,TVector2DValuesStack)
typedef TVector2DValues TPosition2DValues;
typedef TVector2DValuesStk TPosition2DValuesStk;
typedef TVector2DValuesBase TPosition2DValuesBase;
typedef TVector2DValuesFixed TPosition2DValuesFixed;
typedef TVector2DValuesStack TPosition2DValuesStack;

//---------------------------------------------------------------------------
// 3D������
//---------------------------------------------------------------------------
class MATHBASES TVector3DValue : public TVector3D
{
public:
  float Value;

public:
  TVector3DValue();
  TVector3DValue(const TVector3D &p, float value=0);
  TVector3DValue(double x, double y, double z=0, float value=0);

public:
  TVector3DValue& operator=(const TVector3DValue &p);
  TVector3DValue& operator=(const TVector3D &p);
};
typedef TVector3DValue TPosition3DValue;

TEMPLATE_CLASS_MATHBASES1(TArrFix,TVector3DValue,TVector3DValues)
TEMPLATE_CLASS_MATHBASES1(TArrStk,TVector3DValue,TVector3DValuesStk)
TEMPLATE_CLASS_MATHBASES1(TArray,TVector3DValue,TVector3DValuesBase)
TEMPLATE_CLASS_MATHBASES1(TArrayFixed,TVector3DValue,TVector3DValuesFixed)
TEMPLATE_CLASS_MATHBASES1(TArrayStack,TVector3DValue,TVector3DValuesStack)
typedef TVector3DValues TPosition3DValues;
typedef TVector3DValuesStk TPosition3DValuesStk;
typedef TVector3DValuesBase TPosition3DValuesBase;
typedef TVector3DValuesFixed TPosition3DValuesFixed;
typedef TVector3DValuesStack TPosition3DValuesStack;

//---------------------------------------------------------------------------

struct MATHBASES TComparePositionByX
{
  bool operator()(const TPosition2D &p1,const TPosition2D &p2) const;
};

struct MATHBASES TComparePositionByY
{
  bool operator()(const TPosition2D &p1,const TPosition2D &p2) const;
};

struct MATHBASES TComparePositionByZ
{
  bool operator()(const TPosition3D &p1,const TPosition3D &p2) const;
};

struct MATHBASES TFComparePositionByX
{
  float operator()(const TPosition2D &p1,const TPosition2D &p2) const;
};

struct MATHBASES TFComparePositionByY
{
  float operator()(const TPosition2D &p1,const TPosition2D &p2) const;
};

struct MATHBASES TFComparePositionByZ
{
  float operator()(const TPosition3D &p1,const TPosition3D &p2) const;
};

//---------------------------------------------------------------------------
// ��άʸ��
//---------------------------------------------------------------------------
class MATHBASES TVector4D : public TVector3D
{
public:
  double W;

public:
  TVector4D();
  TVector4D(double x, double y, double z=0, double w=0);
  TVector4D(const TVector2D &v, double z=0, double w=0);
  TVector4D(const TVector3D &v, double w=0);

public:
  TVector4D& operator=(const TVector2D &v);
  TVector4D& operator=(const TVector3D &v);
  TVector4D& operator=(const TVector4D &v);
  TVector4D& operator+=(const TVector4D &v);
  TVector4D& operator-=(const TVector4D &v);
  TVector4D& operator*=(double d); // ʸ������
  TVector4D& operator/=(double d); // ʸ������

public:
  double operator~() const;
  const TVector4D& operator+() const;
  const TVector4D operator-() const;
  const TVector4D operator+(const TVector4D &v) const;
  const TVector4D operator-(const TVector4D &v) const;
  const TVector4D operator*(double d) const; // ʸ������
  const TVector4D operator/(double d) const; // ʸ������

public:  
  double operator*(const TVector4D &v) const;
  bool operator==(const TVector4D &v) const;
  bool operator!=(const TVector4D &v) const;

public:  
  bool IsZeroXYZW() const;
  double AbsXYZW() const;
  double AbsXYZW2() const;
};
TEMPLATE_CLASS_MATHBASES1(TArrFix,TVector4D,TVector4Ds)
TEMPLATE_CLASS_MATHBASES1(TArrStk,TVector4D,TVector4DsStk)
typedef TVector4D TPosition4D;
typedef TVector4Ds TPosition4Ds;
typedef TVector4DsStk TPosition4DsStk;
//---------------------------------------------------------------------------
#endif