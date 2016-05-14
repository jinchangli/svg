var TAutoViewType = {
  error: -1,
  avNone: 0,
  avMove: 1,
  avZoom: 2,
  avRotate: 3
};

var TGLView = function () {

}

TGLView.prototype = {
  FGLDC: null,
  FCursorOld: null,
  FCapturedPosition: null,
  FMouseOperation: null,
  FMouseOperation0: null,
  FTimeViewPosition1: null,
  FTimeViewPosition2: null,
  FAutoView: null,
  FMouseLeftButtonDown: null,
  FMouseMiddleButtonDown: null,
  FMouseRightButtonDown: null,
  FDoubleClicked: null,
  FTemporaryFlag: null,
  FCapturedFlag: null,
  FEnableCapture: null,
  FSmoothRender: null,
  FNeedDeleteGL: null,
  FCanDraw: null,
  FValidFlag: null,
  AllowCapture: null,
  AllowAutoView: null,
  MouseDownPosition: null,
  MouseMovePosition: null,
  MinMove: null,


  // User declarations
  FGLBase: null,

  FNeedDraw: null,
  FIdentityXY: null,
  FViewChanged,

  MouseDownMapPosition: null,
  MouseMoveMapPosition: null,
  MouseDownModelPosition: null,
  MouseMoveModelPosition: null,

  MouseOperation: function (operation) {
    if (operation) {
      if (operation != this.FMouseOperation) {
        if (operation) {
          if (operation.FGLView == this) {
            if (operation.Temporary()) {
              this.EndTemporaryOperation();
              this.BeginTemporaryOperation();
              this.FMouseOperation = operation;
              this.SetCursor(FMouseOperation.Cursor);
              this.FMouseOperation.MouseBegin();
            }
            else {
              this.FCapturedFlag(false);
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
          this.FCapturedFlag(false);
          if (this.FMouseOperation)
            this.FMouseOperation.MouseEnd();

          this.FMouseOperation = 0;
          this.SetCursor(Cursor0);
        }
      }
    } else {
      return this.FMouseOperation;
    }
  },
  PositionFixed: function (fixed) {
    if (fixed == undefined) {
      return this.FGLBase ? this.FGLBase.PositionFixed() : false;
    } else {
      if (this.FGLBase)
        this.FGLBase.PositionFixed(fixed);
    }
  },
  ScaleFixed: function (fixed) {
    if (fixed == undefined) {
      return this.FGLBase ? this.FGLBase.ScaleFixed() : false;
    } else {
      if (this.FGLBase)
        this.FGLBase.ScaleFixed(fixed);
    }
  },
  DirectionFixed: function (fixed) {
    if (fixed == undefined) {
      return this.FGLBase ? this.FGLBase.DirectionFixed() : false;
    } else {
      if (this.FGLBase)
        this.FGLBase.DirectionFixed(fixed);
    }
  },
  MovingLimit: function (limit) {
    if (limit == undefined) {
      return this.FGLBase ? this.FGLBase.MovingLimit() : false;
    } else {
      if (this.FGLBase)
        this.FGLBase.MovingLimit(limit);
    }

  },
  MinZoom: function (minzoom) {
    if (minzoom == undefined) {
      return this.FGLBase ? this.FGLBase.MinZoom() : 1.00;
    } else {
      if (this.FGLBase)
        this.FGLBase.MinZoom(minzoom);
    }

  },
  MaxZoom: function (maxzoom) {
    if (maxzoom == undefined) {
      return this.FGLBase ? this.FGLBase.MaxZoom() : 1.00;
    } else {
      if (this.FGLBase)
        this.FGLBase.MaxZoom(maxzoom);
    }

  },
  CanDraw: function (candraw) {
    if (candraw == undefined) {
      return this.FCanDraw();
    } else {
      if (this.FCanDraw() != can_draw) {
        this.FCanDraw(can_draw);
        if (this.FCanDraw())
          this.Invalidate();
      }
    }

  },
  SmoothRender: function (smoothrender) {
    if (smoothrender == undefined) {
      return this.FSmoothRender();
    } else {
      if (this.FSmoothRender() != smooth_render) {
        this.FSmoothRender(smooth_render);
        this.NeedDraw(true);
        this.Invalidate();
      }
    }

  },
  MousePosition: function (position) {
    this.OnMousePosition(position);
  },
  ViewMoved: function () {
    this.OnViewMoved();
  },
  ViewZoomed: function () {
    this.OnViewZoomed();
  },
  ViewRotated: function () {
    this.OnViewRotated();
  },

  TGLView: function (canvas) { },

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
  Point2DToPoint: function (point2d) {
    var rect;
    rect = GetClientRect(Handle, rect);
    var point = { x: (point2d.X + (rect.right - rect.left) / 2.0), y: ((rect.bottom - rect.top) / 2.0 - point2d.Y) };// TBD: Point struct
    return point;
  },

  PointToPoint2D: function (point) {
    var rect;
    rect = GetClientRect(Handle);
    return { x: (point.x - (rect.right - rect.left) / 2.0), y: ((rect.bottom - rect.top) / 2.0 - point.y) };// TBD: TPosition2D struct
  },

  GetClientRect: function (handle) {

  },


  CanEndTemporaryOperation: function () {
    return this.FTemporaryFlag();
  },
  EndTemporaryOperation: function () {
    if (this.FTemporaryFlag()) {
      if (this.FMouseOperation)
        this.FMouseOperation.MouseEnd();
      this.FMouseOperation = this.FMouseOperation0;
      this.SetCursor(this.FMouseOperation ? this.FMouseOperation.Cursor : 0);
      this.FTemporaryFlag(false);
      this.FMouseOperation0 = 0;

    }
  },
  EndMouseOperation: function () {
    this.MouseOperation(0);
  },

  ZoomViewExtent: function (identify = false) {
    if (this.FGLBase) {
      this.FGLBase.ZoomExtent(identify || this.FIdentityXY());
      this.ViewChanged(true);
      this.Invalidate();
    }

    this.ViewZoomed();
  },
  ZoomViewIn: function () {
    if (this.FGLBase && this.FGLBase.ZoomIn(this.TPosition2D())) {
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

  EnterGL: function () { },
  LeaveGL: function () { },

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

  MouseMoveLine: function (dc) {
    var p1 = this.ViewToScreen(this.MouseDownPosition),
    var p2 = this.ViewToScreen(this.MouseMovePosition);
    var rep2 = this.SetROP2(dc, R2_NOT);
    this.MoveToEx(dc, p1.x, p1.y, 0);
    this.LineTo(dc, p2.x, p2.y);
    this.SetROP2(dc, rep2);
  },
  MouseMoveRect: function (dc) {
    var p1 = ViewToScreen(this.MouseDownPosition),
    var p2 = ViewToScreen(this.MouseMovePosition);
    var rop2 = this.SetROP2(dc, R2_NOT);
    this.MoveToEx(dc, p1.x, p1.y, 0);
    this.LineTo(dc, p2.x, p1.y);
    this.LineTo(dc, p2.x, p2.y);
    this.LineTo(dc, p1.x, p2.y);
    this.LineTo(dc, p1.x, p1.y);
    this.SetROP2(dc, rop2);
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
    if (~(position - this.MouseDownPosition) >= 10)
      this.ZoomViewRect(this.TInterval2D(this.MouseDownPosition, position));
  },
  ZoomViewMouseMove: function (dc, keys, position, downflag) {
    if (downflag)
      this.ProcessZoomView(this.MouseMovePosition, position);
  },

  RotateViewMouseMove: function (dc, keys, position, downflag) {
    if (this.FGLBase && downflag) {
      var v1 = this.FGLBase.ViewToMap(MouseMovePosition),//TBD, TVector2D
      var v2 = this.FGLBase.ViewToMap(position);
      if (!IsZero(v1) && !IsZero(v2)) {
        var angle = this.RadToDeg(+(v2 / v1));
        if (angle != 0) {
          if (this.FGLBase.Rotate(angle)) {
            this.ViewRotated();
            this.ViewChanged(true);
            this.Invalidate();
          }
        }
      }
    }

  },

  MouseOperation0: function (operation) {
    if (operation != this.FMouseOperation) {
      if (operation) {
        if (operation.FGLView == this) {
          if (operation.Temporary()) {
            this.EndTemporaryOperation();
            this.BeginTemporaryOperation();
            this.FMouseOperation = operation;
            this.SetCursor(this.FMouseOperation.Cursor);
          }
          else {
            this.FCapturedFlag(false);
            this.FMouseOperation = operation;
            this.SetCursor(this.FMouseOperation.Cursor);
          }
        }
      }
      else {
        this.FCapturedFlag(false);
        this.FMouseOperation = 0;
        this.SetCursor(Cursor0);
      }
    }
  },
  EndTemporaryOperation0: function () {
    if (this.FTemporaryFlag()) {
      this.FMouseOperation = this.FMouseOperation0;
      this.SetCursor(this.FMouseOperation ? this.FMouseOperation.Cursor : 0);
      this.FTemporaryFlag(false);
      this.FMouseOperation0 = 0;
    }
  },
  EndMouseOperation0: function () {
    MouseOperation0(0);
  },

  SetAutoView: function (autoview, p2, p1) {
    this.FAutoView = autoview;
    this.FTimeViewPosition1 = p1;
    this.FTimeViewPosition2 = p2;
  },
  Paint: function (dc) {
    this.OnPaint(dc);
  },

  Paint2: function (dc) {
    OnPaint2(dc);
  },
  ProcessMoveView: function (from, to, flag) {
    if (flag == undefined || flag == null) {
      flag = false;
    }

    if (from != to)
      this.MoveView(flag ? (from + to) / 2 : from, to); // TBD: TPosition2D, add, divide
  },

  BeginTemporaryOperation: function () {
    this.FCapturedFlag(false);
    if (!this.FTemporaryFlag()) {
      this.FMouseOperation0 = this.FMouseOperation;
      this.FTemporaryFlag(true);
    }
    this.FMouseOperation = 0;
    this.SetCursor(0);
  },

  ProcessZoomView: function (from, to) {
    var d = to.Y - from.Y;
    if (d != 0)
      this.ZoomView(Exp(d / (flag ? 200 : 100)));
  },

  GenCapturePosition: function (dc, keys, x, y) {
    if (this.FCapturedFlag())
      this.DrawCapturedPoint(dc);
    var point = Point(x, y);
    var mouse_position = this.ScreenToView(point);
    if (this.AllowCapture() && this.FEnableCapture() && this.FMouseOperation) {
      this.FCapturedFlag(false);
      var captureed_position;
      if (this.FMouseOperation.MouseCapture2D(this.FGLBase, mouse_position, captured_position) ? true : this.FMouseOperation.MouseCapture(mouse_position, captured_position)) {
        this.FCapturedPosition = mouse_position = captureed_position;
        this.FCapturedFlag(true);
      }
    }
    if (this.FCapturedFlag())
      this.DrawCapturedPoint(dc);
    return mouse_position;

  },
  DrawCapturedPoint: function (dc) {
    var p = this.ViewToScreen(FCapturedPosition);
    var rop2 = this.SetROP2(dc, R2_XORPEN);
    var pen = this.SelectObject(dc, CreatePen(PS_SOLID, 0, 0x00FF0000));//TBD HPEN
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
    if (!this.FMouseLeftButtonDown() && !this.FMouseMiddleButtonDown() && !this.FMouseRightButtonDown()) {
      this.SetCapture(Handle);
      this.MouseDownPosition = position;
      this.MouseDownMapPosition = this.ViewToMap(this.MouseDownPosition);
      this.MouseDownModelPosition = this.MapToModel(this.MouseDownMapPosition);
      this.MouseMovePosition = this.MouseDownPosition;
      this.MouseMoveMapPosition = this.ViewToMap(this.MouseMovePosition);
      this.MouseMoveModelPosition = this.MapToModel(this.MouseMoveMapPosition);
      if (button == mbRight) {
        this.FCursorOld = this.GetCursor();
        this.FMouseRightButtonDown(true);
        this.FEnableCapture(false);
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
        this.FMouseMiddleButtonDown(true);
        this.FEnableCapture(false);
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
    if (this.FMouseRightButtonDown()) {
      if (!flag_left && !flag_middle) {
        var flag = (flag_shift ? 1 : 0) + (flag_ctrl ? 2 : 0) + (flag_alt ? 4 : 0);
        if (flag == 0) {
          this.SetCursor(Cursor_MoveView);
          this.MoveViewMouseMove(dc, keys, position, true);
        }
        else if (flag == 1) {
          this.SetCursor(Cursor_ZoomView);
          this.ZoomViewMouseMove(dc, keys, position, true);
        }
        else if (flag == 2) {
          this.SetCursor(Cursor_Rotate);
          this.RotateViewMouseMove(dc, keys, position, true);
        }
      }
      else if (flag_left) {
        this.SetCursor(Cursor_ZoomView);
        this.ZoomViewMouseMove(dc, keys, position, true);
      }
      else if (flag_middle) {
        this.SetCursor(Cursor_MoveView);
        this.MoveViewMouseMove(dc, keys, position, true);
      }
      else {
        this.SetCursor(Cursor_Rotate);
        this.RotateViewMouseMove(dc, keys, position, true);
      }
    }
    else if (this.FMouseMiddleButtonDown()) {
      this.SetCursor(Cursor_Rotate);
      this.RotateViewMouseMove(dc, keys, position, true);
    }
    else if (this.FMouseLeftButtonDown()) {
      if (flag_middle && flag_right) {
        this.SetCursor(Cursor_Rotate);
        this.RotateViewMouseMove(dc, keys, position, true);
      }
      else if (flag_right) {
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
    if ((this.FMouseLeftButtonDown() && button == mbLeft ? 1 : 0)
      + (this.FMouseMiddleButtonDown() && button == mbMiddle ? 1 : 0)
      + (this.FMouseRightButtonDown() && button == mbRight ? 1 : 0) == 1) {
      if (this.FMouseMiddleButtonDown()) {
        if (this.FMouseOperation && ~(position - MouseDownPosition) >= 1)
          this.ViewRotated();
        this.SetCursor(FCursorOld);
        this.FMouseMiddleButtonDown(false);
        this.FEnableCapture(true);
      }
      else if (this.FMouseRightButtonDown()) {
        if (~(position - this.MouseDownPosition) < 3) {
          // if (HMENU popup_menu = FMouseOperation?FMouseOperation.GetPopupMenu(FMouseOperation.PopupMenu):PopupMenu)
          // {
          //   POINT point = ViewToScreen(position);
          //   ClientToScreen(Handle,&point);
          //   TrackPopupMenu(popup_menu,TPM_LEFTALIGN,point.x,point.y,0,Handle,0);
          // }
          this.FGLView3Ds ? this.FGLView3Ds.EndTemporaryOperation() : this.EndTemporaryOperation();
        }
        else
          this.ViewMoved();
        this.SetCursor(this.FCursorOld);
        this.FMouseRightButtonDown(false);
        this.FEnableCapture(true);
      }
      else {
        this.FMouseLeftButtonDown(false);
        return true;
      }
      this.ReleaseCapture();
    }
    return false;

  },

  ProcessMouseDown: function (dc, button, keys, position) {
    if (this.FMouseOperation)
      this.FMouseOperation.MouseDown(dc, keys, position);
    this.FMouseLeftButtonDown(true);
  },
  ProcessMouseMove: function (dc, keys, position) {
    if (this.FMouseOperation) {
      if (~(this.MouseMovePosition - position) >= MinMove)
        this.FMouseOperation.MouseMove(dc, keys, position, this.FMouseLeftButtonDown());
      else
        return;
    }
    this.MouseMovePosition = position;
    this.MouseMoveMapPosition = this.ViewToMap(this.MouseMovePosition);
    this.MouseMoveModelPosition = this.MapToModel(this.MouseMoveMapPosition);
  },
  ProcessMouseUp: function (dc, button, keys, position) {
    this.ReleaseCapture();
    this.FMouseLeftButtonDown(false);
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
    if (scale == undefined) {
      scale == position;

      if (this.FGLBase && this.FGLBase.Zoom(this.TPosition2D(), scale)) {
        this.ViewChanged(true);
        this.Invalidate();
      }
      this.ViewZoomed();
    } else {
      if (position != undefined)

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
    this.OnInitializeView();
  },

  WMMouseDown: function (button, keys, x, y) {
    this.SetAutoView(avNone, this.MouseMovePosition, this.MouseMovePosition);
    if (!this.FDoubleClicked()) {
      var point = { x: X, y: Y };
      var dc = GetDC(Handle);
      if (this.ProcessMouseDown0(dc, button, keys, this.ScreenToView(point))) {
        this.ProcessMouseDown(dc, button, keys, this.GenCapturePosition(dc, keys, X, Y));
        if (this.FMouseOperation && this.FMouseLeftButtonDown() && this.FMouseOperation.Paint2NeedDown())
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
      if (this.FMouseOperation && (!this.FMouseOperation.Paint2NeedDown() || this.FMouseLeftButtonDown()))
        this.FMouseOperation.Paint2(dc);
      this.Paint2(dc);
      position = this.GenCapturePosition(dc, keys, X, Y);
      this.ProcessMouseMove(dc, keys, position);
      this.Paint2(dc);
      if (this.FMouseOperation && (!this.FMouseOperation.Paint2NeedDown() || this.FMouseLeftButtonDown()))
        this.FMouseOperation.Paint2(dc);
    }
    this.MousePosition(position);
    this.ReleaseDC(Handle, dc);
  },
  WMMouseUp: function (button, keys, x, y) {
    var point = { x: X, y: Y };
    var dc = GetDC(Handle);
    if (this.ProcessMouseUp0(dc, button, keys, this.ScreenToView(point))) {
      if (this.FMouseOperation && this.FMouseLeftButtonDown() && this.FMouseOperation.Paint2NeedDown())
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
      var flg = !this.FIdentityXY() && flag_shift;
      if (flag_ctrl) {
        var position;//(ScreenToView(ScreenToClient(MousePos)));
        flg = flg ? this.FGLBase.Zoom(position, 1, wheel) : this.FGLBase.Zoom(position, wheel);
      }
      else
        flg = flg ? this.FGLBase.Zoom(this.TPosition2D(), 1, wheel) : this.FGLBase.Zoom(this.TPosition2D(), wheel);
      if (flg) {
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
    this.OnKey(key, nkeys, -1);
  },

  AfterGLPaint: function (dc) { }, //视图绘制事件
  OnPaint: function (dc) { },
  OnPaint2: function (dc) { },
  OnMousePosition: function (position) { },
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
  OnViewRotated: function () {
    this.Invalidate();
  },
  OnInitializeView: function () { },
  OnMessage: function (msg, wparam, lparam) {

    //接受系统的事件
  },

  PositionXFixed: function (fixed) { },
  PositionYFixed: function (fixed) { },
  PositionXYFixed1: function (fixed) { },
  IdentityXY: function (identityxy) { },

  NeedDraw: function (needdraw) { },
  ModelBound: function (bds) { },
  ViewScale: function (viewscale) { },
  MapScale: function (mapscale) { },
  BasePosition: function () { },

  GLPa: function (glbase) { },
  RedrawView: function (redrawall) { },
  DrawViewDirectly: function () { },

  ModelToLocal: function (position) { },
  LocalToModel: function (localposition) { },
  ModelToMap: function (position) { },
  MapToModel: function (mapposition) { },
  MapToView: function (mapposition) { },
  ViewToMap: function (viewposition) { },
  ViewToModel: function (viewposition) { },
  ModelToView: function (position) { },

  DoAssign: function (handle) { },

  CreateGL: function () { },
  DeleteGL: function () { },
  GLBase: function (glbase) { },
  ViewChanged: function (changed) { },

  OnGLPa: function (glbase) { },
  OnRedrawView: function (redrawall) { },

  DrawView: function (dc) { },
  DrawViewOnPa: function () { },
}
