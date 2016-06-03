$(function() {

    var bound;
    var originalData;

    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");

    var view = window.view = new TGLView(ctx);
    view.AllowCapture = true;
    view.OnPaint = function() {
        window.ctx = this.Canvas;
        var data = state.viewData;

        view.ClearView();

        view.FGLBase.BeginLocal();

        view.FGLBase.GLRegions(data.isoLines);

        ctx.save();
        view.FGLBase.GLNotesMasks(data.isoLines, 32, "serif", 1, 1);
        view.FGLBase.GLISOLines(data.isoLines);
        ctx.restore();

        view.FGLBase.GLNotes(data.isoLines, 1, 1, 32, "serif");

        view.FGLBase.EndLocal();
    }

    $(document).keydown(function(event) {
        //  event.preventDefault();
        //event.stopImmediatePropagation();
        view.WMKeyDown(event.which);
    });

    $(document).keyup(function(event) {
        //  event.preventDefault();
        //event.stopImmediatePropagation();
        view.WMKeyUp(event.which);
    });

    $("canvas").mousedown(function(event) {
        // event.preventDefault();
        // event.stopImmediatePropagation();

        var y = event.offsetY;
        var x = event.offsetX;
        view.WMMouseDown(event, x, y);
    });

    $("canvas").mouseup(function(event) {
        event.preventDefault();
        event.stopImmediatePropagation();

        var y = event.offsetY;
        var x = event.offsetX;
        view.WMMouseUp(event, x, y);
    });

    $(document).mouseup(function(event) {
        // event.preventDefault();
        // event.stopImmediatePropagation();

        var y = event.offsetY;
        var x = event.offsetX;
        view.WMMouseUp(event, x, y);
    });

    $("canvas").click(function(event) {
        // event.preventDefault();
        // event.stopImmediatePropagation();
    });


    $("canvas").mousemove(function(event) {
        var y = event.offsetY;
        var x = event.offsetX;

        // 以下处理是为兼容IE浏览器
        event.which = 0;
        switch (event.buttons) {
            case 1:
                event.which = 1;
                break;
            case 2:
                event.which = 3;
                break;
            case 4:
                event.which = 2;
                break;
        }

        view.WMMouseMove(event, x, y);
    });


    $("#operationButtons>.btn").click(function(event) {
        if ($(this).is(".selected")) {
            $(this).removeClass("selected");
        } else {
            $("#operationButtons>button.selected").removeClass("selected")
            $(this).addClass("selected");
        }
    });

    //放大
    $(".zoomin").click(function(event) {
        view.ZoomViewIn();
        view.Paint();
    });

    //缩小
    $(".zoomout").click(function(event) {
        view.ZoomViewOut();
        view.Paint();
    });

    $(".zoomextent").click(function(event) {
        view.ZoomViewExtent();
        view.Paint();
    });

    $(".smooth").click(function(event) {
        event.stopPropagation();

        var operationForDot = new SmoothOperation(view);

        view.MouseOperation(operationForDot);
    });

    $(".cutPath").click(function(event) {
        event.stopPropagation();

        //cutPathByRemovingDots();
    });


    $(".save").click(function() {
        var pngUrl = $("#canvas")[0].toDataURL('image/png');
        if ($(".download").length > 0) {

        } else {
            $("<a class='download' download='gcg.png'>下载</a>").insertAfter($(this));
        }

        $(".download").attr("href", pngUrl);
    });

    $.ajax({
        url: "json/geo.json",
        cache: false,
        dataType: "json"
    }).done(function(data) {
        if (data) {
            originalData = data;
            state.viewData = clone(data);
            var bound = utility.GenBoundBox(data.isoLines);
            view.ModelBound(bound);
            view.ZoomViewExtent();
            view.Paint();
        }
    }).fail(function(message) {
        console.log(message);
    });

});
