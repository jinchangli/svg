var state = (function() {
    var view = null;
    var selectedPath = null;
    var selectingPathDotsStatus = false;

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
        setSelectedPath: function(path) {
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
