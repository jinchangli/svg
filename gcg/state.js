var state = (function() {
    var view = null;
    var selectedPath = null;
    var selectingPathDotsStatus = false;
    var selectedPoints = null;
    var pathIndex = null;
    var wellNameChangeListeners = [];

    var pathSelected = function(path) {
        selectedPath = path;
        $("#smooth").removeClass("disabled");
        highLightDotsInPath(path);
    }

    var clearSelectedState = function() {
        selectedPath = null;
        pathIndex = null;
    }

    var highLightDotsInPath = function(path) {

    }

    var removeHighLightDots = function() {

    }

    return {
        listenWellNameChange: function(listener) {
          wellNameChangeListeners.push(listener);
        },
        unlistenWellNameChange: function(listener) {
          if(wellNameChangeListeners.length>0){
            wellNameChangeListeners.splice(0,1);
          }
        },
        wellNameChanged: function(newName) {
            for(var i=0; i<wellNameChangeListeners.length;i++){
               wellNameChangeListeners[i](newName);
            }
        },
        getSelectedPath: function(params) {
            return selectedPath;
        },
        getSelectedPathIndex: function() {
            return pathIndex;
        },
        clearSelectedState: clearSelectedState,
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

        selectPoint: function(point) {
            if (!selectedPoints) {
                selectedPoints = [];
            }

            selectedPoints.push(point);
        },
        tryUnselectPoint: function(point) {
            if (selectedPoints) {
                var index = -1;
                for (var i = 0; i < selectedPoints.length; i++) {
                    var p = selectedPoints[i];
                    if (p.is_eql(point)) {
                        index = i;
                        break;
                    }
                }

                if (index == 0) {
                    selectedPath = null;
                } else if (index > 0) {

                }
            }
        }

    };

})();
