//---------------------------------------------------------------------------
//OpenGL������
//------------------------------------------------------------------------------
class GLBASES TGLBase
{
  friend class TGL2DBase;
  friend class TGDI2DForView;
private:
  RECT FRect;                       //��������
  RECT FViewRect;                   //��������
  TPosition2D FViewCenter;          //��ͼ����
  TPosition2D FCenter;              //��ͼ����
  TVector2D FViewResolution;        //��ͼ�ֱ���
  TVector2D FDViewCenter;
  TVector2D FStdToView;
  double FMaxZoom, FMinZoom, FLODScale0;
  //unsigned int FViewFlags;

public:
//  int Tag;

public:
  TGLBase();
  virtual ~TGLBase();

public:
  HDC DC() const;
  void UseGL(HDC dc) const;                 //ʹ��OpenGL��Ⱦ����, NULL��ʾ��ʹ��.

public:
  const RECT& Rect() const;             //��ͼ��Χ
  void Rect(const RECT &rect);
  const TVector2D Size() const;         //��ͼ�ߴ�
  const RECT& ViewRect() const;                   //��ͼ��Χ
  void ViewRect(const RECT &viewrect);
  const TVector2D ViewSize() const;     //��ͼ�ߴ�
  const TPosition2D& ViewCenter() const;          //��ͼ����
  const TVector2D& ViewResolution() const;        //��ͼ���طֱ���(������/��)
  void ViewResolution(const TVector2D &view_resolution);
  const TVector2D ViewResolutionDPI() const; //��ͼ���طֱ���(������/Ӣ��)
  void ViewResolutionDPI(const TVector2D &dpi);
  bool PositionFixed() const;   //�̶�λ��, �����ƶ�
  void PositionFixed(bool fixed);
  bool ScaleFixed() const;      //�̶�����, ��������
  void ScaleFixed(bool fixed);
  bool DirectionFixed() const;  //�̶�����, ������ת
  void DirectionFixed(bool fixed);
  bool MovingLimit() const;     //��������
  void MovingLimit(bool limit);
  bool AutoBasePosition() const;
  void AutoBasePosition(bool flag);
  double MinZoom() const;       //��������
  void MinZoom(double min_zoom);
  double MaxZoom() const;       //��������
  void MaxZoom(double max_zoom);
  
public:
  const POINT ViewToScreen(const TPosition2D &point2d) const;//����任:��ͼ-->��Ļ
  const TPosition2D ScreenToView(const POINT &point) const;  //����任:��Ļ-->��ͼ
  const TVector2D View_MeterToPixel(const TVector2D &meters) const;   //��ͼ��λ�任: ��-->����
  const TVector2D View_PixelToMeter(const TVector2D &pixels) const;   //��ͼ��λ�任: ����-->��

  //��ʾ��(TrueType)�����ı�
  void GLString(const TPosition2D &position, const char *text, float font_width, float font_height, int align=0, float direction=0, const char *font_name="����") const;
  void GLString(const TPosition2D &position, const char *text, const TVector2D &direction_width, const TVector2D &direction_height, int align=0, const char *font_name="����") const;

  void GLString(const TPosition3D &position, const char *text, float font_width, float font_height, int align=0, float direction=0, const char *font_name="����") const;
  void GLString(const TPosition3D &position, const char *text, const TVector3D &direction_width, const TVector3D &direction_height, float thickness=1, int align=0, const char *font_name="����") const;

  //���Ʊ���
  void GLBlank(const TPosition2D &position, const char *text, float font_width, float font_height, int align=0, float direction=0) const;
  void GLBlank(const TPosition2D &position, const char *text, const TVector2D &direction_width, const TVector2D &direction_height, int align=0) const;
  void GLBlank(const TPosition3D &position, const char *text, float font_width, float font_height, int align=0, float direction=0) const;

  //��ʾ�̶������ı�
  void GLString0(const TPosition2D &position, const char *text, int align=0) const;
  void GLString0(const TPosition3D &position, const char *text, int align=0) const;

public:
  virtual void GLPainting(bool front, HDC dc) const =0; //��ͼǰʹ��UseGL(dc), ������ʹ��UseGL(0);�������ʹ��

protected:
  virtual void DoViewRect(const RECT &viewrect);

private:
  static void DrawGLString0(const char *text); //�����������ִ�
  static void DrawGLChar0(unsigned short chr);
  void DrawGLString(const char *text, const char *font_name) const;
  void SetRectCenter(const RECT &rect0, RECT &rect, TPosition2D &center);
};

