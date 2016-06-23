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

        view.FGLBase.GLRegions(data.isoLines);

        ctx.save();
        fontScale = 1;
        view.FGLBase.GLNotesMasks(data.isoLines, fontSize, "serif", fontScale, fontScale);
        view.FGLBase.GLISOLines(data.isoLines);
        ctx.restore();

        view.FGLBase.GLNotes(data.isoLines, fontScale, fontScale, fontSize, "serif");
        //
        view.FGLBase.DrawCanvasBorder();
        view.FGLBase.DrawViewGridXY(0.1);
        view.FGLBase.drawBiliChi();

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

    $(".smooth").click(function(event) {
        event.stopPropagation();
        $(this).toggleClass("selected");
        if ($(this).is('.selected')) {
            var operationForDot = new SmoothOperation(view);

            view.MouseOperation(operationForDot);
        } else {
            view.MouseOperation(null);
        }
    });

    $(".cutPath").click(function(event) {
        event.stopPropagation();

        $(this).toggleClass("selected");
        if ($(this).is('.selected')) {
            var operationForDot = new RedrawOperation(view);

            view.MouseOperation(operationForDot);
        } else {
            view.MouseOperation(null);
        }
    });


    $(".save").click(function() {
        // var pngUrl = $("#canvas")[0].toDataURL('image/png');
        // if ($(".download").length > 0) {
        //
        // } else {
        //     $("<a class='download' download='gcg.png'>下载</a>").insertAfter($(this));
        // }
        //
        // $(".download").attr("href", pngUrl);

        var win = window.open();
        win.document.write("<br><img src='" + $("#canvas")[0].toDataURL('image/png') + "'/>");
        //  win.print();
        //  win.location.reload();
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

    var configData = window.localStorage.getItem("editdata");
    if (configData) {
        var data = JSON.parse(configData);
    } else {
        window.location.href = "index.html";
    }

    // var wells =[];
    // if(data.wells){
    //   for(var i=0; i< dta.wells.length; i++)
    //   {
    //     var well
    //     wells.push();
    //   }
    // }

    $.post({
         url: "json/geo2.json",
        //url: "http://localhost:2665/api",
        data: {
            chazhi: data.chazhi,
            smooth: data.smooth,
            step: data.step?data.step:0,
            wells: "[]"
        },
        cache: false,
        dataType: "json"
    }).done(function(data) {
        $("#loading").hide();
        if (data) {
            originalData = data;
            if (!data.isoLines || data.isoLines.length == 0) {
                return;
            }

            for (var i = 0; i < data.isoLines.length; i++) {
                var item = data.isoLines[i];
                // if(item.isoValue < 2390 ||item.isoValue > 2400 ){
                //   data.isoLines.splice(i,1);
                //   i--;
                // }

                //  reorderNotes(data.isoLines[i]);

                calculateNotesPosition(data.isoLines[i]);
            }
            //
            state.viewData = clone(data);
            var bound = utility.GenBoundBox(data.isoLines);
            view.MapScale(1000);
            state.noteFontSize = mapToModel(0.003);
            state.lineWidth = mapToModel(0.0001);
            view.ModelBound(bound);
            view.ZoomViewExtent();
            fontScale = 96 / view.FGLBase.ViewScale();

            view.Paint();
        }
    }).fail(function(message) {
        $("#loading").hide();

        alert("获取等值线数据失败");
    });

});
