//---------------------------------------------------------------------------
//OpenGL基础类
//------------------------------------------------------------------------------
class GLBASES TGLBase
{
  friend class TGL2DBase;
  friend class TGDI2DForView;
private:
  RECT FRect;                       //总区矩形
  RECT FViewRect;                   //视区矩形
  TPosition2D FViewCenter;          //视图中心
  TPosition2D FCenter;              //总图中心
  TVector2D FViewResolution;        //视图分辨率
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
  void UseGL(HDC dc) const;                 //使用OpenGL渲染环境, NULL表示不使用.

public:
  const RECT& Rect() const;             //总图范围
  void Rect(const RECT &rect);
  const TVector2D Size() const;         //总图尺寸
  const RECT& ViewRect() const;                   //视图范围
  void ViewRect(const RECT &viewrect);
  const TVector2D ViewSize() const;     //视图尺寸
  const TPosition2D& ViewCenter() const;          //视图中心
  const TVector2D& ViewResolution() const;        //视图像素分辨率(像素数/米)
  void ViewResolution(const TVector2D &view_resolution);
  const TVector2D ViewResolutionDPI() const; //视图像素分辨率(像素数/英寸)
  void ViewResolutionDPI(const TVector2D &dpi);
  bool PositionFixed() const;   //固定位置, 不能移动
  void PositionFixed(bool fixed);
  bool ScaleFixed() const;      //固定比例, 不能缩放
  void ScaleFixed(bool fixed);
  bool DirectionFixed() const;  //固定方向, 不能旋转
  void DirectionFixed(bool fixed);
  bool MovingLimit() const;     //限制移屏
  void MovingLimit(bool limit);
  bool AutoBasePosition() const;
  void AutoBasePosition(bool flag);
  double MinZoom() const;       //限制缩放
  void MinZoom(double min_zoom);
  double MaxZoom() const;       //限制缩放
  void MaxZoom(double max_zoom);
  
public:
  const POINT ViewToScreen(const TPosition2D &point2d) const;//坐标变换:视图-->屏幕
  const TPosition2D ScreenToView(const POINT &point) const;  //坐标变换:屏幕-->视图
  const TVector2D View_MeterToPixel(const TVector2D &meters) const;   //视图单位变换: 米-->像素
  const TVector2D View_PixelToMeter(const TVector2D &pixels) const;   //视图单位变换: 像素-->米

  //显示真(TrueType)字体文本
  void GLString(const TPosition2D &position, const char *text, float font_width, float font_height, int align=0, float direction=0, const char *font_name="黑体") const;
  void GLString(const TPosition2D &position, const char *text, const TVector2D &direction_width, const TVector2D &direction_height, int align=0, const char *font_name="黑体") const;

  void GLString(const TPosition3D &position, const char *text, float font_width, float font_height, int align=0, float direction=0, const char *font_name="黑体") const;
  void GLString(const TPosition3D &position, const char *text, const TVector3D &direction_width, const TVector3D &direction_height, float thickness=1, int align=0, const char *font_name="黑体") const;

  //绘制背景
  void GLBlank(const TPosition2D &position, const char *text, float font_width, float font_height, int align=0, float direction=0) const;
  void GLBlank(const TPosition2D &position, const char *text, const TVector2D &direction_width, const TVector2D &direction_height, int align=0) const;
  void GLBlank(const TPosition3D &position, const char *text, float font_width, float font_height, int align=0, float direction=0) const;

  //显示固定字体文本
  void GLString0(const TPosition2D &position, const char *text, int align=0) const;
  void GLString0(const TPosition3D &position, const char *text, int align=0) const;

public:
  virtual void GLPainting(bool front, HDC dc) const =0; //绘图前使用UseGL(dc), 结束后使用UseGL(0);必须配对使用

protected:
  virtual void DoViewRect(const RECT &viewrect);

private:
  static void DrawGLString0(const char *text); //输出该字体的字串
  static void DrawGLChar0(unsigned short chr);
  void DrawGLString(const char *text, const char *font_name) const;
  void SetRectCenter(const RECT &rect0, RECT &rect, TPosition2D &center);
};

