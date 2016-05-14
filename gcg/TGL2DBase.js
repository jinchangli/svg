//---------------------------------------------------------------------------
//OpenGL基础类
//------------------------------------------------------------------------------
var TGL2DBase = function () {
  var rect = RECT(0, 0, 1, 1);
  this.FRect = this.FViewRect = rect;
  this.PositionFixed(false);
  this.ScaleFixed(false);
  this.DirectionFixed(true);
};

TGL2DBase.prototype = {

  FRect: null,                //总区矩形
  FViewRect: null,            //视区矩形
  FViewCenter: null,          //视图中心
  FCenter: null,              //总图中心
  FViewResolution: null,      //视图分辨率
  FDViewCenter: null,
  FStdToView: null,
  FMaxZoom: null,
  FMinZoom: null,
  FLODScale0: null,
  FDirection: null,       //方向
  FViewScale: null,       //视图缩放倍数：Sx=X, Sy=X*Y
  FMapBound: null,         //图纸边界
  FMapScale: null,        //图纸比例尺: Sx=X, Sy=X*Y
  FBasePosition: null,  //基准坐标
  FModelBound: null,       //模型范围


  MapCenter: null,      //图纸中心


  UseGL: function (canvasObj) { },                 //使用OpenGL渲染环境, NULL表示不使用.


  Rect: function () { },             //总图范围
  Size: function () { //总图尺寸
    return TVector2D(this.FRect.right - this.FRect.left, this.FRect.bottom - this.FRect.top);
  },
  ViewRect: function (viewrect) {
    return this.FViewRect;
  },
  ViewSize: function () {
    return TVector2D(this.FViewRect.right - this.FViewRect.left, this.FViewRect.bottom - this.FViewRect.top);
  },     //视图尺寸
  ViewCenter: function () {
    return this.FViewCenter;
  },          //视图中心
  ViewResolution: function (viewresolution) {
    this.FViewResolution = viewresolution;
    if (this.FViewResolution.X <= 0)
      this.FViewResolution.X = 1;
    if (this.FViewResolution.Y <= 0)
      this.FViewResolution.Y = 1;
  },        //视图像素分辨率:function(像素数/米)
  ViewResolutionDPI: function () {
    return this.FViewResolution * INCH_TO_METER;
  }, //视图像素分辨率:function(像素数/英寸)
  PositionFixed: function (fixed) {
    if (fixed == undefined) {
      return this.GetFlag(OpenGL_PositionFixed);
    } else {
      this.SetFlag(OpenGL_PositionFixed, fixed);
    }
  },   //固定位置, 不能移动
  ScaleFixed: function (fixed) {
    if (fixed == undefined) {
      return this.GetFlag(OpenGL_ScaleFixed);
    } else {
      this.SetFlag(OpenGL_ScaleFixed, fixed);
    }
  },      //固定比例, 不能缩放
  DirectionFixed: function (fixed) {
    if (fixed == undefined) {
      return this.GetFlag(OpenGL_DirectionFixed);
    } else {
      this.SetFlag(OpenGL_DirectionFixed, fixed);
    }
  },  //固定方向, 不能旋转
  MovingLimit: function (limit) {
    if (limit == undefined) {
      return this.GetFlag(OpenGL_MovingLimit);
    } else {
      this.SetFlag(OpenGL_MovingLimit, limit);
    }
  },     //限制移屏
  AutoBasePosition: function (flag) {
    if (flag == undefined) {
      return this.GetFlag(OpenGL_AutoBasePosition);
    } else {
      this.SetFlag(OpenGL_AutoBasePosition, flag);
    }
  },
  MinZoom: function (min_zoom) {
    if (min_zoom == undefined) {
      return this.FMinZoom;
    } else {
      this.FMinZoom = min_zoom;
      if (this.FMinZoom <= 0)
        this.FMinZoom = 1E-7;
      Sort(this.FMinZoom, this.FMaxZoom);
    }
  },       //限制缩放
  MaxZoom: function (max_zoom) {
    if (max_zoom == undefined) {
      return this.FMaxZoom;
    } else {
      this.FMaxZoom = max_zoom;
      if (this.FMaxZoom <= 0)
        this.FMaxZoom = 1E7;
      Sort(this.FMinZoom, this.FMaxZoom);
    }
  },       //限制缩放

  ViewToScreen: function (point2d) {
    var point = Point(FloorToInt(point2d.X + this.FViewCenter.X) - this.FViewRect.left, FloorToInt(this.FViewCenter.Y - point2d.Y) - this.FViewRect.top);
    return point;
  },//坐标变换:视图-->屏幕
  ScreenToView: function (POpoint) {
    return TPosition2D(point.x + this.FViewRect.left - this.FViewCenter.X, this.FViewCenter.Y - point.y - this.FViewRect.top);
  },  //坐标变换:屏幕-->视图
  View_MeterToPixel: function (meters) {
    return TVector2D(meters.X * this.FViewResolution.X, meters.Y * this.FViewResolution.Y);
  },   //视图单位变换: 米-->像素
  View_PixelToMeter: function (pixels) {
    return TVector2D(pixels.X / this.FViewResolution.X, pixels.Y / this.FViewResolution.Y);
  },   //视图单位变换: 像素-->米

  //显示真:function(TrueType)字体文本
  GLString: function (position, text, font_width, font_height, align = 0, direction = 0, font_name = "黑体") {

  },

  //绘制背景
  GLBlank: function (TPosition3Dposition, text, font_width, font_height, align = 0, direction = 0) {

  },

  //显示固定字体文本
  GLString0: function (position, text, align = 0) { },

  GLPainting: function (front, HDCcanvasObj) { },//绘图前使用UseGL:function(dc){}, 结束后使用UseGL:function(0){},必须配对使用

  DoViewRect: function (viewrect) { },

  DrawGLString0: function (text) { }, //输出该字体的字串
  DrawGLChar0: function (chr) { },
  DrawGLString: function (text, font_name) { },
  SetRectCenter: function (rect0, rect, center) { },

  TGL2DBase: function () { },

  BasePosition: function () {
    return this.FBasePosition;
  },               //基准坐标
  MapScale: function (mapscale) {
    if (mapscale == undefined) {
      return TVector2D(this.FMapScale.X, this.FMapScale.Y * this.FMapScale.X);
    } else {
      this.FMapScale = mapscale;
      if (this.FMapScale.X <= 0)
        this.FMapScale.X = 1;
      if (this.FMapScale.Y <= 0)
        this.FMapScale.Y = 1;
      this.FMapScale.Y /= this.FMapScale.X;
    }
  },         //图纸比例尺=图纸:function(米)/模型:function(米)
  Direction: function () { },                 //视图方向
  ModelBound: function (model_bound) {
    if (model_bound == undefined) {
      return this.FModelBound;
    } else {
      this.FModelBound = model_bound;
      if (this.FModelBound.Valid()) {
        if (this.AutoBasePosition() && this.BasePosition().complement().lessEqualThan(0)) {
          var step_xy = 1000;
          this.FBasePosition = this.FModelBound.Center();
          this.FBasePosition = TPosition2D(Floor(this.BasePosition().X / step_xy), Floor(this.BasePosition().Y / step_xy)) * step_xy;
        }
      }
      else {
        this.FModelBound.SetBound(-1, -1);
        this.FModelBound.SetBound(1, 1);
        this.FBasePosition = TPosition2D();
      }
      this.FMapBound = ComputeMapBound();
    }
  },                //模型范围
  GetPixelScale: function () { },
  PixelScale: function (pixelscale) { },
  ViewScale: function () { }, //视图比例尺=视图:function(米)/模型:function(米)
  LODLevel: function () { },
  MapBound: function () { },//图纸边界
  PositionXFixed: function (fixed) {
    if (fixed == undefined) {
      return this.GetFlag(OpenGL_PositionXFixed);
    } else {
      this.SetFlag(OpenGL_PositionXFixed, fixed);
    }
  },    //不能移动X
  PositionYFixed: function (fixed) {
    if (fixed == undefined) {
      return this.GetFlag(OpenGL_PositionYFixed);
    } else {
      this.SetFlag(OpenGL_PositionYFixed, fixed);
    }
  },    //不能移动Y
  PositionXYFixed1: function (fixed) {
    if (fixed == undefined) {
      return this.GetFlag(OpenGL_PositionXYFixed1);
    } else {
      this.SetFlag(OpenGL_PositionXYFixed1, fixed);
    }
  },  //只能能移动XY之一


  /*
    默认情况下，OpenGL在模型空间绘图。
    使用BeginMap:function()开始在地图空间绘图，使用EndMap:function()结束地图空间绘图。
    使用BeginView:function()开始在视图空间绘图，使用EndView:function()结束视图空间绘图。
    一般情况下不要嵌套使用地图空间和视图空间。
  */
  BeginLocal: function () {
    glPushMatrix();
    glLoadIdentity();
    glRotated(Direction(), 0, 0, 1);
    glScaled(1 / FMapScale.X, 1 / (FMapScale.X * FMapScale.Y), 0);
  },  //开始在局部空间绘图
  EndLocal: function () {
    glPopMatrix();
  },    //结束在局部空间绘图
  BeginMap: function () {
    glPushMatrix();
    glLoadIdentity();
  },    //开始在地图空间绘图
  EndMap: function () {
    glPopMatrix();
  },      //结束在地图空间绘图
  BeginView: function () {
    glMatrixMode(GL_PROJECTION);
    glPushMatrix();
    glLoadIdentity();
    glOrtho(FDViewCenter.X - FStdToView.X, FDViewCenter.X + FStdToView.X,
      this.FDViewCenter.Y - this.FStdToView.Y, this.FDViewCenter.Y + this.FStdToView.Y, 0.0, 1.0);
    glMatrixMode(GL_MODELVIEW);
    glPushMatrix();
    glLoadIdentity();
  },   //开始在视图空间绘图
  EndView: function () {
    glMatrixMode(GL_PROJECTION);
    glPopMatrix();
    glMatrixMode(GL_MODELVIEW);
    glPopMatrix();
  },     //结束在视图空间绘图
  BeginWin: function () {
    var rect = this.ViewRect();
    glMatrixMode(GL_PROJECTION);
    glPushMatrix();
    glLoadIdentity();
    glOrtho(rect.left, rect.right, rect.bottom, rect.top, 0.0, 1.0);
    glMatrixMode(GL_MODELVIEW);
    glPushMatrix();
    glLoadIdentity();
  },    //开始在窗口空间绘图
  EndWin: function () {
    glMatrixMode(GL_PROJECTION);
    glPopMatrix();
    glMatrixMode(GL_MODELVIEW);
    glPopMatrix();
  },      //结束在窗口空间绘图

  // 文本的对齐方式，默认为中心对齐。align取值1--9，按数字小键盘方式对齐

  //显示真:function(TrueType)字体文本
  GLString_Local: function (position, text, font_width, font_height, align = 0, direction = 0, font_name = "黑体") {

  },
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
  Zoom: function () {
    if (arguments.length == 2) {
      var position = arguments[0];
      var scale = arguments[1];

      if (!this.ScaleFixed() && scale != 1) {
        this.DoMoveToCenter(position);
        this.DoZoom(scale);
        this.DoMoveCenterTo(position);
        return true;
      }
      return false;
    } else if (arguments.length == 3) {
      var position = arguments[0];
      var scalex = arguments[1];
      var scaley = arguments[2];

      if (!this.ScaleFixed() && scalex && scaley) {
        this.DoMoveToCenter(position);
        this.DoZoom(scalex, scaley);
        this.DoMoveCenterTo(position);
        return true;
      }
      return false;
    }

  }, //中心不动
  ZoomIn: function (position) {
    if (!this.ScaleFixed()) {
      this.DoMoveToCenter(position);
      this.DoZoomIn();
      this.DoMoveCenterTo(position);
      return true;
    }
    return false;
  },                             //缩小,中心不动
  ZoomOut: function (position) {
    if (!this.ScaleFixed()) {
      this.DoMoveToCenter(position);
      this.DoZoomOut();
      this.DoMoveCenterTo(position);
      return true;
    }
    return false;
  },                            //放大,中心不动
  ZoomRect: function (rect, identityxy) {
    var rst = false;
    tmp_center(this.ProcessMovement(rect.Center()));
    if (!IsZero(tmp_center)) {
      this.DoMoveToCenter(tmp_center);
      rst = true;
    }
    if (!this.ScaleFixed()) {
      size(rect.Size());
      var vrect = ViewRect();
      var W = vrect.right - vrect.left - 1,
      var H = vrect.bottom - vrect.top - 1;
      if (size.X > 0 && size.Y > 0) {
        var sx = W / size.X,
        var sy = H / size.Y;
        if (identityxy) {
          if (this.DoZoom(Min(sx, sy)))
            rst = true;
        }
        else {
          if (this.DoZoom(sx, sy))
            rst = true;
        }
      }
      else if (size.X > 0) {
        if (this.DoZoom(W / size.X))
          rst = true;
      }
      else if (size.Y > 0) {
        if (this.DoZoom(H / size.Y))
          rst = true;
      }
      else {
        this.FViewScale.X = this.FViewScale.Y = 1;
        rst = true;
      }
    }
    return rst;
  },       //矩形区域放大
  ZoomExtent: function (identityxy = true) {
    if (FModelBound.Valid() && FMapBound.Valid()) {
      var rect = Rect();
      var size = Size(rect.right - rect.left, rect.bottom - rect.top);
      var mapsize = this.View_MeterToPixel(this.FMapBound.Size());
      this.MapCenter = this.FMapBound.Center();
      if (!this.ScaleFixed()) {
        if (mapsize.X > 0 && mapsize.Y > 0) {
          var sx = size.cx / mapsize.X,
          var sy = size.cy / mapsize.Y;
          if (identityxy) {
            this.FViewScale.X = 0.95 * Min(sx, sy);
            this.FViewScale.Y = 1;
          }
          else {
            this.FViewScale.X = 0.95 * sx;
            this.FViewScale.Y = sy / sx;
          }
        }
        else if (mapsize.X > 0) {
          this.FViewScale.X = 0.95 * size.cx / mapsize.X;
          this.FViewScale.Y = 1;
        }
        else if (mapsize.Y > 0) {
          this.FViewScale.X = 0.95 * size.cy / mapsize.Y;
          this.FViewScale.Y = 1;
        }
        else
          this.FViewScale.X = this.FViewScale.Y = 1;
      }
      else
        this.MapCenter.X = this.MapCenter.Y = 0;
    }
    else {
      this.MapCenter.X = this.MapCenter.Y = 0;
      if (!this.ScaleFixed())
        this.FViewScale.X = this.FViewScale.Y = 1;
    }
    this.FLODScale0 = FViewScale.complement();
  },                              //缩放至满屏

  // 旋转视图
  Rotate: function (angle) {
    if (!this.DirectionFixed() && angle != 0)
      return this.Direction(this.Direction() + angle);
    return false;
  },


  Reset: function () {
    this.FDirection.X = 1;
    this.FDirection.Y = 0;
    this.FViewScale.X = this.FViewScale.Y = 1;
    this.MapCenter.X = this.MapCenter.Y = 0;
    this.FMapScale.X = this.FMapScale.Y = 1;
  },  //复位变换数据为默认值
  Project: function () {
    var vrect = this.ViewRect();
    glViewport(0, 0, vrect.right - vrect.left, vrect.bottom - vrect.top);
    glMatrixMode(GL_PROJECTION);
    glLoadIdentity();
    glOrtho(this.FDViewCenter.X - this.FStdToView.X, this.FDViewCenter.X + this.FStdToView.X,
      this.FDViewCenter.Y - this.FStdToView.Y, this.FDViewCenter.Y + this.FStdToView.Y, 0.0, 1.0);
    glScaled(this.FViewScale.X * this.FViewResolution.X, this.FViewScale.X * this.FViewScale.Y * this.FViewResolution.Y, 1.0);
    glTranslated(-this.MapCenter.X, -this.MapCenter.Y, 0);
    glMatrixMode(GL_MODELVIEW);
    glLoadIdentity();
    glRotated(this.Direction(), 0, 0, 1);
    glScaled(1 / this.FMapScale.X, 1 / (this.FMapScale.X * this.FMapScale.Y), 0);
    glTranslated(-this.FBasePosition.X, -this.FBasePosition.Y, 0);
  },

  //坐标转换
  ModelToLocal: function (position) {
    return position.minus(this.FBasePosition);
  },       //模型空间-->局部空间
  LocalToModel: function (local_position) {
    return this.FBasePosition.add(local_position);
  }, //局部空间-->模型空间
  ModelToMap: function (position) {
    var p = TPosition2D(this.ModelToLocal(position) / this.FMapScale.X);
    p.Y /= FMapScale.Y;
    return p % this.FDirection;
  },         //模型空间-->地图空间
  ModelToMapVector: function (vector) {
    var v = TVector2D(vector.divide(this.FMapScale.X));
    v.Y /= this.FMapScale.Y;
    return v.mod(this.FDirection);
  },
  MapToModel: function (map_position) {
    var p = TVector2D((map_position.times(this.FMapScale.X)).mod(FDirection.star()));
    p.Y *= this.FMapScale.Y;;
    return this.LocalToModel(p);
  },     //地图空间-->模型空间
  MapToView: function (map_position) {
    var p = TPosition2D((map_position - this.MapCenter) * this.FViewScale.X);
    return this.View_MeterToPixel(TVector2D(p.X, p.Y * this.FViewScale.Y)).minus(this.FDViewCenter);
  },      //地图空间-->视图空间
  ViewToMap: function (view_position) {
    var p = TPosition2D(this.View_PixelToMeter(view_position + this.FDViewCenter) / this.FViewScale.X);
    return TVector2D(p.X, p.Y / this.FViewScale.Y) + this.MapCenter;
  },     //视图空间-->地图空间
  ViewToModel: function (view_position) {
    return this.MapToModel(this.ViewToMap(view_position));
  },   //视图空间-->模型空间
  ModelToView: function (position) {
    return this.MapToView(this.ModelToMap(position));
  },        //模型空间-->视图空间

  //矢量转换
  ModelToMap_Vector: function (vector) {
    var v = TVector2D(vector.divide(this.FMapScale.X));
    v.Y /= this.FMapScale.Y;
    return v.mod(this.FDirection);
  },      //模型空间-->地图空间
  MapToModel_Vector: function (map_vector) {
    var v = TVector2D((map_vector * this.FMapScale.X) % (FDirection.star()));
    v.Y *= FMapScale.Y;
    return v;
  },  //地图空间-->模型空间
  MapToView_Vector: function (map_vector) {
    var v = TVector2D(map_vector * this.FViewScale.X);
    return this.View_MeterToPixel(TVector2D(v.X, v.Y * this.FViewScale.Y));
  },   //地图空间-->视图空间
  ViewToMap_Vector: function (view_vector) {
    var v = TVector2D(this.View_PixelToMeter(view_vector) / this.FViewScale.X);
    return TVector2D(v.X, v.Y / this.FViewScale.Y);
  },  //视图空间-->地图空间
  ViewToModel_Vector: function (view_vector) {
    return this.MapToModel_Vector(this.ViewToMap_Vector(view_vector));
  },//视图空间-->模型空间
  ModelToView_Vector: function (vector) {
    return this.MapToView_Vector(this.ModelToMap_Vector(vector));
  },     //模型空间-->视图空间


  AssignTansformData: function (glbase) {
    var resolution_ratio = TVector2D(glbase.FViewResolution.X / this.FViewResolution.X, glbase.FViewResolution.Y / this.FViewResolution.Y);
    this.FFlags = glbase.FFlags;
    this.FDirection = glbase.FDirection;
    this.FViewScale = glbase.FViewScale;
    this.FViewScale.X *= resolution_ratio.X;
    this.FViewScale.Y *= resolution_ratio.Y;
    this.FMapBound = glbase.FMapBound;
    this.MapCenter = glbase.MapCenter;
    this.FMapScale = glbase.FMapScale;
    this.FBasePosition = glbase.FBasePosition;
    this.FModelBound = glbase.FModelBound;
  },

  GLVertex_Local: function (point) {
    this.GLVertex3D(this.ModelToLocal(point));
  },
  GLVertex_Map: function (point) {
    this.GLVertex3D(this.ModelToMap(point));
  },
  GLVertex_View: function (point) {
    this.GLVertex3D(this.ModelToView(point));
  },

  GLVertexes_Local: function (points, inverse) { },
  GLVertexes_Map: function (points, inverse) { },
  GLVertexes_View: function (points, inverse) { },

  //计算地图边界
  ComputeMapBound: function () {
    var mapbds;
    if (this.FModelBound.Valid()) {
      mapbds.SetBound(this.ModelToMap(this.FModelBound.Min()));
      mapbds.SetBound(this.ModelToMap(this.FModelBound.Max()));
    }
    return mapbds;
  },

  //画坐标网格
  DrawViewGridXY: function (HDC, bound_rect, deltx, delty, rect, inverse) {
    if (this.FDirection.X == 1 || this.FDirection.Y == 0) {
      var bds;
      var vrect = ViewRect();
      if (vrect.right > vrect.left && vrect.bottom > vrect.top) {
        var p = TPosition2D((vrect.right - vrect.left) / 2.0, (vrect.bottom - vrect.top) / 2.0);
        bds.SetBound(this.ViewToModel(-p));
        bds.SetBound(this.ViewToModel(p));
        if (bds.Valid()) {
          var delt = Max(BestNumber(delta * ViewScale().X), 1.0);
          var rect = RECT(
            CeilToInt(bds.Min().X / delt), CeilToInt(bds.Min().Y / delt),
            FloorToInt(bds.Max().X / delt), FloorToInt(bds.Max().Y / delt));
          this.BeginView();
          glBegin(GL_LINES);
          for (var x = rect.left; x <= rect.right; ++x) {
            this.GLVertex2D(this.ModelToView(TPosition2D(x * delt, bds.Min().Y)).X);
            this.GLVertex2D(this.ModelToView(TPosition2D(x * delt, bds.Max().Y)).X);
          }
          for (var y = rect.top; y <= rect.bottom; ++y) {
            this.GLVertex2D(this.ModelToView(TPosition2D(bds.Min().X, y * delt)).X);
            this.GLVertex2D(this.ModelToView(TPosition2D(bds.Max().X, y * delt)).X);
          }
          glEnd();

          var vr;
          var vrect = ViewRect();
          vr.SetRect(TVector2D(vrect.right - vrect.left, vrect.bottom - vrect.top));

          for (var x = rect.left; x <= rect.right; ++x) {

            var p1 = this.ModelToView(TPosition2D(x * delt, bds.Min().Y));
            var p2 = this.ModelToView(TPosition2D(x * delt, bds.Max().Y));
            if (vr.RectLine(p1, p2)) {
              var v = p2 - p1;
              var length = v.complement();
              if (length > 0) {
                v /= length / 2;
                var direction = -RadToDeg(v.negation());
                var str = NumberToStr(x * delt, 2) + "Y";
                this.GLString(p1 + v, str.c_str(), 14, 17, 7, direction);
                this.GLString(p2 - v, str.c_str(), 14, 17, 9, direction);
              }
            }
          }

          for (var y = rect.top; y <= rect.bottom; ++y) {

            var p1 = this.ModelToView(TPosition2D(bds.Min().X, y * delt)),
            var p2 = this.ModelToView(TPosition2D(bds.Max().X, y * delt));
            if (vr.RectLine(p1, p2)) {
              var v = p2 - p1;
              var length = ~v;
              if (length > 0) {
                v /= length / 2;
                var direction = -RadToDeg(v.complement());
                var str = NumberToStr(y * delt, 2) + "X";
                this.GLString(p1 + v, str.c_str(), 14, 17, 7, direction);
                this.GLString(p2 - v, str.c_str(), 14, 17, 9, direction);
              }
            }
          }
          this.EndView();
        }
      }
    }
  },

  //画捕捉点
  DrawCapturedPoint: function (point) {
    var N = 3;
    var Colors = [
      TRGBColor(1, 1, 0), TRGBColor(1, 0, 0), TRGBColor(1, 1, 0), TRGBColor(0, 0, 0)
    ];

    this.BeginView();
    for (var k = 0; k <= N; ++k) {
      glBegin(GL_LINE_LOOP);
      glColor3fv(Colors[k].Red);
      this.GLVertex2D(TPosition2D(point.X - k - N, point.Y - k - N));
      this.GLVertex2D(TPosition2D(point.X + k + N, point.Y - k - N));
      this.GLVertex2D(TPosition2D(point.X + k + N, point.Y + k + N));
      this.GLVertex2D(TPosition2D(point.X - k - N, point.Y + k + N));
      glEnd();
    }

    this.EndView();
  },


  ProcessMovement: function (move) {
    var tmp_move = TVector2D(this.PositionFixed() ? TVector2D() : move);
    if (this.PositionXYFixed1()) {
      if (Abs(tmp_move.X) < Abs(tmp_move.Y)) {
        if (this.PositionYFixed())
          tmp_move.Y = 0;
        else
          tmp_move.X = 0;
      }
      else {
        if (this.PositionXFixed())
          tmp_move.X = 0;
        else
          tmp_move.Y = 0;
      }
    }
    if (this.PositionXFixed())
      tmp_move.X = 0;
    if (this.PositionYFixed())
      tmp_move.Y = 0;
    return tmp_move;
  },

  DoMoveToCenter: function (from) {
    this.DoMove(-from);
  },
  DoMoveCenterTo: function (to) {
    this.DoMove(to);
  },
  DoMove: function (move) {
    if (!IsZero(move)) {
      var p0, p;
      var v;
      if (this.ViewToLocal(p0, move, p, v)) {
        this.FModelCenter = this.FModelCenter.minus(v);
        return true;
      }
    }
    return false;
  },

  DoZoom: function (scalex, scaley) {
    if (scaley == undefined)
      scaley = scalex;
    if (!this.ScaleFixed() && (scalex != 1 || scaley != 1)) {
      this.FViewScale.X *= scalex;
      this.FViewScale.X = Clamp(MinZoom(), FViewScale.X, MaxZoom());
      this.FViewScale.Y *= scaley / scalex;
      this.FViewScale.Y = Clamp(MinZoom(), FViewScale.Y, MaxZoom());
      return true;
    }
    return false;
  },  //缩放视图,
  DoZoomIn: function () {
    return this.DoZoom(1.25);
  },                            //缩小视图
  DoZoomOut: function () {
    return this.DoZoom(1 / 1.25);
  },                           //放大视图
}
