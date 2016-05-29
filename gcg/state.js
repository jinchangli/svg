var state = (function() {
    var view = null;
    var selectedPath = null;
    var selectingPathDotsStatus = false;
    var selectedPoints = null;
    var pathIndex = null;

    var pathSelected = function(path) {
        selectedPath = path;
        $("#smooth").removeClass("disabled");
        highLightDotsInPath(path);
    }

    var clearSelectedState = function(path) {
        selectedPath = null;
        // $(path).parent().removeClass("selected");
        $("#smooth").addClass("disabled");
        removeHighLightDots(path);
        pathIndex = null;
    }

    var highLightDotsInPath = function(path) {

    }

    var removeHighLightDots = function() {

    }

    var clearSelectedState = function() {

    }

    return {
        getSelectedPath: function(params) {
            return selectedPath;
        },
        getSelectedPathIndex:function() {
            return pathIndex;
        },
        setSelectedPath: function(path, index) {
            // click on the same path twice, it will be unselected
            if (path == selectedPath) {
              clearSelectedState(selectedPath);
            } else {
                if (selectedPath) {
                    clearSelectedState(selectedPath);
                }

                if (path) {
                    pathSelected(path);
                    pathIndex = index;
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

        selectPoint:function(point) {
           if(!selectedPoints){
             selectedPoints = [];
           }

           selectedPoints.push(point);
        },
        tryUnselectPoint:function(point) {
            if(selectedPoints){
                var index = -1;
                for(var i = 0;i<selectedPoints.length;i++){
                  var p = selectedPoints[i];
                  if(p.is_eql(point)){
                    index = i;
                    break;
                  }
                }

                if(index==0){
                   selectedPath = null;
                }else if(index >0){

                }
            }
        }

    };

})();
