function TGLView() {
    if (this == window) {
        var obj = new TGLView();
        obj.constructor.apply(obj, arguments);
        return v;
    }
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
    FNeedDraw: null,
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

    constructor: function (canvas) {
        Canvas = canvas;
        FGLBase = TGLBase();
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
        FEnableCapture = false;
        FSmoothRender = false;
        FNeedDeleteGL = false;
        FValidFlag = false;
        FNeedDraw = false;
        FViewChanged = false;
        AllowCapture = false;
    },
    destruction: function (params) {
        this.FGLBase = null;
    },

    //事件
    OnInitializeView: null, //OnInitializeView
    OnMousePosition: null, //OnMousePosition(position)
    OnViewMoved: null, //OnViewMoved()
    OnViewZoomed: null, //OnViewZoomed()
    OnGLPaint: null, //OnGLPaint(glbase)
    OnRedrawView: null, //OnRedrawView(redraw_all)
    OnInitializeView: null, //OnInitializeView()

    MouseOperation: function (operation) {
        if (arguments.length >= 1) {
            if (operation != this.FMouseOperation) {
                if (operation) {
                    if (operation.FGLView == this) {
                        if (operation.Temporary) {
                            this.EndTemporaryOperation();
                            this.BeginTemporaryOperation();
                            this.FMouseOperation = operation;
                            this.SetCursor(FMouseOperation.Cursor);
                            this.FMouseOperation.MouseBegin();
                        }
                        else {
                            this.FCapturedFlag = false;
                            if (this.FMouseOperation) {
                                this.FMouseOperation.MouseEnd();
                            }
                            this.FMouseOperation = operation;
                            this.SetCursor(FMouseOperation.Cursor);
                            this.FMouseOperation.MouseBegin();
                        }
                    }
                }
                else {
                    this.FCapturedFlag = false;
                    if (this.FMouseOperation)
                        this.FMouseOperation.MouseEnd();

                    this.FMouseOperation = null;
                    this.SetCursor(Cursor0);
                }
            }
        } else {
            return this.FMouseOperation;
        }
    },

    MinZoom: function (minzoom) {
        if (arguments.length == 0) {
            return this.FGLBase ? this.FGLBase.MinZoom() : 1.00;
        } else if (this.FGLBase) {
            this.FGLBase.MinZoom(minzoom);
        }

    },
    MaxZoom: function (maxzoom) {
        if (arguments.length == 0) {
            return this.FGLBase ? this.FGLBase.MaxZoom() : 1.00;
        } else if (this.FGLBase) {
            this.FGLBase.MaxZoom(maxzoom);
        }

    },
    MousePosition: function (position) {
        if (this.OnMousePosition)
            this.OnMousePosition(position);
    },
    ViewMoved: function () {
        if (this.OnViewMoved)
            this.OnViewMoved();
    },
    ViewZoomed: function () {
        if (this.OnViewZoomed)
            this.OnViewZoomed();
    },

    ViewToScreen: function (point2d) {
        if (this.FGLBase) {
            return this.FGLBase.ViewToScreen(point2d);
        } else {
            return this.Point2DToPoint(point2d);
        }
    },
    ScreenToView: function (point) {
        return this.FGLBase ? this.FGLBase.ScreenToView(point) : this.PointToPoint2D(point);
    },

    CanEndTemporaryOperation: function () {
        return this.FTemporaryFlag;
    },
    EndTemporaryOperation: function () {
        if (this.FTemporaryFlag) {
            if (this.FMouseOperation)
                this.FMouseOperation.MouseEnd();
            this.FMouseOperation = this.FMouseOperation0;
            this.SetCursor(this.FMouseOperation ? this.FMouseOperation.Cursor : 0);
            this.FTemporaryFlag = false;
            this.FMouseOperation0 = null;

        }
    },
    EndMouseOperation: function () {
        this.MouseOperation(null);
    },

    ZoomViewExtent: function () {
        if (this.FGLBase) {
            this.FGLBase.ZoomExtent();
            this.ViewChanged(true);
            this.Invalidate();
        }
        this.ViewZoomed();
    },
    ZoomViewIn: function () {
        if (this.FGLBase && this.FGLBase.ZoomIn(TPosition2D())) {
            this.ViewChanged(true);
            this.Invalidate();
        }
    },
    ZoomViewOut: function () {
        if (this.FGLBase && this.FGLBase.ZoomOut(TPosition2D())) {
            this.ViewChanged(true);
            this.Invalidate();
        }
    },

    MouseOK: function (state) {
        if (this.FMouseOperation)
            this.FMouseOperation.MouseOK(state);
    },
    MouseCancel: function (state) {
        if (this.FMouseOperation)
            this.FMouseOperation.MouseCancel(state);
    },
    MouseUndo: function (state) {
        if (this.FMouseOperation)
            this.FMouseOperation.MouseUndo(state);
    },
    MouseInsert: function (state) {
        if (this.FMouseOperation)
            this.FMouseOperation.MouseInsert(state);
    },
    MouseDelete: function (state) {
        if (this.FMouseOperation)
            this.FMouseOperation.MouseDelete(state);
    },
    MouseCommand: function (command, state) {
        if (this.FMouseOperation)
            this.FMouseOperation.MouseCommand(command, state);
    },

    MoveViewMouseMove: function (dc, keys, position, downflag) {
        if (downflag)
            this.ProcessMoveView(this.MouseMovePosition, position);
    },
    ZoomInMouseUp: function (dc, keys, position) {
        if (this.FGLBase && this.FGLBase.ZoomIn(center)) {
            this.ViewChanged(true);
            this.Invalidate();
        }
        this.ViewZoomed();
    },
    ZoomOutMouseUp: function (dc, keys, position) {
        if (this.FGLBase && this.FGLBase.ZoomOut(position)) {
            this.ViewChanged(true);
            this.Invalidate();
        }
        this.ViewZoomed();
    },
    ZoomRectMouseUp: function (dc, keys, position) {
        if (position.sub(this.MouseDownPosition).abs() >= 10)
            this.ZoomViewRect(this.TInterval2D(this.MouseDownPosition, position));
    },
    ZoomViewMouseMove: function (dc, keys, position, downflag) {
        if (downflag)
            this.ProcessZoomView(this.MouseMovePosition, position);
    },

    MouseOperation0: function (operation) {
        if (operation != this.FMouseOperation) {
            if (operation) {
                if (operation.FGLView == this) {
                    if (operation.Temporary) {
                        this.EndTemporaryOperation();
                        this.BeginTemporaryOperation();
                        this.FMouseOperation = operation;
                        this.SetCursor(this.FMouseOperation.Cursor);
                    }
                    else {
                        this.FCapturedFlag = false;
                        this.FMouseOperation = operation;
                        this.SetCursor(this.FMouseOperation.Cursor);
                    }
                }
            }
            else {
                this.FCapturedFlag = false;
                this.FMouseOperation = null;
                this.SetCursor(Cursor0);
            }
        }
    },
    EndTemporaryOperation0: function () {
        if (this.FTemporaryFlag) {
            this.FMouseOperation = this.FMouseOperation0;
            this.SetCursor(this.FMouseOperation ? this.FMouseOperation.Cursor : 0);
            this.FTemporaryFlag = false;
            this.FMouseOperation0 = null;
        }
    },
    EndMouseOperation0: function () {
        MouseOperation0(null);
    },

    Paint: function (dc) {
        if (this.OnPaint)
            this.OnPaint(dc);
    },

    Paint2: function (dc) {
        if (this.OnPaint2)
            this.OnPaint2(dc);
    },
    ProcessMoveView: function (from, to, flag) {
        if (arguments.length <= 2) {
            flag = false;
        }
        if (from != to)
            this.MoveView(flag ? from.add(to).mul(0.5) : from, to); // TBD: TPosition2D, add, divide
    },

    BeginTemporaryOperation: function () {
        this.FCapturedFlag = false;
        if (!this.FTemporaryFlag) {
            this.FMouseOperation0 = this.FMouseOperation;
            this.FTemporaryFlag = true;
        }
        this.FMouseOperation = null;
        this.SetCursor(0);
    },

    ProcessZoomView: function (from, to) {
        var d = to.Y - from.Y;
        if (d !== 0)
            this.ZoomView(Exp(d / (flag ? 200 : 100)));
    },

    GenCapturePosition: function (dc, keys, x, y) {
        if (this.FCapturedFlag)
            this.DrawCapturedPoint(dc);
        var point = Point(x, y);
        var mouse_position = this.ScreenToView(point);
        if (this.AllowCapture && this.FEnableCapture && this.FMouseOperation) {
            this.FCapturedFlag = false;
            var captureed_position;
            if (this.FMouseOperation.MouseCapture2D(this.FGLBase, mouse_position, captured_position) ? true : this.FMouseOperation.MouseCapture(mouse_position, captured_position)) {
                this.FCapturedPosition = mouse_position = captureed_position;
                this.FCapturedFlag = true;
            }
        }
        if (this.FCapturedFlag)
            this.DrawCapturedPoint(dc);
        return mouse_position;
    },
    DrawCapturedPoint: function (dc) {
        var p = this.ViewToScreen(FCapturedPosition);
        var rop2 = this.SetROP2(dc, R2_XORPEN);
        var pen = this.SelectObject(dc, CreatePen(PS_SOLID, 0, 0x00FF0000)); //TBD HPEN
        var d = 8;
        MoveToEx(dc, p.x - d, p.y - d, 0);
        LineTo(dc, p.x + d, p.y - d);
        LineTo(dc, p.x + d, p.y + d);
        LineTo(dc, p.x - d, p.y + d);
        LineTo(dc, p.x - d, p.y - d);
        d = 6;
        MoveToEx(dc, p.x - d, p.y - d, 0);
        LineTo(dc, p.x + d, p.y - d);
        LineTo(dc, p.x + d, p.y + d);
        LineTo(dc, p.x - d, p.y + d);
        LineTo(dc, p.x - d, p.y - d);
        d = 4;
        MoveToEx(dc, p.x - d, p.y - d, 0);
        LineTo(dc, p.x + d, p.y - d);
        LineTo(dc, p.x + d, p.y + d);
        LineTo(dc, p.x - d, p.y + d);
        LineTo(dc, p.x - d, p.y - d);
        this.DeleteObject(this.SelectObject(dc, pen));
        pen = this.SelectObject(dc, CreatePen(PS_SOLID, 0, 0x0000FFFF));
        d = 7;
        MoveToEx(dc, p.x - d, p.y - d, 0);
        LineTo(dc, p.x + d, p.y - d);
        LineTo(dc, p.x + d, p.y + d);
        LineTo(dc, p.x - d, p.y + d);
        LineTo(dc, p.x - d, p.y - d);
        d = 5;
        MoveToEx(dc, p.x - d, p.y - d, 0);
        LineTo(dc, p.x + d, p.y - d);
        LineTo(dc, p.x + d, p.y + d);
        LineTo(dc, p.x - d, p.y + d);
        LineTo(dc, p.x - d, p.y - d);
        d = 3;
        MoveToEx(dc, p.x - d, p.y - d, 0);
        LineTo(dc, p.x + d, p.y - d);
        LineTo(dc, p.x + d, p.y + d);
        LineTo(dc, p.x - d, p.y + d);
        LineTo(dc, p.x - d, p.y - d);
        this.SetROP2(dc, rop2);
        this.DeleteObject(SelectObject(dc, pen));
    },

    ProcessMouseDown0: function (dc, button, keys, position) {
        var flag_left, flag_middle, flag_right, flag_shift, flag_ctrl, flag_alt;
        this.GetMouseKeys(keys, flag_left, flag_middle, flag_right, flag_shift, flag_ctrl, flag_alt);
        if (!this.FMouseLeftButtonDown && !this.FMouseMiddleButtonDown && !this.FMouseRightButtonDown) {
            this.SetCapture(Handle);
            this.MouseDownPosition = position;
            this.MouseDownMapPosition = this.ViewToMap(this.MouseDownPosition);
            this.MouseDownModelPosition = this.MapToModel(this.MouseDownMapPosition);
            this.MouseMovePosition = this.MouseDownPosition;
            this.MouseMoveMapPosition = this.ViewToMap(this.MouseMovePosition);
            this.MouseMoveModelPosition = this.MapToModel(this.MouseMoveMapPosition);
            if (button == mbRight) {
                this.FCursorOld = this.GetCursor();
                this.FMouseRightButtonDown = true;
                this.FEnableCapture = false;
                if (!flag_left && !flag_middle) {
                    var flag = (flag_shift ? 1 : 0) + (flag_ctrl ? 2 : 0) + (flag_alt ? 4 : 0);
                    if (flag == 0)
                        this.SetCursor(Cursor_MoveView);
                    else if (flag == 1)
                        this.SetCursor(Cursor_ZoomView);
                    else if (flag == 2)
                        this.SetCursor(Cursor_Rotate);
                }
                else if (flag_left)
                    this.SetCursor(Cursor_ZoomView);
                else if (flag_middle)
                    this.SetCursor(Cursor_MoveView);
                else
                    this.SetCursor(Cursor_Rotate);
            }
            else if (button == mbMiddle) {
                this.FCursorOld = this.GetCursor();
                this.FMouseMiddleButtonDown = true;
                this.FEnableCapture = false;
                this.SetCursor(Cursor_Rotate);
            }
            else {
                if (flag_middle && flag_right)
                    this.SetCursor(Cursor_Rotate);
                else if (flag_right)
                    this.SetCursor(Cursor_ZoomView);
                else
                    return true;
            }
        }
        return false;

    },
    ProcessMouseMove0: function (dc, keys, position) {
        var flag_left, flag_middle, flag_right, flag_shift, flag_ctrl, flag_alt;
        this.GetMouseKeys(keys, flag_left, flag_middle, flag_right, flag_shift, flag_ctrl, flag_alt);
        if (this.FMouseRightButtonDown) {
            if (!flag_left && !flag_middle) {
                var flag = (flag_shift ? 1 : 0) + (flag_ctrl ? 2 : 0) + (flag_alt ? 4 : 0);
                if (flag == 0) {
                    this.SetCursor(Cursor_MoveView);
                    this.MoveViewMouseMove(dc, keys, position, true);
                } else if (flag == 1) {
                    this.SetCursor(Cursor_ZoomView);
                    this.ZoomViewMouseMove(dc, keys, position, true);
                }
            } else if (flag_left) {
                this.SetCursor(Cursor_ZoomView);
                this.ZoomViewMouseMove(dc, keys, position, true);
            } else if (flag_middle) {
                this.SetCursor(Cursor_MoveView);
                this.MoveViewMouseMove(dc, keys, position, true);
            }
        }
        else if (this.FMouseLeftButtonDown) {
            if (flag_right) {
                this.SetCursor(Cursor_ZoomView);
                this.ZoomViewMouseMove(dc, keys, position, true);
            }
            else
                return true;
        }
        else
            return true;
        this.MouseMovePosition = position;
        this.MouseMoveMapPosition = ViewToMap(MouseMovePosition);
        this.MouseMoveModelPosition = MapToModel(MouseMoveMapPosition);
        return false;

    },
    ProcessMouseUp0: function (dc, button, keys, position) {
        if ((this.FMouseLeftButtonDown && button == mbLeft ? 1 : 0) + (this.FMouseMiddleButtonDown && button == mbMiddle ? 1 : 0) + (this.FMouseRightButtonDown && button == mbRight ? 1 : 0) == 1) {
            if (this.FMouseMiddleButtonDown) {
                if (this.FMouseOperation && position.sub(MouseDownPosition).abs() >= 1)
                    this.ViewRotated();
                this.SetCursor(FCursorOld);
                this.FMouseMiddleButtonDown = false;
                this.FEnableCapture = true;
            }
            else if (this.FMouseRightButtonDown) {
                if (position.sub(this.MouseDownPosition).abs() < 3) {
                    // if (HMENU popup_menu = FMouseOperation?FMouseOperation.GetPopupMenu(FMouseOperation.PopupMenu):PopupMenu)
                    // {
                    //   POINT point = ViewToScreen(position);
                    //   ClientToScreen(Handle,&point);
                    //   TrackPopupMenu(popup_menu,TPM_LEFTALIGN,point.x,point.y,0,Handle,0);
                    // }
                    this.EndTemporaryOperation();
                }
                else
                    this.ViewMoved();
                this.SetCursor(this.FCursorOld);
                this.FMouseRightButtonDown = false;
                this.FEnableCapture = true;
            } else {
                this.FMouseLeftButtonDown = false;
                return true;
            }
            this.ReleaseCapture();
        }
        return false;
    },

    ProcessMouseDown: function (dc, button, keys, position) {
        if (this.FMouseOperation)
            this.FMouseOperation.MouseDown(dc, keys, position);
        this.FMouseLeftButtonDown = true;
    },
    ProcessMouseMove: function (dc, keys, position) {
        if (this.FMouseOperation) {
            if (this.MouseMovePosition.sub(position).abs() >= MinMove)
                this.FMouseOperation.MouseMove(dc, keys, position, this.FMouseLeftButtonDown);
            else
                return;
        }
        this.MouseMovePosition = position;
        this.MouseMoveMapPosition = this.ViewToMap(this.MouseMovePosition);
        this.MouseMoveModelPosition = this.MapToModel(this.MouseMoveMapPosition);
    },
    ProcessMouseUp: function (dc, button, keys, position) {
        this.ReleaseCapture();
        this.FMouseLeftButtonDown = false;
        if (this.FMouseOperation)
            this.FMouseOperation.MouseUp(dc, keys, position);
    },

    MoveView: function (from, to) {
        if (this.FGLBase && this.FGLBase.Move(from, to)) {
            this.ViewChanged(true);
            this.Invalidate();
        }
        this.ViewMoved();
    },
    ZoomView: function (position, scale) {
        if (arguments.length == 1) {
            if (this.FGLBase && this.FGLBase.Zoom(this.TPosition2D(), scale)) {
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
    ZoomViewRect: function (rect) {
        if (this.FGLBase && this.FGLBase.ZoomRect(rect, FIdentityXY())) {
            this.ViewChanged(true);
            this.Invalidate();
        }
        this.ViewZoomed();
    },
    InitializeView: function () {
        if (this.OnInitializeView)
            this.OnInitializeView();
    },

    WMMouseDown: function (button, keys, x, y) {
        this.SetAutoView(0, this.MouseMovePosition, this.MouseMovePosition);
        if (!this.FDoubleClicked()) {
            var point = { x: X, y: Y };
            var dc = GetDC(Handle);
            if (this.ProcessMouseDown0(dc, button, keys, this.ScreenToView(point))) {
                this.ProcessMouseDown(dc, button, keys, this.GenCapturePosition(dc, keys, X, Y));
                if (this.FMouseOperation && this.FMouseLeftButtonDown && this.FMouseOperation.Paint2NeedDown())
                    this.FMouseOperation.Paint2(dc);
            }
            this.ReleaseDC(Handle, dc);
        }
        else {
            this.FDoubleClicked(false);
            return;
        }
    },

    WMMouseMove: function (keys, x, y) {
        var point = { x: X, y: Y };
        var position = (ScreenToView(point));
        var dc = GetDC(Handle);
        if (this.ProcessMouseMove0(dc, keys, position)) {
            if (this.FMouseOperation && (!this.FMouseOperation.Paint2NeedDown() || this.FMouseLeftButtonDown))
                this.FMouseOperation.Paint2(dc);
            this.Paint2(dc);
            position = this.GenCapturePosition(dc, keys, X, Y);
            this.ProcessMouseMove(dc, keys, position);
            this.Paint2(dc);
            if (this.FMouseOperation && (!this.FMouseOperation.Paint2NeedDown() || this.FMouseLeftButtonDown))
                this.FMouseOperation.Paint2(dc);
        }
        this.MousePosition(position);
        this.ReleaseDC(Handle, dc);
    },
    WMMouseUp: function (button, keys, x, y) {
        var point = { x: X, y: Y };
        var dc = GetDC(Handle);
        if (this.ProcessMouseUp0(dc, button, keys, this.ScreenToView(point))) {
            if (this.FMouseOperation && this.FMouseLeftButtonDown && this.FMouseOperation.Paint2NeedDown())
                this.FMouseOperation.Paint2(dc);
            this.ProcessMouseUp(dc, button, keys, this.GenCapturePosition(dc, keys, X, Y));
        }
        this.ReleaseDC(Handle, dc);
        this.FDoubleClicked(false);
    },
    WMMouseWheel: function (keys, wheeldelta, x, y) {
        if (this.FGLBase) {
            var flag_left, flag_middle, flag_right, flag_shift, flag_ctrl, flag_alt;
            this.GetMouseKeys(keys, flag_left, flag_middle, flag_right, flag_shift, flag_ctrl, flag_alt);
            var op = (flag_shift ? 1 : 0) + (flag_alt ? -1 : 0);
            var wheel = Exp(wheel_delta * (op > 0 ? 2.0 : op < 0 ? 0.5 : 1.0) / 600.0);
            if (this.FGLBase.Zoom(TPosition2D(), wheel)) {
                this.ViewChanged(true);
                this.Invalidate();
            }
        }
    },
    WMDblClick: function (keys) {
        this.FDoubleClicked(true);
    },
    WMKeyDown: function (key, nkeys) {
        this.OnKey(key, nkeys, -1);
    },
    WMKeyUp: function (key, nkeys) {
        this.OnKey(key, nkeys, 1);
    },

    OnKey: function (key, keys, state /*<0按下:null,>0抬起*/) {
        if (state > 0) {
            switch (key) {
                case VK_RETURN: //TBD, Key definition
                    MouseOK(0);
                    break;
                case VK_ESCAPE:
                    MouseCancel(0);
                    break;
                case VK_BACK:
                    MouseUndo(0);
                    break;
                case VK_INSERT:
                    MouseInsert(0);
                    break;
                case VK_DELETE:
                    MouseDelete(0);
                    break;
            }
        }
    },
    OnViewMoved: function () {
        this.Invalidate();
    },
    OnViewZoomed: function () {
        this.Invalidate();
    },

    GLBase: function (glbase) {
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

    ModelBound: function (bds) {
        if (arguments.length == 0) {
            return this.FGLBase ? this.FGLBase.ModelBound() : this.TBound2D();
        } else if (this.FGLBase) {
            this.FGLBase.ModelBound(bds);
            this.NeedDraw(true);
            this.Invalidate();
        }
    },

    GLPaint: function (glbase) {
        if (this.OnGLPaint)
            this.OnGLPaint(glbase);
    },

    RedrawView: function (redraw_all) {
        if (this.OnRedrawView)
            this.OnRedrawView(redraw_all);
    },
    DrawView: function (dc) {
        var color = TRGBColor();
        color.Color(Color);
        if (this.FGLBase) {
            this.FGLBase.GLPainting(false, dc);
            this.GLPaint(glview);
            this.FGLBase.GLPainting(false, 0);
        }
        this.FNeedDraw = false;
        this.FViewChanged = false;
        var flag = this.FMouseOperation && (!this.FMouseOperation.Paint2NeedDown() || this.FMouseLeftButtonDown);
        if (this.FMouseOperation0 || flag || this.FCapturedFlag) {
            this.Paint(dc);
            this.Paint2(dc);
            if (this.FMouseOperation0)
                this.FMouseOperation0.Paint(dc);
            if (this.FMouseOperation)
                this.FMouseOperation.Paint(dc);
            if (flag)
                this.FMouseOperation.Paint2(dc);
            if (this.FCapturedFlag)
                this.DrawCapturedPoint(dc);
        }
    },
    DrawViewOnPaint: function () {
        var ps = PAINTSTRUCT();
        var dc = BeginPaint(Handle, ps);
        SetBkColor(dc, Color);
        this.DrawView(dc);
        EndPaint(Handle, ps);
    },
    DrawViewDirectly: function () {
        var dc = GetDC(Handle);
        this.DrawView(dc);
        ReleaseDC(Handle, dc);
    },
    OnMessage: function (msg, wparam, lparam) {
        switch (msg) {
            case WM_PAINT:
                this.FCapturedFlag = false;
                if (this.FGLBase)
                    this.DrawViewOnPaint();
                break;
            case WM_SIZE:
                if (this.FGLBase) {
                    var rect;
                    if (GetClientRect(Handle, rect)) {
                        if (rect.right > rect.left && rect.bottom > rect.top) {
                            this.FGLBase.ViewRect(rect);
                            if (!FValidFlag()) {
                                FValidFlag(true);
                                InitializeView();
                            }
                        }
                    }
                }
                this.ViewChanged(true);
                this.NeedDraw(true);
                this.Invalidate();
                break;
            case WM_DISPLAYCHANGE:
                if (this.FGLBase)
                    this.FGLBase.ViewResolutionDPI(TVector2D(GetDeviceCaps(this.FGLBase.DC(), LOGPIXELSX), GetDeviceCaps(this.FGLBase.DC(), LOGPIXELSY)));
                break;
        }
        return TGLViewBase.OnMessage(msg, wparam, lparam);
    },
    MapToView: function (mapposition) {
        return this.FGLBase.MapToView(mapposition);
    },
    ViewToMap: function (viewposition) {
        return this.FGLBase.ViewToMap(viewposition);
    },
    ModelToLocal: function (position) {
        return this.FGLBase.ModelToLocal(position);
    },
    LocalToModel: function (localposition) {
        return this.FGLBase.LocalToModel(localposition);
    },
    ModelToMap: function (position) {
        return this.FGLBase.ModelToMap(position);
    },
    MapToModel: function (mapposition) {
        return this.FGLBase.MapToModel(mapposition);
    },
    ViewToModel: function (viewposition) {
        return this.FGLBase.ViewToModel(viewposition);
    },
    ModelToView: function (position) {
        return this.FGLBase.ModelToView(position);
    },
    ViewScale: function (view_scale) {
        if (arguments.length == 0) {
            if (this.FGLBase)
                return this.FGLBase.ViewScale();
            return TVector2D(1, 1);
        } else if (this.FGLBase)
            this.FGLBase.ViewScale(view_scale);
    },
    MapScale: function (mapscale) {
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
    BasePosition: function () {
        if (this.FGLBase)
            return this.FGLBase.BasePosition();
        return TPosition2D();
    },
    NeedDraw: function (need_draw) {
        if (arguments.length == 0) {
            return FNeedDraw;
        } else if (need_draw) {
            FNeedDraw = true;
            RedrawView(true);
        }
    },
    ViewChanged: function (changed) {
        if (changed) {
            FViewChanged = true;
            RedrawView(false);
        }
    }
}
