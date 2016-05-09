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

    var clickedOnPathDot = function(dot) {
        var $dot = Snap(dot);
        $dot.toggleClass("selected");

        doesRemoveableDotsExist($dot.parent().select("circle.dot.selected"));
    }


    var smoothSelectedPath = function() {
        var selectedPath = state.getSelectedPath();

        removeHighLightDots(selectedPath);

        var pathStr = $(selectedPath).attr("d");
        var pathArray = pathStr.split(" ");
        var newPathStr = "";

        for (i = 0; i < pathArray.length; i = i + 3) {
            newPathStr += pathArray[i] + " ";
        }

        $(selectedPath).attr("d", newPathStr);

        highLightDotsInPath(selectedPath);
    }

    var cutPathByRemovingDots = function() {
      var selectedPath =Snap( state.getSelectedPath());

      var selectedDots =selectedPath.parent().selectAll(".selected");
      var points=[];
      $.each(selectedDots, function(index, ele) {
        var $ele = Snap(ele);
        points.push($ele.attr("cx") +","+$ele.attr("cy")+" ");
        $ele.remove();
      });

      var pathStr = selectedPath.attr("d");
      $.each(points, function(index, element) {
          pathStr = pathStr.replace(element, "");
      });

      selectedPath.attr({d: pathStr});

        $("#cutPath").toggleClass("disabled", true);
    }

    var state = (function() {
        var selectedPath = null;

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
                clickedOnPathDot(event.target);
            }
        }

        $("#smooth").click(function(event) {
            smoothSelectedPath();
        });

        $("#cutPath").click(function(event) {
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
