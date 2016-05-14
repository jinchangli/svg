//---------------------------------------------------------------------------
//OpenGL基础类
//------------------------------------------------------------------------------
var TGL2DBase = function () { };

TGL2DBase.prototype = {

  FRect: null,                       //总区矩形
  FViewRect: null,                   //视区矩形
  FViewCenter: null,          //视图中心
  FCenter: null,              //总图中心
  FViewResolution: null,        //视图分辨率
  FDViewCenter: null,
  FStdToView: null,
  FMaxZoom: null,
   FMinZoom: null, 
   FLODScale0: null,
   
  UseGL: function (canvasObj) { },                 //使用OpenGL渲染环境, NULL表示不使用.


  Rect: function () { },             //总图范围
  Size: function () { },         //总图尺寸
  ViewRect: function (viewrect) { },
  ViewSize: function () { },     //视图尺寸
  ViewCenter: function () { },          //视图中心
  ViewResolution: function () { },        //视图像素分辨率:function(像素数/米)
  ViewResolutionDPI: function () { }, //视图像素分辨率:function(像素数/英寸)
  PositionFixed: function () { },   //固定位置, 不能移动
  ScaleFixed: function () { },      //固定比例, 不能缩放
  DirectionFixed: function () { },  //固定方向, 不能旋转
  MovingLimit: function () { },     //限制移屏
  AutoBasePosition: function () { },
  MinZoom: function () { },       //限制缩放
  MaxZoom: function () { },       //限制缩放

  POViewToScreen: function (point2d) { },//坐标变换:视图-->屏幕
  ScreenToView: function (POpoint) { },  //坐标变换:屏幕-->视图
  View_MeterToPixel: function (meters) { },   //视图单位变换: 米-->像素
  View_PixelToMeter: function (pixels) { },   //视图单位变换: 像素-->米

  //显示真:function(TrueType)字体文本
  GLString: function (position, text, font_width, font_height, align = 0, direction = 0, font_name = "黑体") { },

  //绘制背景
  GLBlank: function (TPosition3Dposition, text, font_width, font_height, align = 0, direction = 0) { },

  //显示固定字体文本
  GLString0: function (position, text, align = 0) { },

  GLPainting: function (front, HDCcanvasObj) { },//绘图前使用UseGL:function(dc){}, 结束后使用UseGL:function(0){},必须配对使用

  DoViewRect: function (viewrect) { },

  DrawGLString0: function (text) { }, //输出该字体的字串
  DrawGLChar0: function (chr) { },
  DrawGLString: function (text, font_name) { },
  SetRectCenter: function (rect0, rect, center) { },

  FDirection: null,       //方向
  FViewScale: null,       //视图缩放倍数：Sx=X, Sy=X*Y
  FMapBound: null,         //图纸边界
  FMapScale: null,        //图纸比例尺: Sx=X, Sy=X*Y
  FBasePosition: null,  //基准坐标
  FModelBound: null,       //模型范围


  MapCenter: null,      //图纸中心


  TGL2DBase: function () { },


  BasePosition: function () { },               //基准坐标
  MapScale: function () { },         //图纸比例尺=图纸:function(米)/模型:function(米)
  Direction: function () { },                 //视图方向
  ModelBound: function () { },                //模型范围
  GetPixelScale: function () { },
  PixelScale: function (pixelscale) { },
  ViewScale: function () { }, //视图比例尺=视图:function(米)/模型:function(米)
  LODLevel: function () { },
  MapBound: function () { },//图纸边界
  PositionXFixed: function () { },    //不能移动X
  PositionYFixed: function () { },    //不能移动Y
  PositionXYFixed1: function () { },  //只能能移动XY之一


  /*
    默认情况下，OpenGL在模型空间绘图。
    使用BeginMap:function()开始在地图空间绘图，使用EndMap:function()结束地图空间绘图。
    使用BeginView:function()开始在视图空间绘图，使用EndView:function()结束视图空间绘图。
    一般情况下不要嵌套使用地图空间和视图空间。
  */
  BeginLocal: function () { },  //开始在局部空间绘图
  EndLocal: function () { },    //结束在局部空间绘图
  BeginMap: function () { },    //开始在地图空间绘图
  EndMap: function () { },      //结束在地图空间绘图
  BeginView: function () { },   //开始在视图空间绘图
  EndView: function () { },     //结束在视图空间绘图
  BeginWin: function () { },    //开始在窗口空间绘图
  EndWin: function () { },      //结束在窗口空间绘图

  // 文本的对齐方式，默认为中心对齐。align取值1--9，按数字小键盘方式对齐

  //显示真:function(TrueType)字体文本
  GLString_Local: function (position, text, font_width, font_height, align = 0, direction = 0, font_name = "黑体") { },
  GLString_Map: function (position, text, font_width, font_height, align = 0, direction = 0, font_name = "黑体") { },
  GLString_View: function (position, text, font_width, font_height, align = 0, direction = 0, font_name = "黑体") { },

  //绘制背景
  GLBack_Local: function (position, text, font_width, font_height, align = 0, direction = 0) { },
  GLBack_Map: function (position, text, font_width, font_height, align = 0, direction = 0) { },
  GLBack_View: function (position, text, font_width, font_height, align = 0, direction = 0) { },

  //显示固定字体文本
  GLString0_Local: function (position, text, align = 0) { },
  GLString0_Map: function (position, text, align = 0) { },
  GLString0_View: function (position, text, align = 0) { },

  // 移动视图
  Move: function (move) { },
  MoveTo: function (from, to) { },

  // 缩放视图
  Zoom: function (center, scalex, scaley) { }, //中心不动
  ZoomIn: function (center) { },                             //缩小,中心不动
  ZoomOut: function (center) { },                            //放大,中心不动
  ZoomRect: function (TInterval2Drect, identityxy = true) { },       //矩形区域放大
  ZoomExtent: function (identityxy = true) { },                              //缩放至满屏

  // 旋转视图
  Rotate: function (angle) { },


  Reset: function () { },  //复位变换数据为默认值
  Project: function () { },

  //坐标转换
  ModelToLocal: function (position) { },       //模型空间-->局部空间
  LocalToModel: function (local_position) { }, //局部空间-->模型空间
  ModelToMap: function (position) { },         //模型空间-->地图空间
  MapToModel: function (map_position) { },     //地图空间-->模型空间
  MapToView: function (map_position) { },      //地图空间-->视图空间
  ViewToMap: function (view_position) { },     //视图空间-->地图空间
  ViewToModel: function (view_position) { },   //视图空间-->模型空间          
  ModelToView: function (position) { },        //模型空间-->视图空间

  //矢量转换
  ModelToMap_Vector: function (vector) { },      //模型空间-->地图空间
  MapToModel_Vector: function (map_vector) { },  //地图空间-->模型空间
  MapToView_Vector: function (map_vector) { },   //地图空间-->视图空间
  ViewToMap_Vector: function (view_vector) { },  //视图空间-->地图空间
  ViewToModel_Vector: function (view_vector) { },//视图空间-->模型空间
  ModelToView_Vector: function (vector) { },     //模型空间-->视图空间


  AssignTansformData: function (TGL2DBaseglbase) { },

  GLVertex_Local: function (point) { },
  GLVertex_Map: function (point) { },
  GLVertex_View: function (point) { },

  GLVertexes_Local: function (points, inverse) { },
  GLVertexes_Map: function (points, inverse) { },
  GLVertexes_View: function (points, inverse) { },

  //计算地图边界
  ComputeMapBound: function () { },

  //画坐标网格
  DrawViewGridXY: function (HDC, bound_rect, deltx, delty, rect, inverse) { },

  //画捕捉点
  DrawCapturedPoint: function (point) { },


  ProcessMovement: function (move) { },

  DoMoveToCenter: function (from) { },
  DoMoveCenterTo: function (to) { },
  DoMove: function (move) { },

  DoZoom: function (scalex, scaley) { },  //缩放视图,
  DoZoomIn: function () { },                            //缩小视图
  DoZoomOut: function () { },                           //放大视图
}