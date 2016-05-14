(function($) {
  var pathDblClicked = null;

    var Process = function(name) {
        this.name = name;
    }

    Process.prototype = {
        name: null,
        steps: null,
        elements: null,
        actions: null,
        _currentStepIndex: null,
        doActions: function() {
            var that = this;
            if (this.actions && this.actions.length > 0) {
                $.each(this.actions, function(index, item) {
                    item(that.elements);
                });
            }
        },
        start: function() {
            var that = this;
            that.reset();
            that.nextStep();
        },
        nextStep: function() {
            var that = this;
            if (that.steps && that.steps.length > (that._currentStepIndex + 1)) {
                that._currentStepIndex++;
                that.steps[that._currentStepIndex]();
            } else {
                that.doActions();
            }
        },
        reset:function() {
            this._currentStepIndex = -1;
        }
    };

    var SmoothProcess = function() {
        var that = this;
        var step1 = function() {
            $("#messageBox").text("双击等值线上某个区域可以平滑整条曲线， 或者单击一个区域后手动选择部分点进行平滑");
            pathDblClicked = function(path) {
              that.smoothPath(path);
            }
        }

        var step2 = function() {
            $("#messageBox").text("succeed");
        }

        this.steps = [];
        this.steps.push(step1);
        this.steps.push(step2);
    }

    SmoothProcess.prototype = new Process();
    SmoothProcess.prototype.smoothPath = function(path) {
      var pathStr = $(path).attr("d");

      var points = Snap.parsePathString(pathStr);
      points = smoothDots(points);

      pathStr = Snap.parsePathSegments(points);

      $(path).attr("d", pathStr);
    }

    var highLightDotsInPath = function(path) {
        var $path = Snap(path);
        var points = Snap.parsePathString($path.attr("d"));
        var group = $path.parent();

        for (var i = 0; i < points.length; i++) {
            var p = points[i];
            var dot = group.circle(p[1], p[2], 5);
            dot.addClass("dot");
            //group.prepend(dot);
        }
    }

    var removeHighLightDots = function(path) {
        var $path = Snap(path);
        var group = $path.parent();

        var dots = group.selectAll("circle");

        for (var i = 0; i < dots.length; i++) {
            var p = dots[i];
            p.remove();
        }
    }

    var doesRemoveableDotsExist = function(exist) {
        $("#cutPath").toggleClass("disabled", !exist);
    }

    var updatePathDotStatus = function(dot) {
        var $dot = Snap(dot);
        $dot.toggleClass("selected");
    }

    var smoothDots = function(points) {
        var resultArray = [];
        $.each(points, function(index, ele) {

        })

        var start = 0,
            end = points.length - 1;

        if (points[end][0] == "z" || points[end][0] == "Z") {
            end--;
        }

        var x0 = points[start][1],
            y0 = points[end][2];
        for (var i = start + 1; i <= (end - 1); i++) {
            points[i][1] = (x0 + 2 * points[i][1] + points[i + 1][1]) / 4;
            points[i][2] = (y0 + 2 * points[i][2] + points[i + 1][2]) / 4;

            x0 = points[i][1];
            y0 = points[i][2]
        }

        return points;
    }

    Snap.parsePathSegments = function(points) {
        if (points) {
            var str = "";
            $.each(points, function(index, ele) {
                if (ele[0] == "M" || ele[0] == "m") {
                    str += "M" + ele[1] + "," + ele[2] + " ";
                } else if (ele[0] == "z" || ele[0] == "Z") {
                    str += "z";
                } else {
                    str += ele[1] + "," + ele[2] + " ";
                }
            });

            return str;
        } else {
            return null;
        }
    }

    var smoothSelectedPath = function() {
        var selectedPath = state.getSelectedPath();

        removeHighLightDots(selectedPath);

        var pathStr = $(selectedPath).attr("d");
        var pathArray = pathStr.split(" ");

        var points = Snap.parsePathString(pathStr);
        points = smoothDots(points);

        pathStr = Snap.parsePathSegments(points);

        $(selectedPath).attr("d", pathStr);

        highLightDotsInPath(selectedPath);
    }

    var cutPathByRemovingDots = function() {
        var selectedPath = Snap(state.getSelectedPath());

        var selectedDots = selectedPath.parent().selectAll(".selected");
        var points = [];
        $.each(selectedDots, function(index, ele) {
            var $ele = Snap(ele);
            points.push($ele.attr("cx") + "," + $ele.attr("cy") + " ");
            $ele.remove();
        });

        var pathStr = selectedPath.attr("d");
        $.each(points, function(index, element) {
            pathStr = pathStr.replace(element, "");
        });

        selectedPath.attr({
            d: pathStr
        });

        $("#cutPath").toggleClass("disabled", true);
    }

    var state = (function() {
        var selectedPath = null;
        var selectingPathDotsStatus = false;
        var pathSelectedListener = null;

        var pathSelected = function(path) {
            $(path).parent().addClass("selected");
            selectedPath = path;
            $("#smooth").removeClass("disabled");
            highLightDotsInPath(path);
            if (pathSelectedListener) {
                pathSelectedListener();
            }
        }

        var clearSelectedState = function(path) {
            selectedPath = null;
            $(path).parent().removeClass("selected");
            $("#smooth").addClass("disabled");
            removeHighLightDots(path);
        }


        return {
            getSelectedPath: function(params) {
                return selectedPath;
            },
            selectPath: function(path) {
                // click on the same path twice, it will be unselected
                if (path == selectedPath) {
                    clearSelectedState(selectedPath);
                } else {
                    if (selectedPath) {
                        clearSelectedState(selectedPath);
                    }

                    if (path) {
                        pathSelected(path);
                    }
                }
            },
            selectingDots: function(dot) {
                updatePathDotStatus(dot);
                selectingPathDotsStatus = true;
            },
            isSelectingPathDots: function() {
                return selectingPathDotsStatus;
            },
            stopSelectingPathDots: function() {
                selectingPathDotsStatus = false;
            },
            pathSelectedEvent: function(callBack) {
                pathSelectedListener = callBack;
            },
            removePathSelectedEvent: function(callBack) {
                pathSelectedListener = null;
            }
        };

    })();


    var colorTable = [{
            min: 0,
            max: 5000,
            value: "#FF0000"
        }, {
            min: 5001,
            max: 6000,
            value: "#FF7F00"

        }, {
            min: 6001,
            max: 8000,
            value: "#FFBF00"
        }, {
            min: 8001,
            max: 10000,
            value: "#7ACC00"
        }, {
            min: 10001,
            max: 15000,
            value: "#008000"
        },

    ];

    var getFillColor = function(value) {
        for (var i = 0; i < colorTable.length; i++) {
            var item = colorTable[i];
            if (item.min <= value && item.max >= value) {
                return item.value;
            }
        }
    }

    $(function(params) {

        //binding events
        var svgRoot = Snap("#gcgmap");
        svgRoot.click(function(event) {
            var t = $(event.target);
            if (t.is("path")) {
                state.selectPath(event.target);
            } else if (t.is("circle.dot")) {
                //  updatePathDotStatus(event.target);
            }
        });

        svgRoot.dblclick(function(event) {
          var t = $(event.target);
          if (t.is("path")) {
            if(pathDblClicked){
              pathDblClicked(event.target);
            }
          } else if (t.is("circle.dot")) {
              //  updatePathDotStatus(event.target);
          }
        });

        svgRoot.mousedown(function(event) {
            event.stopPropagation();
            $("circle.dot.selected").removeClass("selected");
            doesRemoveableDotsExist($("circle.dot.selected:eq(0)").length > 0);
            var t = $(event.target);
            if (t.is("circle.dot")) {
                state.selectingDots(t[0]);
            }
        });

        svgRoot.mouseup(function(event) {
            event.stopPropagation();

            if (state.isSelectingPathDots()) {
                state.stopSelectingPathDots();

                doesRemoveableDotsExist($("circle.dot.selected:eq(0)").length > 0);
            }
        });

        svgRoot.mouseover(function(event) {
            event.stopPropagation();

            var t = $(event.target);
            if (state.isSelectingPathDots()) {
                if (t.is("circle.dot")) {
                    state.selectingDots(t[0]);
                }
            }
        });


        var currentProcess = null;
        $("#operationButtons>button").click(function(event) {
            if ($(this).is(".selected")) {
                $(this).removeClass("selected");
            } else {
                $("#operationButtons>button.selected").removeClass("selected")
                $(this).addClass("selected");
                if (currentProcess == null) {
                    currentProcess = new SmoothProcess();
                    currentProcess.start();
                }
            }
        });

        $("#smooth").click(function(event) {
            event.stopPropagation();

            smoothSelectedPath();
        });

        $("#cutPath").click(function(event) {
            event.stopPropagation();

            cutPathByRemovingDots();
        });

        // load the contour line data from server
        $.getJSON("geo.json", function(data) {
            //only if it contains any path data
            if (data.length) {
                for (var i = 0; i < data.length; i++) {
                    var item = data[i];
                    var path = svgRoot.path(item.path);
                    var textPoint = path.getPointAtLength(path.getTotalLength() / 2);
                    var text = svgRoot.text(textPoint.x, textPoint.y, item.value);
                    var group = svgRoot.group(path, text);
                    var color = getFillColor(item.value);
                    path.attr({
                        fill: color
                    });

                }
            }
        });

        //load the wells data
        $.getJSON("wells.json", function(data) {
            if (data.length) {

                for (var i = 0; i < data.length; i++) {
                    var item = data[i];
                    var circle = svgRoot.circle(item.x, item.y, 10);
                    var line1 = svgRoot.line(item.x - 10, item.y, item.x + 10, item.y);
                    var line2 = svgRoot.line(item.x, item.y - 10, item.x, item.y + 10);

                    var wellName = svgRoot.text(item.x + 10, item.y - 10, item.name);
                    svgRoot.group(circle, line1, line2, wellName);
                }
            }
        });
    });
})(jQuery);