//---------------------------------------------------------------------------
//OpenGL��ά������
//------------------------------------------------------------------------------
class GLBASES TGL2DBase : public TGLBase
{
  friend class TGDI2DForView;
private:
  TVector2D FDirection;       //����
  TVector2D FViewScale;       //��ͼ���ű�����Sx=X, Sy=X*Y
  TBound2D FMapBound;         //ͼֽ�߽�
  TVector2D FMapScale;        //ͼֽ������: Sx=X, Sy=X*Y
  TPosition2D FBasePosition;  //��׼����
  TBound2D FModelBound;       //ģ�ͷ�Χ

public:
  TPosition2D MapCenter;      //ͼֽ����

public:
  TGL2DBase();

public:
  const TPosition2D& BasePosition() const;               //��׼����
  const TVector2D MapScale() const;         //ͼֽ������=ͼֽ(��)/ģ��(��)
  void MapScale(const TVector2D &mapscale);
  double Direction() const;                 //��ͼ����
  bool Direction(double direction);
  const TBound2D& ModelBound() const;                //ģ�ͷ�Χ
  void ModelBound(const TBound2D &model_bound);
  const TVector2D GetPixelScale() const;
  void PixelScale(const TVector2D &pixelscale);
  const TVector2D ViewScale() const; //��ͼ������=��ͼ(��)/ģ��(��)
  void ViewScale(const TVector2D &viewscale);
  float LODLevel() const;
  const TBound2D& MapBound() const { return FMapBound; } //ͼֽ�߽�
  bool PositionXFixed() const;    //�����ƶ�X
  void PositionXFixed(bool fixed);
  bool PositionYFixed() const;    //�����ƶ�Y
  void PositionYFixed(bool fixed);
  bool PositionXYFixed1() const;  //ֻ�����ƶ�XY֮һ
  void PositionXYFixed1(bool fixed);
  
public:
  /*
    Ĭ������£�OpenGL��ģ�Ϳռ��ͼ��
    ʹ��BeginMap()��ʼ�ڵ�ͼ�ռ��ͼ��ʹ��EndMap()������ͼ�ռ��ͼ��
    ʹ��BeginView()��ʼ����ͼ�ռ��ͼ��ʹ��EndView()������ͼ�ռ��ͼ��
    һ������²�ҪǶ��ʹ�õ�ͼ�ռ����ͼ�ռ䡣
  */
  void BeginLocal() const;  //��ʼ�ھֲ��ռ��ͼ
  void EndLocal() const;    //�����ھֲ��ռ��ͼ
  void BeginMap() const;    //��ʼ�ڵ�ͼ�ռ��ͼ
  void EndMap() const;      //�����ڵ�ͼ�ռ��ͼ
  void BeginView() const;   //��ʼ����ͼ�ռ��ͼ
  void EndView() const;     //��������ͼ�ռ��ͼ
  void BeginWin() const;    //��ʼ�ڴ��ڿռ��ͼ
  void EndWin() const;      //�����ڴ��ڿռ��ͼ

public: // �ı��Ķ��뷽ʽ��Ĭ��Ϊ���Ķ��롣alignȡֵ1--9��������С���̷�ʽ����

  //��ʾ��(TrueType)�����ı�
  void GLString_Local(const TPosition2D &position, const char *text, float font_width, float font_height, int align=0, float direction=0, const char *font_name="����") const;
  void GLString_Map(const TPosition2D &position, const char *text, float font_width, float font_height, int align=0, float direction=0, const char *font_name="����") const;
  void GLString_View(const TPosition2D &position, const char *text, float font_width, float font_height, int align=0, float direction=0, const char *font_name="����") const;

  //���Ʊ���
  void GLBack_Local(const TPosition2D &position, const char *text, float font_width, float font_height, int align=0, float direction=0) const;
  void GLBack_Map(const TPosition2D &position, const char *text, float font_width, float font_height, int align=0, float direction=0) const;
  void GLBack_View(const TPosition2D &position, const char *text, float font_width, float font_height, int align=0, float direction=0) const;