//---------------------------------------------------------------------------
//OpenGL二维基础类
//------------------------------------------------------------------------------
class GLBASES TGL2DBase : public TGLBase
{
  friend class TGDI2DForView;
private:
  TVector2D FDirection;       //方向
  TVector2D FViewScale;       //视图缩放倍数：Sx=X, Sy=X*Y
  TBound2D FMapBound;         //图纸边界
  TVector2D FMapScale;        //图纸比例尺: Sx=X, Sy=X*Y
  TPosition2D FBasePosition;  //基准坐标
  TBound2D FModelBound;       //模型范围

public:
  TPosition2D MapCenter;      //图纸中心

public:
  TGL2DBase();

public:
  const TPosition2D& BasePosition() const;               //基准坐标
  const TVector2D MapScale() const;         //图纸比例尺=图纸(米)/模型(米)
  void MapScale(const TVector2D &mapscale);
  double Direction() const;                 //视图方向
  bool Direction(double direction);
  const TBound2D& ModelBound() const;                //模型范围
  void ModelBound(const TBound2D &model_bound);
  const TVector2D GetPixelScale() const;
  void PixelScale(const TVector2D &pixelscale);
  const TVector2D ViewScale() const; //视图比例尺=视图(米)/模型(米)
  void ViewScale(const TVector2D &viewscale);
  float LODLevel() const;
  const TBound2D& MapBound() const { return FMapBound; } //图纸边界
  bool PositionXFixed() const;    //不能移动X
  void PositionXFixed(bool fixed);
  bool PositionYFixed() const;    //不能移动Y
  void PositionYFixed(bool fixed);
  bool PositionXYFixed1() const;  //只能能移动XY之一
  void PositionXYFixed1(bool fixed);
  
public:
  /*
    默认情况下，OpenGL在模型空间绘图。
    使用BeginMap()开始在地图空间绘图，使用EndMap()结束地图空间绘图。
    使用BeginView()开始在视图空间绘图，使用EndView()结束视图空间绘图。
    一般情况下不要嵌套使用地图空间和视图空间。
  */
  void BeginLocal() const;  //开始在局部空间绘图
  void EndLocal() const;    //结束在局部空间绘图
  void BeginMap() const;    //开始在地图空间绘图
  void EndMap() const;      //结束在地图空间绘图
  void BeginView() const;   //开始在视图空间绘图
  void EndView() const;     //结束在视图空间绘图
  void BeginWin() const;    //开始在窗口空间绘图
  void EndWin() const;      //结束在窗口空间绘图

public: // 文本的对齐方式，默认为中心对齐。align取值1--9，按数字小键盘方式对齐

  //显示真(TrueType)字体文本
  void GLString_Local(const TPosition2D &position, const char *text, float font_width, float font_height, int align=0, float direction=0, const char *font_name="黑体") const;
  void GLString_Map(const TPosition2D &position, const char *text, float font_width, float font_height, int align=0, float direction=0, const char *font_name="黑体") const;
  void GLString_View(const TPosition2D &position, const char *text, float font_width, float font_height, int align=0, float direction=0, const char *font_name="黑体") const;

  //绘制背景
  void GLBack_Local(const TPosition2D &position, const char *text, float font_width, float font_height, int align=0, float direction=0) const;
  void GLBack_Map(const TPosition2D &position, const char *text, float font_width, float font_height, int align=0, float direction=0) const;
  void GLBack_View(const TPosition2D &position, const char *text, float font_width, float font_height, int align=0, float direction=0) const;

  //显示真(TrueType)字体文本
  void GLString_Local(const TPosition2D &position, const char *text, const TVector2D &direction_width, const TVector2D &direction_height, int align=0, const char *font_name="黑体") const;
  void GLString_Map(const TPosition2D &position, const char *text, const TVector2D &direction_width, const TVector2D &direction_height, int align=0, const char *font_name="黑体") const;
  void GLString_View(const TPosition2D &position, const char *text, const TVector2D &direction_width, const TVector2D &direction_height, int align=0, const char *font_name="黑体") const;

  //绘制背景
  void GLBack_Local(const TPosition2D &position, const char *text, const TVector2D &direction_width, const TVector2D &direction_height, int align=0) const; 
  void GLBack_Map(const TPosition2D &position, const char *text, const TVector2D &direction_width, const TVector2D &direction_height, int align=0) const;
  void GLBack_View(const TPosition2D &position, const char *text, const TVector2D &direction_width, const TVector2D &direction_height, int align=0) const;

