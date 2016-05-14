function TGLView2DBase() {

}

TGLView2DBase.prototype = {
    FNeedDraw: function (need) {

    },
    FIdentityXY: function (params) {

    },
    Destruction: function (params) {
        this.DeleteGL();
    },
    GLBase: function (glbase) {
        if (glbase == undefined) {
            return this.FGLBase;
        } else {
            if (this.FGLBase != glbase) {
                if ((this.FGLBase = glbase) != 0) {
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
    PositionXFixed: function (fixed) {
        if (fixed == undefined) {
            return this.FGLBase ? this.FGLBase.PositionXFixed() : false;
        } else {
            if (this.FGLBase)
                this.FGLBase.PositionXFixed(fixed);
        }
    },
    PositionYFixed: function (fixed) {
        if (fixed == undefined) {
            return this.FGLBase ? this.FGLBase.PositionYFixed() : false;
        } else {
            if (this.FGLBase)
                this.FGLBase.PositionYFixed(fixed);
        }
    },
    PositionXYFixed1: function (fixed) {
        if (fixed == undefined) {
            return this.FGLBase ? this.FGLBase.PositionXYFixed1() : false;
        } else {
            if (this.FGLBase)
                this.FGLBase.PositionXYFixed1(fixed);
        }
    },
    ModelBound: function (bds) {
        if (bds == undefined) {
            return this.FGLBase ? this.FGLBase.ModelBound() : this.TBound2D();

        } else {
            if (this.FGLBase) {
                this.FGLBase.ModelBound(bds);
                this.NeedDraw(true);
                this.Invalidate();
            }
        }
    },

    CreateGL: function () {
        var rect;
        rect = this.GetClientRect(Handle);
        this.GLBase(new TGDI2DForView(rect.right - rect.left, rect.bottom - rect.top));
        var dc = GetDC(Handle);
        this.FGLBase.ViewResolutionDPI(TVector2D(this.GetDeviceCaps(dc, LOGPIXELSX), this.GetDeviceCaps(dc, LOGPIXELSY)));
        this.ReleaseDC(Handle, dc);
    },
    DeleteGL: function () {
        if (this.FGLBase) {
            this.FGLBase = null;
            this.FGLBase = 0;
        }
    },
    GLPaint(glbase) {
        this.OnGLPaint(glbase);
    },
    OnGLPaint: function (glbase) {
    },
    RedrawView: function (redraw_all) {
        OnRedrawView(redraw_all);
    },
    OnRedrawView: function (bool) {
    },
    OnInitializeView: function () {
    },
    DrawView: function (dc) {
        var color = TRGBColor();
        color.Color(Color);
        if (this.FGLBase) {
            this.FGLBase.GLPainting(false, dc);
            this.GLPaint(glview);
            this.FGLBase.GLPainting(false, 0);
        }
        this.FNeedDraw(false);
        this.FViewChanged(false);
        flag = this.FMouseOperation && (!this.FMouseOperation.Paint2NeedDown() || this.FMouseLeftButtonDown());
        if (this.FMouseOperation0 || flag || this.FCapturedFlag()) {
            this.Paint(dc);
            this.Paint2(dc);
            if (this.FMouseOperation0)
                this.FMouseOperation0.Paint(dc);
            if (this.FMouseOperation)
                this.FMouseOperation.Paint(dc);
            if (flag)
                this.FMouseOperation.Paint2(dc);
            if (this.FCapturedFlag())
                this.DrawCapturedPoint(dc);
        }
    },
    DrawViewOnPaint: function () {
        var ps = PAINTSTRUCT();
        var dc = this.BeginPaint(Handle, ps);
        SetBkColor(dc, Color);
        this.DrawView(dc);
        this.EndPaint(Handle,ps);
    },
    DrawViewDirectly: function () {
        var dc = GetDC(Handle);
        this.DrawView(dc);
        this.ReleaseDC(Handle, dc);
    },
    OnMessage: function (msg, wparam, lparam) {
        switch (msg) {
            case WM_PAINT:
                if (this.FCanDraw()) {
                    this.FCapturedFlag(false);
                    if (this.FGLBase)
                        this.DrawViewOnPaint();
                }
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
        if (view_scale == undefined) {
            if (this.FGLBase)
                return this.FGLBase.ViewScale();
            return TVector2D(1, 1);
        }

        if (this.FGLBase)
            this.FGLBase.ViewScale(view_scale);
    },
    MapScale: function (mapscale) {
        if (mapscale == undefined) {
            if (this.FGLBase)
                return this.FGLBase.MapScale();
            return TVector2D(1, 1);
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
        if (need_draw == undefined) {
            return FNeedDraw();
        }
        if (need_draw) {
            FNeedDraw(true);
            RedrawView(true);
        }
    },
    ViewChanged: function (changed) {
        if (changed) {
            FViewChanged(true);
            RedrawView(false);
        }
    },
    IdentityXY: function (identityxy) {
        if (identityxy == undefined) {
            return FIdentityXY();
        }

        if (FIdentityXY() != identityxy) {
            FIdentityXY(identityxy);
            if (FIdentityXY()) {
                this.FGLBase.ViewScale(TVector2D(this.FGLBase.ViewScale().X, this.FGLBase.ViewScale().X));
                NeedDraw(true);
                Invalidate();
            }
        }
    },
    DoAssign: function (handle) {
        handle0 = Handle;
        if (handle0 != handle) {
            if (Handle)
                DeleteGL();
            TViewBase.DoAssign(handle);
            if (Handle) {
                CreateGL();
                InitializeView();
            }
        }
    }
}