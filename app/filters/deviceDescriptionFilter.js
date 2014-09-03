'use strict';

define(['app'], function (app) {

    var deviceDescriptionFilter = function () {

        return function (devices, filterValue) {
            if (!filterValue) return devices;

            var matches = [];
            filterValue = filterValue.toLowerCase();
            for (var i = 0; i < devices.length; i++) {
                var device = devices[i];
                if (device.description.toLowerCase().indexOf(filterValue) > -1 ) {
                    matches.push(device);
                }
            }
            return matches;
        };
    };

    app.filter('deviceDescriptionFilter', deviceDescriptionFilter);

});