  //��ʾ��(TrueType)�����ı�
  void GLString_Local(const TPosition2D &position, const char *text, const TVector2D &direction_width, const TVector2D &direction_height, int align=0, const char *font_name="����") const;
  void GLString_Map(const TPosition2D &position, const char *text, const TVector2D &direction_width, const TVector2D &direction_height, int align=0, const char *font_name="����") const;
  void GLString_View(const TPosition2D &position, const char *text, const TVector2D &direction_width, const TVector2D &direction_height, int align=0, const char *font_name="����") const;

  //���Ʊ���
  void GLBack_Local(const TPosition2D &position, const char *text, const TVector2D &direction_width, const TVector2D &direction_height, int align=0) const; 
  void GLBack_Map(const TPosition2D &position, const char *text, const TVector2D &direction_width, const TVector2D &direction_height, int align=0) const;
  void GLBack_View(const TPosition2D &position, const char *text, const TVector2D &direction_width, const TVector2D &direction_height, int align=0) const;

  //��ʾ�̶������ı�
  void GLString0_Local(const TPosition2D &position, const char *text, int align=0) const;
  void GLString0_Map(const TPosition2D &position, const char *text, int align=0) const;
  void GLString0_View(const TPosition2D &position, const char *text, int align=0) const;

public: // �ƶ���ͼ
  bool Move(const TVector2D &move);                            
  bool Move(const TPosition2D &from, const TPosition2D &to);

public: // ������ͼ
  bool Zoom(const TPosition2D &center, double scale);                 //���Ĳ���
  bool Zoom(const TPosition2D &center, double scalex, double scaley); //���Ĳ���
  bool ZoomIn(const TPosition2D &center);                             //��С,���Ĳ���
  bool ZoomOut(const TPosition2D &center);                            //�Ŵ�,���Ĳ���
  bool ZoomRect(const TInterval2D &rect, bool identityxy=true);       //��������Ŵ�
  void ZoomExtent(bool identityxy=true);                              //����������

public: // ��ת��ͼ
  bool Rotate(double angle);

public:
  void Reset();  //��λ�任����ΪĬ��ֵ
  void Project() const;

public://����ת��
  const TPosition2D ModelToLocal(const TPosition2D &position) const;       //ģ�Ϳռ�-->�ֲ��ռ�
  const TPosition2D LocalToModel(const TPosition2D &local_position) const; //�ֲ��ռ�-->ģ�Ϳռ�
  const TPosition2D ModelToMap(const TPosition2D &position) const;         //ģ�Ϳռ�-->��ͼ�ռ�
  const TPosition2D MapToModel(const TPosition2D &map_position) const;     //��ͼ�ռ�-->ģ�Ϳռ�
  const TPosition2D MapToView(const TPosition2D &map_position) const;      //��ͼ�ռ�-->��ͼ�ռ�
  const TPosition2D ViewToMap(const TPosition2D &view_position) const;     //��ͼ�ռ�-->��ͼ�ռ�
  const TPosition2D ViewToModel(const TPosition2D &view_position) const;   //��ͼ�ռ�-->ģ�Ϳռ�          
  const TPosition2D ModelToView(const TPosition2D &position) const;        //ģ�Ϳռ�-->��ͼ�ռ�
  void ModelToView(const TPosition2Ds &positions,TPosition2Ds &view_positions) const;
  template <typename TArr> void ModelToView(const TArr &positions,TPosition2Ds &view_positions) const;

public://ʸ��ת��
  const TVector2D ModelToMap_Vector(const TVector2D &vector) const;      //ģ�Ϳռ�-->��ͼ�ռ�
  const TVector2D MapToModel_Vector(const TVector2D &map_vector) const;  //��ͼ�ռ�-->ģ�Ϳռ�
  const TVector2D MapToView_Vector(const TVector2D &map_vector) const;   //��ͼ�ռ�-->��ͼ�ռ�
  const TVector2D ViewToMap_Vector(const TVector2D &view_vector) const;  //��ͼ�ռ�-->��ͼ�ռ�
  const TVector2D ViewToModel_Vector(const TVector2D &view_vector) const;//��ͼ�ռ�-->ģ�Ϳռ�
  const TVector2D ModelToView_Vector(const TVector2D &vector) const;     //ģ�Ϳռ�-->��ͼ�ռ�

public:
  void AssignTansformData(const TGL2DBase &glbase);

  void GLVertex_Local(const TPosition2D &point) const;
  void GLVertex_Map(const TPosition2D &point) const;
  void GLVertex_View(const TPosition2D &point) const;

