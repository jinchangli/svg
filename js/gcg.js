(function($) {

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

        if (points[end][0] == "z") {
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
                if (ele[0] == "M") {
                    str += "M" + ele[1] + "," + ele[2] + " ";
                } else if (ele[0] == "z") {
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

        var pathSelected = function(path) {
            $(path).parent().addClass("selected");
            selectedPath = path;
            $("#smooth").removeClass("disabled");
            highLightDotsInPath(path);
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
        svgRoot.node.onclick = function(event) {
            var t = $(event.target);
            if (t.is("path")) {
                state.selectPath(event.target);
            } else if (t.is("circle.dot")) {
                //  updatePathDotStatus(event.target);
            }
        }

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

//    document.addEventListener('DOMContentLoaded', function() {
//                var s = Snap("#gcgmap");
//                 s.node.onclick = function(event){
//                    if(event.target.nodeName === "path"){
//                        pathClick(event.target);
//                    }

//                 }


//         });

//         function pathClick(node){
//             var sNode = Snap(node);
//             sNode.attr({stroke:'red'});
//         }
