//---------------------------------------------------------------------------
//OpenGL基础类
//------------------------------------------------------------------------------
var TGLBase = function() {
    this.constructor.apply(this, arguments);
    this.wellPen = new WellPen(this.FGLView);
};

TGLBase.prototype = {
    Canvas: null,
    FGLView: null,
    FViewRect: null, //视区矩形:TRect
    FViewCenter: null, //视图中心:TPosition2D
    FViewScale: null, //视图比例尺=视图(米)/模型(米):double
    FStdToView: null, //:TVector2D
    FMaxZoom: null, //:double
    FMinZoom: null, //:double
    FMapBound: null, //图纸边界
    FMapCenter: null, //图纸中心
    FMapScale: null, //图纸比例尺=图纸:(米)/模型:(米)
    FModelBound: null, //模型范围
    FBasePosition: null, //基准坐标
    ViewResolution: null, //视图像素分辨率:像素数/米
    FMat2D: null,
    ISOLines: null,


    constructor: function(canvas, view) {
        this.FGLView = view;
        this.FViewRect = new TRect();
        this.FViewCenter = TPosition2D();
        this.FModelCenter = TPosition2D();
        this.FStdToView = TVector2D();
        var rct = new TRect();
        rct.left = 0;
        rct.top = 0;
        rct.right = 1;
        rct.bottom = 1;
        this.ViewRect(rct);

        this.ViewResolution = 96 / 0.0254;
        this.FMat2D = TMatrix2D();
        this.FMinZoom = 1E-7;
        this.FMaxZoom = 1E7;
        this.FMapBound = TBound2D();
        this.FMapCenter = TPosition2D();
        this.FModelBound = TBound2D();
        this.FBasePosition = TPosition2D();

        this.UseGL(canvas);

        this.Reset();
    },
    Reset: function() { //复位变换数据为默认值
        this.FViewScale = 1;
        this.FMapCenter.X = this.FMapCenter.Y = 0;
        this.FMapScale = 1;
    },

    UseGL: function(canvasObj) { //使用OpenGL渲染环境, NULL表示不使用.
        this.Canvas = canvasObj;
        if (this.Canvas) {
            var rct = {};
            rct.left = 0;
            rct.top = 0;
            rct.right = this.Canvas.canvas.clientWidth;
            rct.bottom = this.Canvas.canvas.clientHeight;
            this.ViewRect(rct);
        }
    },
    ViewRect: function() {
        if (arguments.length == 0) {
            return this.FViewRect;
        } else {
            if (arguments.length == 1) {
                this.FViewRect.left = arguments[0].left;
                this.FViewRect.top = arguments[0].top;
                this.FViewRect.right = arguments[0].right;
                this.FViewRect.bottom = arguments[0].bottom;
            } else if (arguments.length == 4) {
                this.FViewRect.left = arguments[0];
                this.FViewRect.top = arguments[1];
                this.FViewRect.right = arguments[2];
                this.FViewRect.bottom = arguments[3];
            }
            if (this.FViewRect.right <= this.FViewRect.left)
                this.FViewRect.right = this.FViewRect.left + 1;
            if (this.FViewRect.bottom <= this.FViewRect.top)
                this.FViewRect.bottom = this.FViewRect.top + 1;
            this.FViewCenter.X = (this.FViewRect.right + this.FViewRect.left) * 0.5;
            this.FViewCenter.Y = (this.FViewRect.bottom + this.FViewRect.top) * 0.5;
            this.FStdToView.X = (this.FViewRect.right - this.FViewRect.left) / 2.0;
            this.FStdToView.Y = (this.FViewRect.bottom - this.FViewRect.top) / 2.0;
            this.FModelCenter = this.FViewCenter;
        }
    },
    ViewSize: function() {
        return TVector2D(this.FViewRect.right - this.FViewRect.left, this.FViewRect.bottom - this.FViewRect.top);
    }, //视图尺寸

    ViewResolutionDPI: function() { //视图像素分辨率:像素数/英寸
        if (arguments.length == 0) {
            return this.ViewResolution * 0.0254;
        } else {
            this.ViewResolution = arguments[0] / 0.0254;
        }
    },
    MinZoom: function() {
        if (arguments.length == 0) {
            return this.FMinZoom;
        } else {
            this.FMinZoom = min_zoom;
            if (this.FMinZoom <= 0)
                this.FMinZoom = 1E-7;
        }
    }, //限制缩放
    MaxZoom: function() {
        if (arguments.length == 0) {
            return this.FMaxZoom;
        } else {
            this.FMaxZoom = max_zoom;
            if (this.FMaxZoom <= 0)
                this.FMaxZoom = 1E7;
        }
    }, //限制缩放

    ViewToScreen: function(point2d) {
        return TPosition2D(Math.floor(point2d.X + this.FViewCenter.X) - this.FViewRect.left, Math.floor(this.FViewCenter.Y - point2d.Y) - this.FViewRect.top);
    }, //坐标变换:视图-->屏幕
    ViewToLocal: function(point2d) {
        return this.ModelToLocal(this.MapToModel(this.ViewToMap(point2d)));
    }, //坐标变换:视图-->本地
    LocalToView: function(point2d) {
        return this.ModelToView(this.LocalToModel(point2d));
    }, //坐标变换:视图-->本地
    ScreenToView: function(point) {
        return TPosition2D(point.X + this.FViewRect.left - this.FViewCenter.X, this.FViewCenter.Y - point.Y - this.FViewRect.top);
    }, //坐标变换:屏幕-->视图
    View_MeterToPixel: function(meters) {
        return TVector2D(meters.X * this.ViewResolution, meters.Y * this.ViewResolution);
    }, //视图单位变换: 米-->像素
    View_PixelToMeter: function(pixels) {
        return TVector2D(pixels.X / this.ViewResolution, pixels.Y / this.ViewResolution);
    }, //视图单位变换: 像素-->米

    GLBound: function() {
        var border = this.FGLView.borderPoints;
        if (border) {

            this.DrawOneBound(border);
        }
    },

    DrawOneBound: function(borderPoints) {
        if (!borderPoints || borderPoints.length == 0) {
            return;
        }

        var ctx = this.FGLView.BoundLayer;
        this.BeginModel(ctx);
        var lastPosition = convertPosition(view, ctx, borderPoints[0]);

        ctx.beginPath();
        ctx.moveTo(lastPosition.X, lastPosition.Y);

        for (var i = 1; i < borderPoints.length; i++) {
            var lastPosition = convertPosition(view, ctx, borderPoints[i]);
            ctx.lineTo(lastPosition.X, lastPosition.Y);
        }

        ctx.closePath();
        ctx.stroke();

        this.EndModel(ctx);
    },

    GLWells: function() {
        var newPoints = this.FGLView.wellPoints;
        // this.tempWellsArray = [];
        if (!newPoints) {
            return;
        }

        var view = this.FGLView;
        var ctx = view.WellsLayer;

        this.BeginWin(ctx);

        for (var i = 0; i < newPoints.length; i++) {
            var position = TPosition2D(newPoints[i].X, newPoints[i].Y)
            this.drawWell(position, newPoints[i].N, newPoints[i].T);
        }

        this.EndWin(ctx);
    },

    drawWell: function(newPosition, wellName, wellType) {
        var view = this.FGLView;
        var ctx = view.WellsLayer;

        var screenPosition = convertPosition(view, ctx, newPosition);

        this.wellPen.drawWell(ctx, screenPosition, wellType, wellName);

    },
    GLFaults: function() {
        var faults = this.FGLView.faults;

        // this.tempWellsArray = [];
        if (!faults) {
            return;
        }

        var ctx = view.FaultsLayer;
        this.BeginModel(ctx);
        for (var i = 0; i < faults.length; i++) {
            var fault = faults[i];
            this.drawFault(fault);
        }

        this.EndModel(ctx);
    },
    drawFault: function(newPoints) {
        var view = this.FGLView;

        var ctx = view.FaultsLayer;

        var lastPosition = convertPosition(view, ctx, newPoints[0]);
        ctx.beginPath();
        ctx.moveTo(lastPosition.X, lastPosition.Y);

        for (var i = 1; i < newPoints.length; i++) {
            var lastPosition = convertPosition(view, ctx, newPoints[i]);
            ctx.lineTo(lastPosition.X, lastPosition.Y);
        }

        ctx.stroke();
        ctx.closePath();
    },
    //绘制标注
    GLNotes: function(isoLines, wscale, hscale, fontSize, fontFamily) {
        if (!isoLines || isoLines.length == 0) {
            console.log("GLNotes, isoLines is empty");
            return;
        }

        if (!wscale) {
            wscale = 1;
        }

        if (!hscale) {
            hscale = 1;
        }

        var ctx = this.Canvas;
        ctx.beginPath();
        for (var lIndex = 0; lIndex < isoLines.length; lIndex++) {
            var isoLine = isoLines[lIndex];
            var notes = isoLine.notes;
            if (!notes || notes.length == 0) {
                continue;
            }

            for (var i = 0; i < notes.length; i++) {
                var note = notes[i];
                var position = note.position;
                if (!note.position) {
                    continue;
                }
                var text = isoLine.isoValue;
                var direction = note.direction;

                drawModelText(ctx, position, state.noteFontSize, direction, text);
            }
        }
    },
    GetColor: function(line) {
        if (line.isoColor) {
            return line.isoColor;
        }

        return "#000";
    },

    GLRegions: function(isoLines) {
        if (!isoLines || isoLines.length <= 0) {
            console.log("GLRegions, isoLines is empty");
            return;
        }

        var ctx = this.Canvas;
        ctx.save();

        //  this.BeginLocal();
        for (var index = 0; index < isoLines.length; index++) {
            var line = isoLines[index].isoLine;
            var isoValue = isoLines[index].isoValue;

            if (!line || line.length == 0) {
                continue;
            }

            ctx.fillStyle = this.GetColor(isoLines[index]);

            ctx.beginPath();

            ctx.moveTo(line[0].X, line[0].Y);

            for (var pointIndex = 1; pointIndex < line.length; pointIndex++) {
                var point = line[pointIndex];
                ctx.lineTo(point.X, point.Y);
            }

            ctx.closePath();
            ctx.fill(); // end of one line
        } // end of isoLines

        ctx.restore();
    },

    GLNotesMasks: function(isoLines, fontHeight, fontFamily, xScale, yScale) {
        if (!isoLines) {
            return;
        }

        if (!xScale) {
            xScale = 1;
        }

        if (!yScale) {
            yScale = 1;
        }

        var ctx = this.Canvas;

        // 裁剪整个背景区域
        ctx.beginPath();
        var bound = this.ModelBound();
        var leftBottom = bound.Min;
        var topRight = bound.Max;

        ctx.moveTo(leftBottom.X, leftBottom.Y);
        ctx.lineTo(leftBottom.X, topRight.Y);
        ctx.lineTo(topRight.X, topRight.Y);
        ctx.lineTo(topRight.X, leftBottom.Y);

        ctx.closePath();
        for (var lIndex = 0; lIndex < isoLines.length; lIndex++) {
            var isoLine = isoLines[lIndex];
            var notes = isoLine.notes;
            if (!notes || notes.length == 0) {
                continue;
            }

            for (var i = 0; i < notes.length; i++) {
                var ele = notes[i];

                var direction = ele.direction;
                var position = ele.position;
                var text = isoLine.isoValue + "";
                if (!direction || !position || !text) {
                    continue;
                }

                ctx.save();

                ctx.translate(position.X, position.Y);
                ctx.scale(xScale, yScale);
                ctx.rotate(direction);
                // ctx.font = getFontStyle(fontHeight, fontFamily);
                // var width = ctx.measureText(text).width;
                var size = measureModelText(ctx, text);
                var dx = Math.floor(0.5 * size.w) + 0.5;
                var dy = Math.floor(0.5 * size.h) + 0.5;
                ctx.lineWidth = state.maskLineWidth;

                ctx.moveTo(-dx, dy);
                ctx.lineTo(-dx, -dy);
                ctx.lineTo(dx, -dy);
                ctx.lineTo(dx, dy);
                ctx.closePath();

                ctx.restore();
            }
        }

        ctx.clip("evenodd");
    },

    GLISOLines: function(isoLines, xScale, yScale) {
        if (!isoLines || isoLines.length <= 0) {
            console.log("GLISOLines, isoLines is empty");
            return;
        }

        this.ISOLines = isoLines;

        if (!xScale) {
            xScale = 1;
        }

        if (!yScale) {
            yScale = 1;
        }

        var ctx = this.Canvas;
        ctx.lineWidth = state.lineWidth;
        //this.BeginLocal();
        ctx.beginPath()
        for (var index = 0; index < isoLines.length; index++) {
            var line = isoLines[index].isoLine;

            if (!line || line.length == 0) {
                continue;
            }

            var startPoint = false;
            var lastBound = null;
            for (var pointIndex = 0; pointIndex < line.length; pointIndex++) {
                var point = line[pointIndex];
                if (point.B) {
                    if (startPoint) {
                        ctx.moveTo(point.X, point.Y);
                    }
                    startPoint = false;
                    lastBound = point;
                } else {
                    if (startPoint) {
                        ctx.lineTo(point.X, point.Y);
                    } else {
                        if (lastBound) {
                            ctx.moveTo(lastBound.X, lastBound.Y);
                            ctx.lineTo(point.X, point.Y);
                            lastBound = null;
                        } else {
                            ctx.moveTo(point.X, point.Y);
                        }

                        startPoint = true;
                    }
                }
            }

            var firstP = line[0];
            var lastP = line[line.length - 1]
            if (!firstP.B && !lastP.B) {
                ctx.moveTo(lastP.X, lastP.Y);
                ctx.lineTo(firstP.X, firstP.Y);
            } // end of one line

            ctx.stroke();
        } // end of isoLines
    },

    ModelBound: function(model_bound) {
        if (arguments.length == 0) {
            return this.FModelBound;
        } else {
            this.FModelBound = model_bound;
            if (this.FModelBound.Valid) {
                if (this.FBasePosition.abs() <= 0) {
                    var step_xy = 1000;
                    this.FBasePosition = this.FModelBound.center();
                    this.FBasePosition = TPosition2D(Math.floor(this.FBasePosition.X / step_xy), Math.floor(this.FBasePosition.Y / step_xy)).mul(step_xy);
                }
            } else {
                this.FModelBound.SetBound(-1, -1);
                this.FModelBound.SetBound(1, 1);
                this.FBasePosition = TPosition2D();
            }
            this.FMapBound = this.ComputeMapBound();
        }
    }, //模型范围
    ViewScale: function() {
        if (arguments.length == 0) {
            return this.FMapScale / this.FViewScale;
        } else {
            this.FViewScale = this.FMapScale / arguments[0];
        }
    },
    MapScale: function() {
        if (arguments.length == 0) {
            return this.FMapScale;
        } else {
            this.FMapScale = arguments[0];
        }
    },

    BeginModel: function() {
        console.log("model space");
        this.FMat2D.Identity();
        this.FMat2D.Transform(1, 0, 0, -1, this.FViewCenter.X, this.FViewCenter.Y); //this.Canvas.transform(1,0,0,-1,FViewCenter.X,FViewCenter.Y);
        this.FMat2D.Scale(this.FViewScale * this.ViewResolution, this.FViewScale * this.ViewResolution); //this.Canvas.scale(this.FViewScale*this.ViewResolution, this.FViewScale*this.ViewResolution);
        this.FMat2D.Translate(-this.FMapCenter.X, -this.FMapCenter.Y); //this.Canvas.translate(-this.FMapCenter.X, -this.FMapCenter.Y);
        this.FMat2D.Scale(1 / this.FMapScale, 1 / this.FMapScale) //this.Canvas.scale(1/this.FMapScale, 1/this.FMapScale);
        this.FMat2D.Translate(-this.FBasePosition.X, -this.FBasePosition.Y); //this.Canvas.translate(-this.FBasePosition.X, -this.FBasePosition.Y);
        var ctx = this.Canvas;

        if (arguments[0]) {
            ctx = arguments[0];
        }
        ctx.space = "Model";
        ctx.save();
        ctx.setTransform(this.FMat2D.A00, this.FMat2D.A01, this.FMat2D.A10, this.FMat2D.A11, this.FMat2D.A02, this.FMat2D.A12);
    },
    EndModel: function() {
        var ctx = this.Canvas;

        if (arguments[0]) {
            ctx = arguments[0];
        }
        ctx.space = null;

        ctx.restore();
    },
    BeginLocal: function() { //开始在局部空间绘图
        console.log("local space");

        this.FMat2D.Identity();
        this.FMat2D.Transform(1, 0, 0, -1, this.FViewCenter.X, this.FViewCenter.Y); //this.Canvas.transform(1,0,0,-1,FViewCenter.X,FViewCenter.Y);
        this.FMat2D.Scale(this.FViewScale * this.ViewResolution, this.FViewScale * this.ViewResolution); //this.Canvas.scale(this.FViewScale*this.ViewResolution, this.FViewScale*this.ViewResolution);
        this.FMat2D.Translate(-this.FMapCenter.X, -this.FMapCenter.Y); //this.Canvas.translate(-this.FMapCenter.X, -this.FMapCenter.Y);
        //  this.FMat2D.Scale(1 / this.FMapScale, 1 / this.FMapScale); //this.Canvas.scale(1/this.FMapScale, 1/this.FMapScale);

        var ctx = this.Canvas;

        if (arguments[0]) {
            ctx = arguments[0];
        }
        ctx.space = "Local";

        ctx.save();
        ctx.setTransform(this.FMat2D.A00, this.FMat2D.A01, this.FMat2D.A10, this.FMat2D.A11, this.FMat2D.A02, this.FMat2D.A12);
    },
    EndLocal: function() {
        var ctx = this.Canvas;

        if (arguments[0]) {
            ctx = arguments[0];
        }
        ctx.space = null;

        ctx.restore();
    },
    BeginMap: function() { //开始在地图空间绘图
        console.log("map space");

        this.FMat2D.Identity();
        this.FMat2D.Transform(1, 0, 0, -1, this.FViewCenter.X, this.FViewCenter.Y); //this.Canvas.transform(1,0,0,-1,FViewCenter.X,FViewCenter.Y);
        this.FMat2D.Scale(this.FViewScale * this.ViewResolution, this.FViewScale * this.ViewResolution); //this.Canvas.scale(this.FViewScale*this.ViewResolution, this.FViewScale*this.ViewResolution);
        this.FMat2D.Translate(-this.FMapCenter.X, -this.FMapCenter.Y);

        var ctx = this.Canvas;

        if (arguments[0]) {
            ctx = arguments[0];
        }
        ctx.space = "Map";

        ctx.save();
        ctx.setTransform(this.FMat2D.A00, this.FMat2D.A01, this.FMat2D.A10, this.FMat2D.A11, this.FMat2D.A02, this.FMat2D.A12);
    },
    EndMap: function() {
        var ctx = this.Canvas;

        if (arguments[0]) {
            ctx = arguments[0];
        }
        ctx.space = null;

        ctx.restore();
    },
    BeginView: function() { //开始在视图空间绘图
        console.log("View space");

        this.FMat2D.Identity();
        this.FMat2D.Transform(1, 0, 0, -1, this.FViewCenter.X, this.FViewCenter.Y); //this.Canvas.transform(1,0,0,-1,FViewCenter.X,FViewCenter.Y);
        var ctx = this.Canvas;

        if (arguments[0]) {
            ctx = arguments[0];
        }
        ctx.space = "View";

        ctx.save();
        ctx.setTransform(this.FMat2D.A00, this.FMat2D.A01, this.FMat2D.A10, this.FMat2D.A11, this.FMat2D.A02, this.FMat2D.A12);
    },
    EndView: function() {
        var ctx = this.Canvas;

        if (arguments[0]) {
            ctx = arguments[0];
        }
        ctx.space = null;

        ctx.restore();
    },
    BeginWin: function() {
        console.log("win space");

        this.FMat2D.Identity();

        var ctx = this.Canvas;

        if (arguments[0]) {
            ctx = arguments[0];
        }
        ctx.space = "Screen";

        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }, //开始在窗口空间绘图
    EndWin: function() {
        var ctx = this.Canvas;

        if (arguments[0]) {
            ctx = arguments[0];
        }
        ctx.space = null;

        ctx.restore();
    },
    // 移动视图
    Move: function() {
        if (arguments.length == 1) {
            return this.DoMove(arguments[0]);
        } else if (arguments.length == 2) {
            return this.DoMove(arguments[1].sub(arguments[0]));
        }
    },

    // 缩放视图
    Zoom: function(position, scale) {
        if (scale != 1) {
            this.DoMoveToCenter(position);
            this.DoZoom(scale);
            this.DoMoveCenterTo(position);

            return true;
        }

        return false;
    }, //中心不动
    ZoomIn: function(position) { //缩小,中心不动
        this.DoMoveToCenter(position);
        this.DoZoom(1.25)
        this.DoMoveCenterTo(position);
    },
    ZoomOut: function(position) { //放大,中心不动
        this.DoMoveToCenter(position);
        this.DoZoom(1 / 1.25)
        this.DoMoveCenterTo(position);
    },
    ZoomRect: function(start, end) { //矩形区域放大
        var rst = false;
        var center = start.add(end).div(2);

        if (center.X != 0 || center.Y != 0) {
            this.DoMoveToCenter(center);
            rst = true;
        }
        var size = TVector2D(Abs(end.X-start.X), Abs(end.Y-start.Y));
        var vrect = this.ViewRect();
        var W = vrect.right - vrect.left - 1,
            H = vrect.bottom - vrect.top - 1;
        if (size.X > 0 && size.Y > 0) {
            var sx = W / size.X,
                sy = H / size.Y;
            if (this.DoZoom(sx < sy ? sx : sy))
                rst = true;
        } else if (size.X > 0) {
            if (this.DoZoom(W / size.X))
                rst = true;
        } else if (size.Y > 0) {
            if (this.DoZoom(H / size.Y))
                rst = true;
        } else {
            this.FViewScale = 1;
            rst = true;
        }
        return rst;
    },
    ZoomExtent: function() {
        if (this.FModelBound.Valid && this.FMapBound.Valid) {
            var rect = this.ViewRect();
            var size = TVector2D(rect.right - rect.left, rect.bottom - rect.top);
            var mapsize = this.View_MeterToPixel(this.FMapBound.size());
            this.FMapCenter = this.FMapBound.center();
            if (mapsize.X > 0 && mapsize.Y > 0) {
                var sx = size.X / mapsize.X,
                    sy = size.Y / mapsize.Y;
                this.FViewScale = 0.95 * (sx < sy ? sx : sy);
            } else if (mapsize.X > 0) {
                this.FViewScale = 0.95 * size.cx / mapsize.X;
            } else if (mapsize.Y > 0) {
                this.FViewScale = 0.95 * size.cy / mapsize.Y;
            } else
                this.FViewScale = 1;
        } else {
            this.FMapCenter.X = this.FMapCenter.Y = 0;
            this.FViewScale = 1;
        }
    }, //缩放至满屏

    //坐标转换
    ScreenToLocal: function(position) {
        return this.ViewToLocal(this.ScreenToView(position));
    },
    LocalToScreen: function(position) {
        return this.ViewToScreen(this.LocalToView(position));
    },
    ScreenToModel: function(position) {
        return this.ViewToModel(this.ScreenToView(position));
    },
    ModelToLocal: function(position) { //模型空间-->局部空间
        return position.sub(this.FBasePosition);
    },
    ModelToScreen: function(position) {
        return this.ViewToScreen(this.ModelToView(position));
    },
    LocalToModel: function(local_position) { //局部空间-->模型空间
        return this.FBasePosition.add(local_position);
    },
    ModelToMap: function(position) { //模型空间-->地图空间
        return this.ModelToLocal(position).div(this.FMapScale);
    },
    ModelToMapVector: function(vector) {
        return vector.div(this.FMapScale);
    },
    MapToModel: function(map_position) { //地图空间-->模型空间
        return this.LocalToModel(map_position.mul(this.FMapScale));
    },
    MapToView: function(map_position) { //地图空间-->视图空间
        return this.View_MeterToPixel(map_position.sub(this.FMapCenter).mul(this.FViewScale));
    },
    ViewToMap: function(view_position) { //视图空间-->地图空间
        return this.View_PixelToMeter(view_position).div(this.FViewScale).add(this.FMapCenter);
    },
    ViewToModel: function(view_position) { //视图空间-->模型空间
        return this.MapToModel(this.ViewToMap(view_position));
    },
    ModelToView: function(position) { //模型空间-->视图空间
        return this.MapToView(this.ModelToMap(position));
    },

    //矢量转换
    ModelToMap_Vector: function(vector) { //模型空间-->地图空间
        return vector.div(this.FMapScale);
    },
    MapToModel_Vector: function(map_vector) { //地图空间-->模型空间
        return map_vector.mul(this.FMapScale);
    },
    MapToView_Vector: function(map_vector) { //地图空间-->视图空间
        return this.View_MeterToPixel(map_vector.mul(this.FViewScale));
    },
    ViewToMap_Vector: function(view_vector) { //视图空间-->地图空间
        return this.View_PixelToMeter(view_vector).div(this.FViewScale);
    },
    ViewToModel_Vector: function(view_vector) { //视图空间-->模型空间
        return this.MapToModel_Vector(this.ViewToMap_Vector(view_vector));
    },
    ModelToView_Vector: function(vector) { //模型空间-->视图空间
        return this.MapToView_Vector(this.ModelToMap_Vector(vector));
    },
    DrawNote: function(str, position, width, height, angle) {
        this.Canvas.translate(-position.X, -position.Y);
        this.Canvas.rotate(angle);
        this.Canvas.scale(width, height);
        this.Canvas.translate(position.X, position.Y);
        this.Canvas.textAlign = "center";
        this.Canvas.textBaseline = "middle";
        this.Canvas.fillText(str, 0, 0);
        //this.Canvas.setTransform();
        this.Canvas.setTransform(this.FMat2D.A00, this.FMat2D.A01, this.FMat2D.A10, this.FMat2D.A11, this.FMat2D.A02, this.FMat2D.A12);
    },
    //计算地图边界
    ComputeMapBound: function() {
        var mapbds = TBound2D();
        if (this.FModelBound.Valid) {
            mapbds.SetBound(this.ModelToMap(this.FModelBound.Min));
            mapbds.SetBound(this.ModelToMap(this.FModelBound.Max));
        }
        return mapbds;
    },

    DoMoveToCenter: function(from) {
        this.DoMove(from.neg());
    },
    DoMoveCenterTo: function(to) {
        this.DoMove(to);
    },
    DoMove: function(move) {
        if (!IsZero(move)) {
            move.Y = -move.Y;
            this.FMapCenter.Sub(this.ViewToMap_Vector(move));
            return true;
        }

        return false;
    },

    DoZoom: function(scale) { //缩放视图,
        if (scale !== 1) {
            this.FViewScale *= scale;
            if (this.FViewScale < this.FMinZoom)
                this.FViewScale = this.FMinZoom;
            else if (this.FViewScale > this.FMaxZoom)
                this.FViewScale = this.FMaxZoom;
            return true;
        }
        return false;
    },
    FillText: function(point, offset, text, rotate) {
        var ctx = this.FGLView.OutsideLayer;

        ctx.save();
        ctx.translate(point.X + offset.X, point.Y + offset.Y);
        if (rotate) {
            ctx.rotate(rotate);
        }
        ctx.fillText(text, 0, 0);

        ctx.restore();
    },
    DrawCanvasBorder: function() {
        var ctx = this.FGLView.OutsideLayer;

        this.BeginWin();
        var width = ctx.canvas.clientWidth;
        var height = ctx.canvas.clientHeight;

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(width, 0);
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        ctx.stroke();

        var offset = 20.5;
        ctx.beginPath();
        ctx.moveTo(offset, offset);
        ctx.lineTo(width - offset, 0 + offset);
        ctx.lineTo(width - offset, height - offset);
        ctx.lineTo(offset, height - offset);
        ctx.closePath();
        ctx.stroke();

        this.EndWin();

    },
    DrawViewGridXY: function(viewdelta) {
        var ctx = this.FGLView.OutsideLayer;
        var offset = 20.5;

        if (this.FViewRect.width() > 0 && this.FViewRect.height() > 0) {
            var p = TPosition2D();
            var bound2d = TBound2D();
            var p = this.ScreenToModel(TPosition2D());
            if (p) {
                bound2d.SetBound(p);
            }

            p = this.ScreenToModel(TPosition2D(this.FViewRect.width(), 0));

            if (p) {
                bound2d.SetBound(p);
            }

            p = this.ScreenToModel(TPosition2D(0, this.FViewRect.height()));
            if (p) {
                bound2d.SetBound(p);
            }
            p = this.ScreenToModel(TPosition2D(this.FViewRect.width(), this.FViewRect.height()))

            if (p) {
                bound2d.SetBound(p);
            }

            if (bound2d.Valid) {
                var v = TVector2D();
                // var vr = TViewRect();
                var str = "";
                var p1 = TPosition2D(),
                    p2 = TPosition2D();

                var t, direction, length;
                var modeldelta = BestNumber(viewdelta * this.ViewScale());
                if (modeldelta < 1)
                    modeldelta = 1;
                var rect = TRect();
                rect.left = Ceil(bound2d.Min.X / modeldelta);
                rect.top = Ceil(bound2d.Min.Y / modeldelta);
                rect.right = Floor(bound2d.Max.X / modeldelta);
                rect.bottom = Floor(bound2d.Max.Y / modeldelta);

                ctx.save();
                ctx.textAlign = "center";
                ctx.beginPath();
                var strokeLength = 8;
                for (var x = rect.left; x <= rect.right; ++x) {
                    t = x * modeldelta;
                    var text = t + "";
                    var point1 = this.ModelToScreen(TPosition2D(t, bound2d.Min.Y));
                    point1 = point1.add(TPosition2D(offset, offset));

                    ctx.moveTo(point1.X, point1.Y);
                    ctx.lineTo(point1.X, point1.Y + strokeLength)

                    this.FillText(point1, {
                        X: 0,
                        Y: -3 + offset
                    }, text);

                    var point2 = this.ModelToScreen(TPosition2D(t, bound2d.Max.Y));
                    point2 = point2.add(TPosition2D(offset, offset));
                    ctx.moveTo(point2.X, point2.Y);
                    ctx.lineTo(point2.X, point2.Y - strokeLength);

                    this.FillText(point2, {
                        X: 0,
                        Y: strokeLength - offset + 3
                    }, text);
                }
                for (var y = rect.top; y <= rect.bottom; ++y) {
                    t = y * modeldelta;
                    var text = t + "";
                    var point1 = this.ModelToScreen(TPosition2D(bound2d.Min.X, t));
                    point1 = point1.add(TPosition2D(offset, offset));
                    ctx.moveTo(point1.X, point1.Y);
                    ctx.lineTo(point1.X - strokeLength, point1.Y);
                    this.FillText(point1, {
                        X: 3 - offset,
                        Y: 0
                    }, text, Math.PI / 2);

                    var point2 = this.ModelToScreen(TPosition2D(bound2d.Max.X, t));
                    point2 = point2.add(TPosition2D(offset, offset));

                    ctx.moveTo(point2.X, point2.Y);
                    ctx.lineTo(point2.X + strokeLength, point2.Y);

                    this.FillText(point2, {
                        X: offset - 3,
                        Y: 0
                    }, text, -Math.PI / 2);
                }

                ctx.stroke();
                ctx.restore();
                // this.EndView();
            }
        }
    },
    drawBiliChi: function() {
        var ctx = this.Canvas;
        var view = this.FGLView;
        view.FGLBase.BeginWin();

        ctx.beginPath();

        var vector = TVector2D(0.01, 0.01);
        vector = view.FGLBase.MapToView_Vector(vector);

        ctx.moveTo(10, 10);
        ctx.lineTo(10, 20);
        ctx.lineTo(10 + vector.X, 20);
        ctx.lineTo(10 + vector.X, 10);
        ctx.stroke();

        view.FGLBase.EndWin();

    }
}
