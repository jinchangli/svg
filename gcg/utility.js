var utility = {
    GenBoundBox: function(isoLines) {
        if (!isoLines || isoLines.length <= 0) {
            console.log("GLRegions, isoLines is empty");
            return;
        }

        var bound2D = TBound2D();

        for (var i = 0; i < isoLines.length; i++) {
            var line = isoLines[i].isoLine;

            if (!line || line.length == 0) {
                continue;
            }

            for (var pointIndex = 1; pointIndex < line.length; pointIndex++) {
                bound2D.SetBound(line[pointIndex].x, line[pointIndex].y);
            }
        }

        return bound2D;
    }
}


var GetMouseKeys = function(event) {
    var obj = {
        left: null,
        middle: null,
        right: null,
        shift: null,
        ctrl: null,
        alt: null
    }
    obj.left = event.which == 1;
    obj.middle = event.which == 2;
    obj.right = event.which == 3;
    obj.shift = event.shiftKey;
    obj.ctrl = event.ctrlKey;
    obj.alt = event.altKey;

    return obj;
}
