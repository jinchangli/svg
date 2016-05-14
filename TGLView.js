var TAutoViewType = {
    error: 0
    avNone: 0,
    avMove: 1,
    avZoom: 2,
    avRotate: 3
};

var TGLViewOperation = function() {

}

TGLViewOperation.prototype = {
    _FGLDC: null,
    _FCursorOld: null,
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
    AllowAutoView: null，
    MouseDownPosition: null,
    MouseMovePosition: null,
    MinMove: null,

    MouseOperation: function() {},
    MouseOperation: function(operation) {},
    PositionFixed: function() {},
    PositionFixed: function(fixed) {},
    ScaleFixed: function() {},
    ScaleFixed: function(fixed) {},
    DirectionFixed: function() {},
    DirectionFixed: function(fixed) {},
    MovingLimit: function() {},
    MovingLimit: function(limit) {},
    MinZoom: function() {},
    MinZoom: function(min_zoom) {},
    MaxZoom: function() {},
    MaxZoom: function(max_zoom) {},
    CanDraw: function() {},
    CanDraw: function(can_draw) {},
    SmoothRender: function() {},
    SmoothRender: function(smoothrender) {},

    Pa: function(canvasObj) {},
    Pa2: function(canvasObj) {},
    MousePosition: function(position) {},
    ViewMoved: function() {},
    ViewZoomed: function() {},
    ViewRotated: function() {},

    TGLView: function(var canvas) {},

    ViewToScreen: function(po2d),
    ScreenToView: function(po),

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
    MouseCommand: function(command: null, state) {},

    MouseMoveLine: function(canvasObj) {},
    MouseMoveRect: function(canvasObj) {},

    MoveViewMouseMove: function(canvasObj: null, keys: null, position: null, downflag) {},
    ZoomInMouseUp: function(canvasObj: null, keys: null, position) {},
    ZoomOutMouseUp: function(canvasObj: null, keys: null, position) {},
    ZoomRectMouseUp: function(canvasObj: null, keys: null, position) {},
    ZoomViewMouseMove: function(canvasObj: null, keys: null, position: null, downflag) {},
    RotateViewMouseMove: function(canvasObj: null, keys: null, position: null, downflag) {},

    MouseOperation0: function(operation) {},
    EndTemporaryOperation0: function() {},
    EndMouseOperation0: function() {},

    SetAutoView: function(TAutoViewType auto_view: null, p2: null, p1) {},
    ProcessMoveView: function(from: null, to: null, flag = false) {},

    BegemporaryOperation: function() {},

    ProcessZoomView: function(from: null, to: null, flag = false) {},

    GenCapturePosition: function(canvasObj: null, keys: null, x: null, y) {},
    DrawCapturedPo: function(canvasObj) {},

    ProcessMouseDown0: function(canvasObj: null, button: null, keys: null, position) {},
    ProcessMouseMove0: function(canvasObj: null, keys: null, position) {},
    ProcessMouseUp0: function(canvasObj: null, button: null, keys: null, position) {},

    ProcessMouseDown: function(canvasObj: null, button: null, keys: null, position) {},
    ProcessMouseMove: function(canvasObj: null, keys: null, position) {},
    ProcessMouseUp: function(canvasObj: null, button: null, keys: null, position) {},
    ZoomView: function(double scale) {},
    MoveView: function(from: null, to) {},
    ZoomView: function(position: null, double scale) {},
    ZoomViewRect: function(Terval2D rect) {},
    InitializeView: function() {},

    WMMouseDown: function(button: null, keys: null, x: null, y) {},
    WMMouseMove: function(keys: null, x: null, y) {},
    WMMouseUp: function(button: null, keys: null, x: null, y) {},
    WMMouseWheel: function(keys: null, wheel_delta: null, x: null, y) {},
    WMDblClick: function(keys) {},
    WMKeyDown: function(key: null, nkeys) {},
    WMKeyUp: function(key: null, nkeys) {},

    AfterGLPa: function(canvasObj) {}, //视图绘制事件
    OnPa: function(canvasObj) {},
    OnPa2: function(canvasObj) {},
    OnMousePosition: function(position) {},
    OnKey: function(key: null, keys: null, state /*<0按下:null,>0抬起*/ ) {},
    OnViewMoved: function() {},
    OnViewZoomed: function() {},
    OnViewRotated: function() {},
    OnInitializeView: function() {},
    OnMessage: function(msg: null, wparam: null, lparam) {},

    PositionXFixed: function() {},
    PositionXFixed: function(fixed) {},
    PositionYFixed: function() {},
    PositionYFixed: function(fixed) {},
    PositionXYFixed1: function() {},
    PositionXYFixed1: function(fixed) {},
    IdentityXY: function() {},
    IdentityXY: function(identityxy) {},

    // User declarations
    FGLBase:null,

    FNeedDraw: null,
    FIdentityXY: null,
    FViewChanged,

    MouseDownMapPosition: null,
    MouseMoveMapPosition: null,
    MouseDownModelPosition: null,
    MouseMoveModelPosition: null,

    NeedDraw: function() {},
    NeedDraw: function(needdraw) {},
    TBound2D ModelBound: function() {},
    ModelBound: function(TBound2D bds) {},
    TVector2D ViewScale: function() {},
    ViewScale: function(TVector2D view_scale) {},
    TVector2D MapScale: function() {},
    MapScale: function(TVector2D mapscale) {},
    BasePosition: function() {},

    GLBase: function() {},
    GLPa: function(TGLBase * glbase) {},
    RedrawView: function(redraw_all) {},
    DrawViewDirectly: function() {},

    ModelToLocal: function(position),
    LocalToModel: function(localposition),
    ModelToMap: function(position),
    MapToModel: function(mapposition),
    MapToView: function(mapposition),
    ViewToMap: function(viewposition),
    ViewToModel: function(viewposition),
    ModelToView: function(position),

    Po2DToPo: function(po2d),
    PoToPo2D: function(po),

    DoAssign: function(HWND handle) {},

    CreateGL: function() {},
    DeleteGL: function() {},
    GLBase: function(glbase) {},
    ViewChanged: function(changed) {},

    OnMessage: function(msg: null, wparam: null, lparam) {},
    OnGLPa: function(glbase) {},
    OnRedrawView: function(redraw_all) {},
    OnInitializeView: function() {},

    DrawView: function(canvasObj) {},
    DrawViewOnPa: function() {},
}
