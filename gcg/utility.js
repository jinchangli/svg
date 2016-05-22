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
