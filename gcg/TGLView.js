var TAutoViewType = {
    error: -1,
    avNone: 0,
    avMove: 1,
    avZoom: 2,
    avRotate: 3
};

var TGLView = function() {

}

TGLView.prototype = {
    _FGLDC: null,
    _FCursorOld: null,
    _FCapturedPosition: null,
    _FMouseOperation: null,
    _FMouseOperation0: null,
    _FTimeViewPosition1: null,
    _FTimeViewPosition2: null,
    _FAutoView: null,
    _FMouseLeftButtonDown: null,
    _FMouseMiddleButtonDown: null,
    _FMouseRightButtonDown: null,
    _FDoubleClicked: null,
    _FTemporaryFlag: null,
    _FCapturedFlag: null,
    _FEnableCapture: null,
    _FSmoothRender: null,
    _FNeedDeleteGL: null,
   _FCanDraw: null,
    _FValidFlag: null,
   _AllowCapture: null,
    _AllowAutoView: null,
    _MouseDownPosition: null,
    _MouseMovePosition: null,
    _MinMove: null,


    // User declarations
    _FGLBase:null,

    _FNeedDraw:null,
    _FIdentityXY: null,
    _FViewChanged,

    _MouseDownMapPosition: null,
    _MouseMoveMapPosition: null,
    _MouseDownModelPosition: null,
    _MouseMoveModelPosition: null,
    
    MouseOperation: function(operation) {},
    PositionFixed: function(fixed) {},
    ScaleFixed: function(fixed) {},
    DirectionFixed: function(fixed) {},
    MovingLimit: function(limit) {},
    MinZoom: function(min_zoom) {},
    MaxZoom: function(max_zoom) {},
    CanDraw: function(can_draw) {},
    SmoothRender: function(smoothrender) {},

    Pa: function(canvasObj) {},
    Pa2: function(canvasObj) {},
    MousePosition: function(position) {},
    ViewMoved: function() {},
    ViewZoomed: function() {},
    ViewRotated: function() {},

    TGLView: function(canvas) {},

    ViewToScreen: function(po2d){},
    ScreenToView: function(po){},

    CanEndTemporaryOperation: function() {},
    EndTemporaryOperation: function() {},
    EndMouseOperation: function() {},

    ZoomViewExtent: function(identify = false) {},
    ZoomViewIn: function() {},
    ZoomViewOut: function() {},

    EnterGL: function() {},
    LeaveGL: function() {},

    MouseOK: function(state) {},
    MouseCancel: function(state) {},
    MouseUndo: function(state) {},
    MouseInsert: function(state) {},
    MouseDelete: function(state) {},
    MouseCommand: function(command, state) {},

    MouseMoveLine: function(canvasObj) {},
    MouseMoveRect: function(canvasObj) {},

    MoveViewMouseMove: function(canvasObj, keys, position, downflag) {},
    ZoomInMouseUp: function(canvasObj, keys, position) {},
    ZoomOutMouseUp: function(canvasObj, keys, position) {},
    ZoomRectMouseUp: function(canvasObj, keys, position) {},
    ZoomViewMouseMove: function(canvasObj, keys, position, downflag) {},
    RotateViewMouseMove: function(canvasObj, keys, position, downflag) {},

    MouseOperation0: function(operation) {},
    EndTemporaryOperation0: function() {},
    EndMouseOperation0: function() {},

    SetAutoView: function(auto_view, p2, p1) {},
    ProcessMoveView: function(from, to, flag = false) {},

    BegemporaryOperation: function() {},

    ProcessZoomView: function(from, to, flag = false) {},

    GenCapturePosition: function(canvasObj, keys, x, y) {},
    DrawCapturedPo: function(canvasObj) {},

    ProcessMouseDown0: function(canvasObj, button, keys, position) {},
    ProcessMouseMove0: function(canvasObj, keys, position) {},
    ProcessMouseUp0: function(canvasObj, button, keys, position) {},

    ProcessMouseDown: function(canvasObj, button, keys, position) {},
    ProcessMouseMove: function(canvasObj, keys, position) {},
    ProcessMouseUp: function(canvasObj, button, keys, position) {},

    MoveView: function(from, to) {},
    ZoomView: function(position,  scale) {},
    ZoomViewRect: function( rect) {},
    InitializeView: function() {},

    WMMouseDown: function(button, keys, x, y) {},
    WMMouseMove: function(keys, x, y) {},
    WMMouseUp: function(button, keys, x, y) {},
    WMMouseWheel: function(keys, wheel_delta, x, y) {},
    WMDblClick: function(keys) {},
    WMKeyDown: function(key, nkeys) {},
    WMKeyUp: function(key, nkeys) {},

    AfterGLPa: function(canvasObj) {}, //视图绘制事件
    OnPa: function(canvasObj) {},
    OnPa2: function(canvasObj) {},
    OnMousePosition: function(position) {},
    OnKey: function(key, keys, state /*<0按下:null,>0抬起*/ ) {},
    OnViewMoved: function() {},
    OnViewZoomed: function() {},
    OnViewRotated: function() {},
    OnInitializeView: function() {},
    OnMessage: function(msg, wparam, lparam) {},

    PositionXFixed: function(fixed) {},
    PositionYFixed: function(fixed) {},
    PositionXYFixed1: function(fixed) {},
    IdentityXY: function(identityxy) {},

    NeedDraw: function(needdraw) {},
    ModelBound: function(bds) {},
    ViewScale: function(view_scale) {},
    MapScale: function(mapscale) {},
    BasePosition: function() {},

    GLPa: function(glbase) {},
    RedrawView: function(redraw_all) {},
    DrawViewDirectly: function() {},

    ModelToLocal: function(position){},
    LocalToModel: function(localposition){},
    ModelToMap: function(position){},
    MapToModel: function(mapposition){},
    MapToView: function(mapposition){},
    ViewToMap: function(viewposition){},
    ViewToModel: function(viewposition){},
    ModelToView: function(position){},

    Po2DToPo: function(po2d){},
    PoToPo2D: function(po){},

    DoAssign: function(handle) {},

    CreateGL: function() {},
    DeleteGL: function() {},
    GLBase: function(glbase) {},
    ViewChanged: function(changed) {},
    
    OnGLPa: function(glbase) {},
    OnRedrawView: function(redraw_all) {},

    DrawView: function(canvasObj) {},
    DrawViewOnPa: function() {},
}
