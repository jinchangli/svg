$(function() {
    var fontSize = "32";
    var fontScale = 0.2;
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

        view.FGLBase.BeginModel();

        // view.FGLBase.GLRegions(data.isoLines);

        // ctx.save();
        // view.FGLBase.GLNotesMasks(data.isoLines, fontSize, "serif", fontScale, fontScale);
        // view.FGLBase.GLISOLines(data.isoLines);
        // ctx.restore();
        //
        // view.FGLBase.GLNotes(data.isoLines, fontScale, fontScale, fontSize, "serif");

        view.FGLBase.DrawCanvasBorder();
        view.FGLBase.DrawViewGridXY(0.1);
        // view.FGLBase.drawBiliChi();

        view.FGLBase.GLBound();
        view.FGLBase.GLWells();
        view.FGLBase.GLFaults();


        if (view.FMouseOperation && view.FMouseOperation.restoreOperation) {
            view.FMouseOperation.restoreOperation();
        }

        view.FGLBase.EndModel();
    }


    $(document).keydown(function(event) {
        if (event.target && event.target.tagName == "INPUT") {
            return;
        }
        event.preventDefault();
        //event.stopImmediatePropagation();
        view.WMKeyDown(event.which);
    });

    $(document).keyup(function(event) {
        if (event.target && event.target.tagName == "INPUT") {
            return;
        }

        event.preventDefault();
        event.stopImmediatePropagation();
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

    $("canvas").dblclick(function(event) {
        // event.preventDefault();
        // event.stopImmediatePropagation();
        var y = event.offsetY;
        var x = event.offsetX;
        view.WMDblClick(event, x, y);
    });


    $("canvas").mousemove(function(event) {
        var y = event.offsetY;
        var x = event.offsetX;
        $("#screenPosition").text(x + ", " + y);

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


    addEvent(document, "mousewheel", function(event) {
        var src = event.srcElement || event.target;

        if (src && src.tagName == "CANVAS") {
            view.WMMouseWheel(event, event.delta, event.offsetX, event.offsetY);
            event.preventDefault();
        }
    });

    var updateButtonState = function(btnNode) {
        // if ($(btnNode).is(".selected")) {
        //     $(btnNode).removeClass("selected");
        // } else {
        //     $("#stateButtones button.selected").removeClass("selected")
        //     $(btnNode).addClass("selected");
        // }
        $("#stateButtones button.selected").removeClass("selected");
        $(btnNode).toggleClass("selected");
    }

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

    $(".border").click(function(event) {
        event.stopPropagation();
        $(this).toggleClass("selected");
        if ($(this).is('.selected')) {
            var mouseOperation = new CreateBoundsOperation(view);
            view.MouseOperation(mouseOperation);
            endWellCreation();
        } else {
            view.MouseOperation(null);
        }
    });

    $(".wells").click(function(event) {
        event.stopPropagation();

        $(this).toggleClass("selected");
        if ($(this).is('.selected')) {
            var operationForDot = new FakeWellsOperation(view);

            view.MouseOperation(operationForDot);

            $("#wellsOptions").show("slow");
        } else {
            view.MouseOperation(null);
        }
    });

    $(".fault").click(function(event) {
        event.stopPropagation();

        $(this).toggleClass("selected");
        if ($(this).is('.selected')) {
            var operationForDot = new CreateFaultOperation(view);

            view.MouseOperation(operationForDot);
            endWellCreation();

        } else {
            view.MouseOperation(null);
        }
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
         url: "json/geo2.json",
        // url: "http://localhost:2665/api",
        cache: false,
        dataType: "json"
    }).done(function(data) {
        if (data) {
            originalData = data;
            if (!data.isoLines || data.isoLines.length == 0) {
                return;
            }

            for (var i = 0; i < data.isoLines.length; i++) {
                calculateNotesPosition(data.isoLines[i]);
            }

            state.viewData = clone(data);
            var bound = utility.GenBoundBox(data.isoLines);
            view.MapScale(1000);
            view.ModelBound(bound);
            view.ZoomViewExtent();
            fontScale = 96 / view.FGLBase.ViewScale();
            state.noteFontSize = mapToModel(0.003);
            state.lineWidth = mapToModel(0.0001);
            state.maskLineWidth = screenToModel(1);
            state.wellSize = mapToModel(0.3);
            state.wellNameSize =  mapToModel(0.3);
            view.Paint();

            // createColorLegend($(".canvasContainer").parent(), data.clrTbl);
        }
    }).fail(function(message) {
        alert("获取等值线数据失败");
    });

});

$(function() {
    $(".isoLine").click(function() {
        var data = {
            "wells": view.wellPoints,
            "faults": view.faults,
            "bounds": view.borderPoints,
            "datasource": $("[name='dataSource']").val(),
            "step": $("[name='step']").val(),
            "chazhi": $("[name='chazhi']").val(),
            "smooth": $("[name='smooth']").val(),
        };
        var dataStr = JSON.stringify(data);
        window.localStorage.setItem("editdata", dataStr);
        window.open("isolines.html", "_blank");
    });

    var editMode = false;
    $(".isoLinesTitle").click(function() {
        if (!editMode) {
            var container = $(".isoLinesTitle");
            var editor = $("<input type='text' id='editor' style='width:100%;height:100%'/>");
            var text = container.text().trim();
            container.html("");
            container.append(editor);
            editor.val(text);
            editor.focus();
            editMode = true;
        }
    });

    $(".isoLinesTitle").on("change blur", "input", function() {
        var newText = $("#editor").val();
        $(".isoLinesTitle").html(newText);
        editMode = false;
    });

    $("#wellNameEditor").on("change blur", "input", function() {
        var newText = $(this).val();
        $("#wellNameEditor").hide();
        state.wellNameChanged(newText);
    });
});

function endWellCreation() {
    $(".wells").removeClass("selected");
    $("#wellsOptions").hide("slow");
}
