
function TGLOperation() {
    this.constructor.apply(this, arguments);
}

TGLOperation.prototype = {
    FGLView: null,
    MouseState: null,
    PopupMenu: null,
    Temporary: null,
    Paint2NeedDown: null,

    // 构造函数
    constructor: function(glView) {
        this.FGLView = glView;
        this.MouseState = 0;
        //Cursor(0)
        //PopupMenu(0)
    },

    // 事件
    OnMouseDown: null, //OnMouseDown(keys, position)
    OnMouseMove: null, //OnMouseMove(keys, position, downflag)
    OnMouseUp: null, //OnMouseUp(keys, position)
    OnMouseBegin: null, //OnMouseBegin()
    OnMouseEnd: null, //OnMouseEnd()
    OnMouseOK: null, //OnMouseOK(state)
    OnMouseCancel: null, //OnMouseCancel(state)
    OnMouseUndo: null, //OnMouseUndo(state);
    OnMouseInsert: null, //OnMouseInsert(state)
    OnMouseDelete: null, //OnMouseDelete(state)
    OnMouseCommand: null, //OnMouseCommand(command, state)
    OnGetPopupMenu: null, //OnGetPopupMenu(popup_menu)
    OnMouseCapture: null, //OnMouseCapture(position, nearsetPosition)
    OnMouseCapture2D: null, //OnMouseCapture2D(glbase, position, nearsetPosition)
    OnPaint: null, //OnPaint(canvasObj)
    OnPaint2: null, //OnPaint2(canvasObj)

    //
    MouseDown: function(keys, position) {
        if (this.OnMouseDown)
            this.OnMouseDown(keys, position);
    },
    MouseMove: function(keys, position, downflag) {
        if (this.OnMouseMove)
            this.OnMouseMove(keys, position, downflag);
    },
    MouseUp: function(keys, position) {
        if (this.OnMouseUp)
            this.OnMouseUp(keys, position);
    },
    MouseBegin: function() {
        if (this.OnMouseBegin)
            this.OnMouseBegin();
    },
    MouseEnd: function() {
        if (this.OnMouseEnd)
            this.OnMouseEnd();
    },
    MouseOK: function(state) {
        if (this.OnMouseOK)
            this.OnMouseOK(state);
    },
    MouseCancel: function(state) {
        if (this.OnMouseCancel)
            this.OnMouseCancel(state);
    },
    MouseUndo: function(state) {
        if (this.OnMouseUndo)
            this.OnMouseUndo(state);
    },
    MouseInsert: function(state) {
        if (this.OnMouseInsert)
            this.OnMouseInsert(state);
    },
    MouseDelete: function(state) {
        if (this.OnMouseDelete)
            this.OnMouseDelete(state);
    },
    MouseCommand: function(command, state) {
        if (this.OnMouseCommand)
            this.OnMouseCommand(command, state);
    },
    GetPopupMenu: function(popup_menu) {
        if (this.OnGetPopupMenu)
            this.OnGetPopupMenu(popup_menu);
    },
    MouseCapture: function(position) {
        if (this.OnMouseCapture)
          return this.OnMouseCapture(position);
    },
    MouseCapture2D: function(glbase, position) {
        if (this.OnMouseCapture2D)
          return this.OnMouseCapture2D(glbase, position);
    },
    Paint: function(canvasObj) {
        if (this.OnPaint)
            this.OnPaint(canvasObj);
    },
    Paint2: function(canvasObj) {
        if (this.OnPaint2)
            this.OnPaint2(canvasObj);
    },
    Invalidate: function() {
        if (this.FGLView)
            this.FGLView.Invalidate();
    }
}
