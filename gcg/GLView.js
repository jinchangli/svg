
function TGLView() {
    this.constructor.apply(this, arguments);
}

TGLView.prototype = {
    Canvas: null,
    FGLBase: null,
    FCursorOld: null,
    FCapturedPosition: null,
    FMouseOperation: null,
    FMouseOperation0: null,
    FMouseLeftButtonDown: null,
    FMouseMiddleButtonDown: null,
    FMouseRightButtonDown: null,
    FDoubleClicked: null,
    FTemporaryFlag: null,
    FCapturedFlag: null,
    FEnableCapture: null,
    FSmoothRender: null,
    FNeedDeleteGL: null,
    FValidFlag: null,
    FViewChanged: null,
    FNeedDraw: null,
    AllowCapture: null,

    MouseDownPosition: null,
    MouseDownMapPosition: null,
    MouseDownModelPosition: null,
    MouseMovePosition: null,
    MouseMoveMapPosition: null,
    MouseMoveModelPosition: null,
    MinMove: null,

    LayerCtx: null,
    PointSelectLayerCtx: null,
    SelectedPoints: null,

    constructor: function(canvas) {
        with(this) {
            PointsWithMarks = [];
            Canvas = canvas;
            FGLBase = new TGLBase(canvas, this);
            MouseDownPosition = TPosition2D();
            MouseDownMapPosition = TPosition2D();
            MouseDownModelPosition = TPosition2D();
            MouseMovePosition = TPosition2D();
            MouseMoveMapPosition = TPosition2D();
            MouseMoveModelPosition = TPosition2D();
            FCapturedPosition = TPosition2D();
            MinMove = 3;

            FMouseLeftButtonDown = false;
            FMouseMiddleButtonDown = false;
            FMouseRightButtonDown = false;
            FDoubleClicked = false;
            FTemporaryFlag = false;
            FCapturedFlag = false;
            FEnableCapture = true;
            FSmoothRender = false;
            FNeedDeleteGL = false;
            FValidFlag = false;
            FNeedDraw = false;
            FViewChanged = false;
            AllowCapture = false;

            SelectedPoints = [];

        }

        this.CreateLayer();
    },
    destruction: function(params) {
        this.FGLBase = null;
    },
    CreateLayer: function() {
        var ctx = this.Canvas;

        var hoverCanvas = $('<canvas class="clayer" width="' + $(ctx.canvas).width() + '" height="' + $(ctx.canvas).height() + '"></canvas>"').insertAfter($(ctx.canvas));
        this.LayerCtx = hoverCanvas[0].getContext("2d");

        var PointSelectCanvas = $('<canvas class="clayer pointSelect" width="' + $(ctx.canvas).width() + '" height="' + $(ctx.canvas).height() + '"></canvas>"').insertAfter(hoverCanvas);
        this.PointSelectLayerCtx = PointSelectCanvas[0].getContext("2d");
    },
    ClearOverlayers: function() {
        var ctx = this.Canvas;
        var size = ctx.canvas.getBoundingClientRect();

        this.LayerCtx.clearRect(0, 0, size.width, size.height);
        this.PointSelectLayerCtx.clearRect(0, 0, size.width, size.height);

        this.SelectedPoints = [];
    },
    ClearHoverLayer: function() {
        var ctx = this.Canvas;
        var size = ctx.canvas.getBoundingClientRect();

        this.LayerCtx.clearRect(0, 0, size.width, size.height);
    },
    ClearView: function() {
        var ctx = this.Canvas;
        var size = ctx.canvas.getBoundingClientRect();
        ctx.clearRect(0, 0, size.width, size.height);

        this.LayerCtx.clearRect(0, 0, size.width, size.height);

        this.SelectedPoints = [];
    },
    //事件
    OnInitializeView: null, //OnInitializeView
    OnMousePosition: null, //OnMousePosition(position)
    OnViewMoved: function() {
        this.Invalidate();
    },
    OnViewZoomed: function() {
        this.Invalidate();
    },
    OnPaint: function() {

    }, //OnGLPaint(glbase)
    OnRedrawView: null, //OnRedrawView(redraw_all)

    MouseOperation: function(operation) {
        if (arguments.length >= 1) {
            if (operation != this.FMouseOperation) {
                if (operation) {
                    if (operation.FGLView == this) {
                        if (operation.Temporary) {
                            this.EndTemporaryOperation();
                            this.BeginTemporaryOperation();
                            this.FMouseOperation = operation;
                            //  //this.SetCursor(FMouseOperation.Cursor);
                            this.FMouseOperation.MouseBegin();
                        } else {
                            this.FCapturedFlag = false;
                            if (this.FMouseOperation) {
                                this.FMouseOperation.MouseEnd();
                            }
                            this.FMouseOperation = operation;
                            ////this.SetCursor(FMouseOperation.Cursor);
                            this.FMouseOperation.MouseBegin();
                        }
                    }
                } else {
                    this.FCapturedFlag = false;
                    if (this.FMouseOperation)
                        this.FMouseOperation.MouseEnd();

                    this.FMouseOperation = null;
                    ////this.SetCursor(Cursor0);
                }
            }
        } else {
            return this.FMouseOperation;
        }
    },

    MinZoom: function(minzoom) {
        if (arguments.length == 0) {
            return this.FGLBase ? this.FGLBase.MinZoom() : 1.00;
        } else if (this.FGLBase) {
            this.FGLBase.MinZoom(minzoom);
        }

    },
    MaxZoom: function(maxzoom) {
        if (arguments.length == 0) {
            return this.FGLBase ? this.FGLBase.MaxZoom() : 1.00;
        } else if (this.FGLBase) {
            this.FGLBase.MaxZoom(maxzoom);
        }

    },
    MousePosition: function(position) {
        if (this.OnMousePosition)
            this.OnMousePosition(position);
    },
    ViewMoved: function() {
        if (this.OnViewMoved)
            this.OnViewMoved();
    },
    ViewZoomed: function() {
        if (this.OnViewZoomed)
            this.OnViewZoomed();
    },

    ViewToScreen: function(point2d) {
        if (this.FGLBase) {
            return this.FGLBase.ViewToScreen(point2d);
        } else {
            return this.Point2DToPoint(point2d);
        }
    },
    ScreenToView: function(point) {
        return this.FGLBase ? this.FGLBase.ScreenToView(point) : this.PointToPoint2D(point);
    },

    CanEndTemporaryOperation: function() {
        return this.FTemporaryFlag;
    },
    EndTemporaryOperation: function() {
        if (this.FTemporaryFlag) {
            if (this.FMouseOperation)
                this.FMouseOperation.MouseEnd();
            this.FMouseOperation = this.FMouseOperation0;
            //  //this.SetCursor(this.FMouseOperation ? this.FMouseOperation.Cursor : 0);
            this.FTemporaryFlag = false;
            this.FMouseOperation0 = null;

        }
    },
    EndMouseOperation: function() {
        this.MouseOperation(null);
    },

    ZoomViewExtent: function() {
        if (this.FGLBase) {
            this.FGLBase.ZoomExtent();
            this.ViewChanged(true);
            this.Invalidate();
        }
        this.ViewZoomed();
    },
    ZoomViewIn: function() {
        if (this.FGLBase && this.FGLBase.ZoomIn(TPosition2D())) {
            this.ViewChanged(true);
            this.Invalidate();
        }
    },
    ZoomViewOut: function() {
        if (this.FGLBase && this.FGLBase.ZoomOut(TPosition2D())) {
            this.ViewChanged(true);
            this.Invalidate();
        }
    },

    MouseOK: function(state) {
        if (this.FMouseOperation)
            this.FMouseOperation.MouseOK(state);
    },
    MouseCancel: function(state) {
        if (this.FMouseOperation)
            this.FMouseOperation.MouseCancel(state);
    },
    MouseUndo: function(state) {
        if (this.FMouseOperation)
            this.FMouseOperation.MouseUndo(state);
    },
    MouseInsert: function(state) {
        if (this.FMouseOperation)
            this.FMouseOperation.MouseInsert(state);
    },
    MouseDelete: function(state) {
        if (this.FMouseOperation)
            this.FMouseOperation.MouseDelete(state);
    },
    MouseCommand: function(command, state) {
        if (this.FMouseOperation)
            this.FMouseOperation.MouseCommand(command, state);
    },

    MoveViewMouseMove: function(keys, position, downflag) {
        if (downflag)
            this.ProcessMoveView(this.MouseMovePosition, position);
    },
    ZoomInMouseUp: function(keys, position) {
        if (this.FGLBase && this.FGLBase.ZoomIn(center)) {
            this.ViewChanged(true);
            this.Invalidate();
        }
        this.ViewZoomed();
    },
    ZoomOutMouseUp: function(keys, position) {
        if (this.FGLBase && this.FGLBase.ZoomOut(position)) {
            this.ViewChanged(true);
            this.Invalidate();
        }
        this.ViewZoomed();
    },
    ZoomRectMouseUp: function(keys, position) {
        if (position.sub(this.MouseDownPosition).abs() >= 10)
            this.ZoomViewRect(this.TInterval2D(this.MouseDownPosition, position));
    },
    ZoomViewMouseMove: function(keys, position, downflag) {
        if (downflag)
            this.ProcessZoomView(this.MouseMovePosition, position, downflag);
    },

    MouseOperation0: function(operation) {
        if (operation != this.FMouseOperation) {
            if (operation) {
                if (operation.FGLView == this) {
                    if (operation.Temporary) {
                        this.EndTemporaryOperation();
                        this.BeginTemporaryOperation();
                        this.FMouseOperation = operation;
                        ////this.SetCursor(this.FMouseOperation.Cursor);
                    } else {
                        this.FCapturedFlag = false;
                        this.FMouseOperation = operation;
                        //  //this.SetCursor(this.FMouseOperation.Cursor);
                    }
                }
            } else {
                this.FCapturedFlag = false;
                this.FMouseOperation = null;
                //  //this.SetCursor(Cursor0);
            }
        }
    },
    EndTemporaryOperation0: function() {
        if (this.FTemporaryFlag) {
            this.FMouseOperation = this.FMouseOperation0;
            ////this.SetCursor(this.FMouseOperation ? this.FMouseOperation.Cursor : 0);
            this.FTemporaryFlag = false;
            this.FMouseOperation0 = null;
        }
    },
    EndMouseOperation0: function() {
        MouseOperation0(null);
    },

    Paint: function(dc) {
        if (this.OnPaint)
            this.OnPaint(dc);
    },

    Paint2: function(dc) {
        if (this.OnPaint2)
            this.OnPaint2(dc);
    },
    ProcessMoveView: function(from, to, flag) {
        if (arguments.length <= 2) {
            flag = false;
        }
        if (!from.is_eql(to)) {
            this.MoveView(flag ? from.add(to).mul(0.5) : from, to); // TBD: TPosition2D, add, divide
            this.Paint();
        }
    },

    BeginTemporaryOperation: function() {
        this.FCapturedFlag = false;
        if (!this.FTemporaryFlag) {
            this.FMouseOperation0 = this.FMouseOperation;
            this.FTemporaryFlag = true;
        }
        this.FMouseOperation = null;
        ////this.SetCursor(0);
    },

    ProcessZoomView: function(from, to, flag) {
        var d = to.Y - from.Y;
        if (d !== 0) {
            this.ZoomView(Exp(d / (flag ? 200 : 100)));
            this.Paint();
        }
    },

    GenCapturePosition: function(keys, x, y) {
        // // (x, y) is in screen space
        // if (this.FCapturedFlag) {
        //     this.DrawCapturedPoint();
        // }

        var mouse_position = TPosition2D(x, y); //this.ScreenToView(point);

        if (this.AllowCapture && this.FEnableCapture && this.FMouseOperation) {
            this.FCapturedFlag = false;
            var captured_position = this.FMouseOperation.MouseCapture2D(this.FGLBase, mouse_position);

            if (!captured_position) {
                captured_position = this.FMouseOperation.MouseCapture(mouse_position);
            }

            if (captured_position) {
                if (this.FCapturedPosition != null && captured_position.X == this.FCapturedPosition.X && captured_position.Y == this.FCapturedPosition.Y) {
                    this.FCapturedPosition = mouse_position = captured_position;
                } else {
                    this.FCapturedPosition = mouse_position = captured_position;
                    this.DrawCapturedPoint();
                }
                this.FCapturedFlag = true;
            } else {
                if (this.FCapturedPosition) {
                    this.ClearHoverPoint();
                }
            }
        }

        return mouse_position;
    },
    DrawCapturedPoint: function(x, y) {
        if (x == undefined || x == null) {
            x = this.FCapturedPosition.X;
        }

        if (y == undefined || y == null) {
            y = this.FCapturedPosition.Y;
        }

        // 如果这个点已经处于单击选中状态， 那么就忽略hover状态
        // var index = this.IsPointSelected(TPosition2D(x, y));
        // if (index != null) {
        //     return;
        // }

        this.ClearHoverLayer();

        this.SetHighLightPoint(x, y);
    },
    ClearHoverPoint: function(x, y) {
        if ((x == undefined || x == null) && (y == undefined || y == null)) {
            if (this.FCapturedPosition) {
                x = this.FCapturedPosition.X;
                y = this.FCapturedPosition.Y;
            }
        }

        // 如果这个点已经处于单击选中状态， 那么就忽略hover状态
        var index = this.IsPointSelected(TPosition2D(x, y));
        if (index != null) {
            return;
        }

        this.FCapturedFlag = false;
        this.FCapturedPosition = null;
        this.ClearHighLightPoint(x, y);
    },
    ToggleHighLightPoint: function(X, Y, color, show) {
        //var rop2 = this.SetROP2(dc, R2_XORPEN);
        var localP = TPosition2D(X, Y);
        localP = view.FGLBase.LocalToScreen(localP);

        if (!color) {
            color = "red";
        }

        var ctx = this.LayerCtx;
        ctx.save();

        ctx.globalCompositeOperation = "xor";
        //var pen = this.SelectObject(dc, CreatePen(PS_SOLID, 0, 0x00FF0000)); //TBD HPEN
        ctx.beginPath();
        // ctx.rect(p.x - 2, p.y - 2, 5, 5);
        // ctx.fill();
        //ctx.closePath();
        ctx.fillStyle = color;
        ctx.rect(localP.X - 4, localP.Y - 4, 9, 9);
        ctx.fill();

        ctx.restore();
        //this.DeleteObject(SelectObject(pen));
    },
    SetHighLightPoint: function(X, Y, color, layer) {
        var localP = TPosition2D(X, Y);
        localP = view.FGLBase.LocalToScreen(localP);
        if (!color) {
            color = "red";
        }
        var ctx = this.LayerCtx;

        if(layer){
          ctx = layer;
        }

        //var pen = this.SelectObject(dc, CreatePen(PS_SOLID, 0, 0x00FF0000)); //TBD HPEN
        ctx.beginPath();
        // ctx.rect(p.x - 2, p.y - 2, 5, 5);
        // ctx.fill();
        //ctx.closePath();
        ctx.fillStyle = color;
        ctx.rect(localP.X - 4, localP.Y - 4, 9, 9);
        ctx.fill();
    },

    ClearHighLightPoint: function(X, Y, layer) {
        var localP = TPosition2D(X, Y);
        localP = view.FGLBase.LocalToScreen(localP);

        var ctx = this.LayerCtx;
        if(layer){
          ctx = layer;
        }

        ctx.clearRect(localP.X - 4, localP.Y - 4, 9, 9);
    },

    DrawSelectedPoint: function(localP) {
        this.FCapturedFlag = false;
        var index = this.IsPointSelected(localP);
        if (index != null) {

        } else {
            this.SetHighLightPoint(localP.X, localP.Y, "blue", this.PointSelectLayerCtx);
            this.SelectedPoints.push(localP);
        }
    },

    UnDrawSelectedPoint: function(localP) {
        if (this.SelectedPoints == null || this.SelectedPoints.length == 0) {
            return;
        }

        var points = [localP];
        if (localP instanceof Array) {
            points = localP;
        }

        for (var i = 0; i < points.length; i++) {
            var point = points[i];
            var selectedIndex = this.IsPointSelected(localP);
            if (selectedIndex != null) {
                this.ClearHighLightPoint(point.X, point.Y, this.PointSelectLayerCtx);

                this.SelectedPoints.splice(selectedIndex, 1);
            }
        }
    },
    UnDrawAllPoints: function() {
        var points = this.SelectedPoints;

        for (var i = 0; i < points.length; i++) {
            var point = points[i];
            this.ClearHighLightPoint(point.X, point.Y);
        }

        this.SelectedPoints = [];
    },
    IsPointSelected: function(localP) {
        var result = null;
        if (this.SelectedPoints == null || this.SelectedPoints.length == 0) {
            return result;
        }

        for (var i = 0; i < this.SelectedPoints.length; i++) {
            var point = this.SelectedPoints[i];
            if (point.X == localP.X && point.Y == localP.Y) {
                result = i;
                break;
            }
        }

        return result;
    },

    HasSelectedPoint: function() {
        return this.SelectedPoints != null && this.SelectedPoints.length > 0;
    },
    GetLastSelectedPoint: function() {
        var result = null;
        if (this.SelectedPoints == null || this.SelectedPoints.length == 0) {
            return result;
        }

        result = this.SelectedPoints[this.SelectedPoints.length - 1];
        return result;
    },
    ProcessMouseDown0: function(event, position) {
        var flags = GetMouseKeys(event);
        if (!this.FMouseLeftButtonDown && !this.FMouseMiddleButtonDown && !this.FMouseRightButtonDown) {
            //  this.SetCapture(Handle);
            this.MouseDownPosition = position;
            this.MouseDownMapPosition = this.ViewToMap(this.MouseDownPosition);
            this.MouseDownModelPosition = this.MapToModel(this.MouseDownMapPosition);
            this.MouseMovePosition = this.MouseDownPosition;
            this.MouseMoveMapPosition = this.ViewToMap(this.MouseMovePosition);
            this.MouseMoveModelPosition = this.MapToModel(this.MouseMoveMapPosition);
            if (flags.right) {
                this.FCursorOld = this.GetCursor();
                this.FMouseRightButtonDown = true;
                this.FEnableCapture = false;
                // if (!flags.left && !flags.middle) {
                //     var flag = (flags.shift ? 1 : 0) + (flags.ctrl ? 2 : 0) + (flags.alt ? 4 : 0);
                //     if (flag == 0)
                //         //this.SetCursor(Cursor_MoveView);
                //     else if (flag == 1)
                //         //this.SetCursor(Cursor_ZoomView);
                //     else if (flag == 2)
                //         //this.SetCursor(Cursor_Rotate);
                // }
                // else if (flags.left)
                //     //this.SetCursor(Cursor_ZoomView);
                // else if (flags.middle)
                //     //this.SetCursor(Cursor_MoveView);
                // else
                //     //this.SetCursor(Cursor_Rotate);
            } else if (flags.middle) {
                this.FCursorOld = this.GetCursor();
                this.FMouseMiddleButtonDown = true;
                this.FEnableCapture = false;
                //this.SetCursor(Cursor_Rotate);
            } else {
                // if (flags.middle && flags.right)
                //     //this.SetCursor(Cursor_Rotate);
                // else if (flags.right)
                //     //this.SetCursor(Cursor_ZoomView);
                // else
                return true;
            }
        }
        return false;

    },
    GetCursor: function() {

    },
    ProcessMouseMove0: function(keys, position) {
        var flags = GetMouseKeys(keys);
        //  console.log("flags.left ="+ flags.left);
        if (this.FMouseRightButtonDown) {
            if (!flags.left && !flags.middle) {
                var flag = (flags.shift ? 1 : 0) + (flags.ctrl ? 2 : 0) + (flags.alt ? 4 : 0);
                if (flag == 0) {
                    //this.SetCursor(Cursor_MoveView);
                    this.MoveViewMouseMove(keys, position, true);
                } else if (flag == 1) {
                    //this.SetCursor(Cursor_ZoomView);
                    this.ZoomViewMouseMove(keys, position, true);
                }
            } else if (flags.left) {
                //this.SetCursor(Cursor_ZoomView);
                this.ZoomViewMouseMove(keys, position, true);
            } else if (flags.middle) {
                //this.SetCursor(Cursor_MoveView);
                this.MoveViewMouseMove(keys, position, true);
            }
        } else if (this.FMouseLeftButtonDown) {
            if (flags.right) {
                //this.SetCursor(Cursor_ZoomView);
                this.ZoomViewMouseMove(keys, position, true);
            } else
                return true;
        } else {
            return true;
        }

        this.MouseMovePosition = position;
        this.MouseMoveMapPosition = this.ViewToMap(this.MouseMovePosition);
        this.MouseMoveModelPosition = this.MapToModel(this.MouseMoveMapPosition);
        return false;

    },
    ProcessMouseUp0: function(keys, position) {
        var flags = GetMouseKeys(keys);
        if ((this.FMouseLeftButtonDown && flags.left ? 1 : 0) + (this.FMouseMiddleButtonDown && flags.middle ? 1 : 0) + (this.FMouseRightButtonDown && flags.right ? 1 : 0) == 1) {
            if (this.FMouseMiddleButtonDown) {
                if (this.FMouseOperation && position.sub(MouseDownPosition).abs() >= 1)
                    this.ViewRotated();
                ////this.SetCursor(FCursorOld);
                this.FMouseMiddleButtonDown = false;
                this.FEnableCapture = true;

            } else if (this.FMouseRightButtonDown) {
                if (position.sub(this.MouseDownPosition).abs() < 3) {
                    if (this.FMouseOperation) {
                        this.FMouseOperation.GetPopupMenu(keys, position);
                    }

                    this.EndTemporaryOperation();
                } else {
                    this.ViewMoved();
                }
                //  //this.SetCursor(this.FCursorOld);
                this.FMouseRightButtonDown = false;
                this.FEnableCapture = true;
                return true;


            } else {
                this.FMouseLeftButtonDown = false;
                return true;
            }
            //  this.ReleaseCapture();
        }
        return false;
    },

    ProcessMouseDown: function(keys, position) {
        if (this.FMouseOperation)
            this.FMouseOperation.MouseDown(keys, position);
        this.FMouseLeftButtonDown = true;
    },
    ProcessMouseMove: function(keys, position) {
        if (this.FMouseOperation) {
            var moveOffset = this.MouseMovePosition.sub(position).abs();
            if (moveOffset >= this.MinMove)
                this.FMouseOperation.MouseMove(keys, position, this.FMouseLeftButtonDown);
            else
                return;
        }
        this.MouseMovePosition = position;
        this.MouseMoveMapPosition = this.ViewToMap(this.MouseMovePosition);
        this.MouseMoveModelPosition = this.MapToModel(this.MouseMoveMapPosition);
    },
    ProcessMouseUp: function(keys, position) {
        //this.ReleaseCapture();
        this.FMouseLeftButtonDown = false;
        if (this.FMouseOperation)
            this.FMouseOperation.MouseUp(keys, position);
    },

    MoveView: function(from, to) {
        if (this.FGLBase && this.FGLBase.Move(from, to)) {
            this.ViewChanged(true);
            this.Invalidate();
        }
        this.ViewMoved();
    },
    ZoomView: function(position, scale) {
        if (arguments.length == 1) {
            if (this.FGLBase && this.FGLBase.Zoom(TPosition2D(), scale)) {
                this.ViewChanged(true);
                this.Invalidate();
            }
            this.ViewZoomed();
        } else if (arguments.length == 2) {
            if (this.FGLBase && this.FGLBase.Zoom(position, scale)) {
                this.ViewChanged(true);
                this.Invalidate();
            }
            this.ViewZoomed();
        }
    },
    ZoomViewRect: function(rect) {
        if (this.FGLBase && this.FGLBase.ZoomRect(rect, FIdentityXY())) {
            this.ViewChanged(true);
            this.Invalidate();
        }
        this.ViewZoomed();
    },
    InitializeView: function() {
        if (this.OnInitializeView)
            this.OnInitializeView();
    },

    WMMouseDown: function(keys, x, y) {
        if (!this.FDoubleClicked) {
            var position = TPosition2D(x, y);
            var screenPoition = TPosition2D(x, y);

            position = this.FGLBase.ScreenToLocal(position);

            if (this.ProcessMouseDown0(keys, screenPoition)) {
                this.ProcessMouseDown(keys, this.GenCapturePosition(keys, position.X, position.Y));
                if (this.FMouseOperation && this.FMouseLeftButtonDown && this.FMouseOperation.Paint2NeedDown)
                    this.FMouseOperation.Paint2();
            }
        } else {
            this.FDoubleClicked = false;
            return;
        }
    },

    WMMouseMove: function(keys, x, y) {
        var position = TPosition2D(x, y);
        var screenPoition = TPosition2D(x, y);

        position = this.FGLBase.ScreenToLocal(position);
        //  var dc = GetDC(Handle);
        if (this.ProcessMouseMove0(keys, screenPoition)) {
            if (this.FMouseOperation && (!this.FMouseOperation.Paint2NeedDown || this.FMouseLeftButtonDown))
                this.FMouseOperation.Paint2();
            this.Paint2();
            position = this.GenCapturePosition(keys, position.X, position.Y);
            this.ProcessMouseMove(keys, position);
            this.Paint2();
            if (this.FMouseOperation && (!this.FMouseOperation.Paint2NeedDown || this.FMouseLeftButtonDown))
                this.FMouseOperation.Paint2();
        }

        this.MousePosition(position);
    },
    WMMouseUp: function(keys, x, y) {
        var position = TPosition2D(x, y);
        var screenPoition = TPosition2D(x, y);
        position = this.FGLBase.ScreenToLocal(position);

        if (this.ProcessMouseUp0(keys, screenPoition)) {
            if (this.FMouseOperation && this.FMouseLeftButtonDown && this.FMouseOperation.Paint2NeedDown())
                this.FMouseOperation.Paint2();
            this.ProcessMouseUp(keys, this.GenCapturePosition(keys, position.X, position.Y));
        }
        //  this.ReleaseDC(Handle, dc);
        this.FDoubleClicked = false;
    },
    WMMouseWheel: function(event, wheeldelta, x, y) {
        if (this.FGLBase) {
            var flags = GetMouseKeys(event);
            var op = (flags.shift ? 1 : 0) + (flags.alt ? -1 : 0);
            var wheel = Exp(wheel_delta * (op > 0 ? 2.0 : op < 0 ? 0.5 : 1.0) / 600.0);
            if (this.FGLBase.Zoom(TPosition2D(), wheel)) {
                this.ViewChanged(true);
                this.Invalidate();
            }
        }
    },
    WMDblClick: function(keys, x, y) {
        this.FDoubleClicked = true;

        if (!this.FMouseOperation) {
            return;
        }

        var flags = GetMouseKeys(event);
        if (!flags.left) {
            return;
        }
        var position = TPosition2D(x, y);
        position = this.FGLBase.ScreenToLocal(position);
        //var nearestPosition = this.GenCapturePosition(keys, position.X, position.Y);

            this.FMouseOperation.MouseDbClick(position);

    },
    WMKeyDown: function(key, nkeys) {
        this.OnKey(key, nkeys, -1);
    },
    WMKeyUp: function(key, nkeys) {
        this.OnKey(key, nkeys, 1);
    },

    OnKey: function(key, keys, state /*<0按下:null,>0抬起*/ ) {
        if (state > 0) {
            switch (key) {
                case 13: //TBD, Key definition
                    this.MouseOK(0);
                    break;
                case 27:
                    this.MouseCancel(0);
                    break;
                case 8:
                    this.MouseUndo(0);
                    break;
                case 45:
                    this.MouseInsert(0);
                    break;
                case 46:
                    this.MouseDelete(0);
                    break;
            }
        }
    },

    GLBase: function(glbase) {
        if (arguments.length == 0) {
            return this.FGLBase;
        } else {
            if (this.FGLBase != glbase) {
                if ((this.FGLBase = glbase) != null) {
                    var rect;
                    if (this.GetClientRect(Handle, rect)) {
                        if (rect.right > rect.left && rect.bottom > rect.top)
                            this.FGLBase.ViewRect(rect);
                    }
                    this.NeedDraw(true);
                    this.Invalidate();
                }
            }
        }
    },

    ModelBound: function(bds) {
        if (arguments.length == 0) {
            return this.FGLBase ? this.FGLBase.ModelBound() : this.TBound2D();
        } else if (this.FGLBase) {
            this.FGLBase.ModelBound(bds);
            this.NeedDraw(true);
            this.Invalidate();
        }
    },

    GLPaint: function(glbase) {
        if (this.OnGLPaint)
            this.OnGLPaint(glbase);
    },

    RedrawView: function(redraw_all) {
        if (this.OnRedrawView)
            this.OnRedrawView(redraw_all);
    },
    DrawView: function() {
        if (this.FGLBase) {
            this.GLPaint(glview);
        }
        this.FNeedDraw = false;
        this.FViewChanged = false;
        var flag = this.FMouseOperation && (!this.FMouseOperation.Paint2NeedDown || this.FMouseLeftButtonDown);
        if (this.FMouseOperation0 || flag || this.FCapturedFlag) {
            this.Paint();
            this.Paint2();
            if (this.FMouseOperation0)
                this.FMouseOperation0.Paint();
            if (this.FMouseOperation)
                this.FMouseOperation.Paint();
            if (flag)
                this.FMouseOperation.Paint2();
            if (this.FCapturedFlag)
                this.DrawCapturedPoint();
        }
    },
    //    DrawViewOnPaint: function() {
    //        var ps = PAINTSTRUCT();
    //        var dc = BeginPaint(Handle, ps);
    //        SetBkColor(dc, Color);
    //        this.DrawView(dc);
    //        EndPaint(Handle, ps);
    //    },
    //    DrawViewDirectly: function() {
    //        var dc = GetDC(Handle);
    //        this.DrawView(dc);
    //        ReleaseDC(Handle, dc);
    //    },
    OnMessage: function(msg, wparam, lparam) {
        //       switch (msg) {
        //           case WM_PAINT:
        //               this.FCapturedFlag = false;
        //               if (this.FGLBase)
        //                   this.DrawViewOnPaint();
        //               break;
        //           case WM_SIZE:
        //               if (this.FGLBase) {
        //                   var rect;
        //                   if (GetClientRect(Handle, rect)) {
        //                       if (rect.right > rect.left && rect.bottom > rect.top) {
        //                           this.FGLBase.ViewRect(rect);
        //                           if (!FValidFlag()) {
        //                               FValidFlag(true);
        //                               InitializeView();
        //                           }
        //                       }
        //                   }
        //               }
        //               this.ViewChanged(true);
        //               this.NeedDraw(true);
        //               this.Invalidate();
        //               break;
        //           case WM_DISPLAYCHANGE:
        //               if (this.FGLBase)
        //                   this.FGLBase.ViewResolutionDPI(TVector2D(GetDeviceCaps(this.FGLBase.DC(), LOGPIXELSX), GetDeviceCaps(this.FGLBase.DC(), LOGPIXELSY)));
        //               break;
        //   case WM_MOUSEMOVE:
        //   WMMouseMove(GenMouseKeys(wparam),lparam,lparam);
        //   break;
        // case WM_MOUSEWHEEL:
        //   WMMouseWheel(GenMouseKeys(wparam),wparam,lparam,lparam);
        //   break;
        // case WM_LBUTTONDOWN:
        //   WMMouseDown(mbLeft,GenMouseKeys(wparam),lparam,lparam);
        //   break;
        // case WM_LBUTTONUP:
        //   WMMouseUp(mbLeft,GenMouseKeys(wparam),lparam,lparam);
        //   break;
        // case WM_MBUTTONDOWN:
        //   WMMouseDown(mbMiddle,GenMouseKeys(wparam),lparam,lparam);
        //   break;
        // case WM_MBUTTONUP:
        //   WMMouseUp(mbMiddle,GenMouseKeys(wparam),lparam,lparam);
        //   break;
        // case WM_RBUTTONDOWN:
        //   WMMouseDown(mbRight,GenMouseKeys(wparam),lparam,lparam);
        //   break;
        // case WM_RBUTTONUP:
        //   WMMouseUp(mbRight,GenMouseKeys(wparam),lparam,lparam);
        //   break;
        // case WM_LBUTTONDBLCLK:
        // case WM_MBUTTONDBLCLK:
        // case WM_RBUTTONDBLCLK:
        //   WMDblClick(GenMouseKeys(LOWORD(wparam)));
        //   break;
        // case WM_KEYDOWN:
        //   WMKeyDown((int)wparam,LOWORD(lparam));
        //   break;
        // case WM_KEYUP:
        //   WMKeyUp((int)wparam,LOWORD(lparam));
        //   break;
        // case WM_SIZE:
        //   Invalidate();
        //   break;
        //
        //       }
        //       return TGLViewBase.OnMessage(msg, wparam, lparam);
    },
    MapToView: function(mapposition) {
        return this.FGLBase.MapToView(mapposition);
    },
    ViewToMap: function(viewposition) {
        return this.FGLBase.ViewToMap(viewposition);
    },
    ModelToLocal: function(position) {
        return this.FGLBase.ModelToLocal(position);
    },
    LocalToModel: function(localposition) {
        return this.FGLBase.LocalToModel(localposition);
    },
    ModelToMap: function(position) {
        return this.FGLBase.ModelToMap(position);
    },
    MapToModel: function(mapposition) {
        return this.FGLBase.MapToModel(mapposition);
    },
    ViewToModel: function(viewposition) {
        return this.FGLBase.ViewToModel(viewposition);
    },
    ModelToView: function(position) {
        return this.FGLBase.ModelToView(position);
    },
    ViewScale: function(view_scale) {
        if (arguments.length == 0) {
            if (this.FGLBase)
                return this.FGLBase.ViewScale();
            return TVector2D(1, 1);
        } else if (this.FGLBase)
            this.FGLBase.ViewScale(view_scale);
    },
    MapScale: function(mapscale) {
        if (arguments.length == 0) {
            if (this.FGLBase)
                return this.FGLBase.MapScale();
            return 1;
        }
        if (this.FGLBase) {
            this.FGLBase.MapScale(mapscale);
            NeedDraw(true);
            Invalidate();
        }
    },
    BasePosition: function() {
        if (this.FGLBase)
            return this.FGLBase.BasePosition();
        return TPosition2D();
    },
    NeedDraw: function(need_draw) {
        if (arguments.length == 0) {
            return this.FNeedDraw;
        } else if (need_draw) {
            this.FNeedDraw = true;
            this.RedrawView(true);
        }
    },
    ViewChanged: function(changed) {
        if (changed) {
            this.FViewChanged = true;
            this.RedrawView(false);
        }
    },
    Invalidate: function() {

    }
}