  template <typename TArr> void GLVertexes_Local(const TArr &points, bool inverse) const;
  template <typename TArr> void GLVertexes_Map(const TArr &points, bool inverse) const;
  template <typename TArr> void GLVertexes_View(const TArr &points, bool inverse) const;

  void GLVertex_Local(const TPosition2D &p1, const TPosition2D &p2) const;
  void GLVertex_Map(const TPosition2D &p1, const TPosition2D &p2) const;
  void GLVertex_View(const TPosition2D &p1, const TPosition2D &p2) const;

  void GLVertex_Local(const TPosition2D &p1, const TPosition2D &p2, const TPosition2D &p3) const;
  void GLVertex_Map(const TPosition2D &p1, const TPosition2D &p2, const TPosition2D &p3) const;
  void GLVertex_View(const TPosition2D &p1, const TPosition2D &p2, const TPosition2D &p3) const;

  void GLVertex_Local(const TPosition2D &p1, const TPosition2D &p2, const TPosition2D &p3, const TPosition2D &p4) const;
  void GLVertex_Map(const TPosition2D &p1, const TPosition2D &p2, const TPosition2D &p3, const TPosition2D &p4) const;
  void GLVertex_View(const TPosition2D &p1, const TPosition2D &p2, const TPosition2D &p3, const TPosition2D &p4) const;

public: //�����ͼ�߽�
  const TBound2D  ComputeMapBound() const;

public: //����������
  void DrawViewGridXY(float delta) const;
  void DrawViewGridXY(float deltax, float deltay, float &deltx, float &delty, RECT &rect, bool Drawflag=true) const;
  void DrawViewGridXY(HDC, const RECT &bound_rect, float deltx, float delty, const RECT &rect, bool inverse=false) const;

public: //����׽��
  void DrawCapturedPoint(const TPosition2D &point) const;

private:
  const TVector2D ProcessMovement(const TVector2D &move) const;

  void DoMoveToCenter(const TPosition2D &from);
  void DoMoveCenterTo(const TPosition2D &to);
  bool DoMove(const TVector2D &move);

  bool DoZoom(double scale);                  //������ͼ
  bool DoZoom(double scalex, double scaley);  //������ͼ,
  bool DoZoomIn();                            //��С��ͼ
  bool DoZoomOut();                           //�Ŵ���ͼ
};

template <typename TArr>
void TGL2DBase::ModelToView(const TArr &positions,TPosition2Ds &view_positions) const
{
  const int n = positions.Count();
  view_positions.Resize(n);
  for (int k=0; k<n; ++k)
    view_positions[k] = ModelToView(positions[k]);
}

template <typename TArr>
void TGL2DBase::GLVertexes_Local(const TArr &points, bool inverse) const
{
  if (!inverse)
  {
    for (int k=0,n=points.Count(); k<n; ++k)
      GLVertex_Local(points[k]);
  }
  else
  {
    for (int k=points.Last(); k>=0; --k)
      GLVertex_Local(points[k]);
  }
}

template <typename TArr>
void TGL2DBase::GLVertexes_Map(const TArr &points, bool inverse) const
{
  if (!inverse)
  {
    for (int k=0,n=points.Count(); k<n; ++k)
      GLVertex_Map(points[k]);
  }
  else
  {
    for (int k=points.Last(); k>=0; --k)
      GLVertex_Map(points[k]);
  }
}

template <typename TArr>
void TGL2DBase::GLVertexes_View(const TArr &points, bool inverse) const
{
  if (!inverse)
  {
    for (int k=0,n=points.Count(); k<n; ++k)
      GLVertex_View(points[k]);
  }
  else
  {
    for (int k=points.Last(); k>=0; --k)
      GLVertex_View(points[k]);
  }
}
//---------------------------------------------------------------------------
//����OpenGL��
//------------------------------------------------------------------------------
class GLBASES TGDI2DForView : public TGL2DBase
{
private:
  mutable HDC FDC;  //��ͼDC

public:
  TGDI2DForView(int width, int height);

public: //��ͼǰʹ��UseGL(dc), ������ʹ��UseGL(0);�������ʹ��
  virtual void GLPainting(bool front, HDC dc) const;

private:
  virtual HDC DoDC() const;
  //virtual void DoGLString0(const char *text) const;
  //virtual void DoGLString(const char *text, const char *font_name) const;
};
//---------------------------------------------------------------------------