  //显示固定字体文本
  void GLString0_Local(const TPosition2D &position, const char *text, int align=0) const;
  void GLString0_Map(const TPosition2D &position, const char *text, int align=0) const;
  void GLString0_View(const TPosition2D &position, const char *text, int align=0) const;

public: // 移动视图
  bool Move(const TVector2D &move);                            
  bool Move(const TPosition2D &from, const TPosition2D &to);

public: // 缩放视图
  bool Zoom(const TPosition2D &center, double scale);                 //中心不动
  bool Zoom(const TPosition2D &center, double scalex, double scaley); //中心不动
  bool ZoomIn(const TPosition2D &center);                             //缩小,中心不动
  bool ZoomOut(const TPosition2D &center);                            //放大,中心不动
  bool ZoomRect(const TInterval2D &rect, bool identityxy=true);       //矩形区域放大
  void ZoomExtent(bool identityxy=true);                              //缩放至满屏

public: // 旋转视图
  bool Rotate(double angle);

public:
  void Reset();  //复位变换数据为默认值
  void Project() const;

public://坐标转换
  const TPosition2D ModelToLocal(const TPosition2D &position) const;       //模型空间-->局部空间
  const TPosition2D LocalToModel(const TPosition2D &local_position) const; //局部空间-->模型空间
  const TPosition2D ModelToMap(const TPosition2D &position) const;         //模型空间-->地图空间
  const TPosition2D MapToModel(const TPosition2D &map_position) const;     //地图空间-->模型空间
  const TPosition2D MapToView(const TPosition2D &map_position) const;      //地图空间-->视图空间
  const TPosition2D ViewToMap(const TPosition2D &view_position) const;     //视图空间-->地图空间
  const TPosition2D ViewToModel(const TPosition2D &view_position) const;   //视图空间-->模型空间          
  const TPosition2D ModelToView(const TPosition2D &position) const;        //模型空间-->视图空间
  void ModelToView(const TPosition2Ds &positions,TPosition2Ds &view_positions) const;
  template <typename TArr> void ModelToView(const TArr &positions,TPosition2Ds &view_positions) const;

public://矢量转换
  const TVector2D ModelToMap_Vector(const TVector2D &vector) const;      //模型空间-->地图空间
  const TVector2D MapToModel_Vector(const TVector2D &map_vector) const;  //地图空间-->模型空间
  const TVector2D MapToView_Vector(const TVector2D &map_vector) const;   //地图空间-->视图空间
  const TVector2D ViewToMap_Vector(const TVector2D &view_vector) const;  //视图空间-->地图空间
  const TVector2D ViewToModel_Vector(const TVector2D &view_vector) const;//视图空间-->模型空间
  const TVector2D ModelToView_Vector(const TVector2D &vector) const;     //模型空间-->视图空间

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

public: //计算地图边界
  const TBound2D  ComputeMapBound() const;

public: //画坐标网格
  void DrawViewGridXY(float delta) const;
  void DrawViewGridXY(float deltax, float deltay, float &deltx, float &delty, RECT &rect, bool Drawflag=true) const;
  void DrawViewGridXY(HDC, const RECT &bound_rect, float deltx, float delty, const RECT &rect, bool inverse=false) const;

public: //画捕捉点
  void DrawCapturedPoint(const TPosition2D &point) const;

private:
  const TVector2D ProcessMovement(const TVector2D &move) const;

  void DoMoveToCenter(const TPosition2D &from);
  void DoMoveCenterTo(const TPosition2D &to);
  bool DoMove(const TVector2D &move);

  bool DoZoom(double scale);                  //缩放视图
  bool DoZoom(double scalex, double scaley);  //缩放视图,
  bool DoZoomIn();                            //缩小视图
  bool DoZoomOut();                           //放大视图
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
//窗口OpenGL类
//------------------------------------------------------------------------------
class GLBASES TGDI2DForView : public TGL2DBase
{
private:
  mutable HDC FDC;  //视图DC

public:
  TGDI2DForView(int width, int height);

public: //绘图前使用UseGL(dc), 结束后使用UseGL(0);必须配对使用
  virtual void GLPainting(bool front, HDC dc) const;

private:
  virtual HDC DoDC() const;
  //virtual void DoGLString0(const char *text) const;
  //virtual void DoGLString(const char *text, const char *font_name) const;
};
//---------------------------------------------------------------------------

