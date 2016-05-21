function TGLOperation() {
    if (this == window) {
        var obj = new TGLOperation();
        obj.constructor.apply(obj, arguments);
        return v;
    }
}

TGLOperation.prototype = {
    FGLView: null,
    MouseState: null,
    PopupMenu: null,
    Temporary: null,
    Paint2NeedDown: null,
    
    // 构造函数
    constructor: function (glView) {
        this.FGLView = glview;
        this.MouseState = 0;
        //Cursor(0)
        //PopupMenu(0)
    },

    // 事件
    OnMouseDown: null, //OnMouseDown(canvasObj, keys, position)
    OnMouseMove: null, //OnMouseMove(canvasObj, keys, position, downflag)
    OnMouseUp: null, //OnMouseUp(canvasObj, keys, position)
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
    OnMouseCapture2D:null,//OnMouseCapture2D(glbase, position, nearsetPosition)
    OnPaint: null, //OnPaint(canvasObj)
    OnPaint2: null, //OnPaint2(canvasObj)

    //
    MouseDown: function (canvasObj, keys, position) {
        if (this.OnMouseDown)
            this.OnMouseDown(canvasObj, keys, position);
    },
    MouseMove: function (canvasObj, keys, position, downflag) {
        if (this.OnMouseMove)
            this.OnMouseMove(canvasObj, keys, position, downflag);
    },
    MouseUp: function (canvasObj, keys, position) {
        if (this.OnMouseUp)
            this.OnMouseUp(canvasObj, keys, position);
    },
    MouseBegin: function () {
        if (this.OnMouseBegin)
            this.OnMouseBegin();
    },
    MouseEnd: function () {
        if (this.OnMouseEnd)
            this.OnMouseEnd();
    },
    MouseOK: function (state) {
        if (this.OnMouseOK)
            this.OnMouseOK(state);
    },
    MouseCancel: function (state) {
        if (this.OnMouseCancel)
            this.OnMouseCancel(state);
    },
    MouseUndo: function (state) {
        if (this.OnMouseUndo)
            this.OnMouseUndo(state);
    },
    MouseInsert: function (state) {
        if (this.OnMouseInsert)
            this.OnMouseInsert(state);
    },
    MouseDelete: function (state) {
        if (this.OnMouseDelete)
            this.OnMouseDelete(state);
    },
    MouseCommand: function (command, state) {
        if (this.OnMouseCommand)
            this.OnMouseCommand(command, state);
    },
    GetPopupMenu: function (popup_menu) {
        if (this.OnGetPopupMenu)
            this.OnGetPopupMenu(popup_menu);
    },
    MouseCapture: function (position, nearsetPosition) {
        if (this.OnMouseCapture)
            this.OnMouseCapture(position, nearsetPosition);
    },
    MouseCapature2D: function (glbase, position, nearsetPosition) {
        if (this.OnMouseCapture2D)
            this.OnMouseCapture2D(glbase, position, nearsetPosition);
    },
    Paint: function (canvasObj) {
        if (this.OnPaint)
            this.OnPaint(canvasObj);
    },
    Paint2: function (canvasObj) {
        if (this.OnPaint2)
            this.OnPaint2(canvasObj);
    },
    Invalidate: function () {
        if (this.FGLView)
            this.FGLView.Invalidate();
    }
}
