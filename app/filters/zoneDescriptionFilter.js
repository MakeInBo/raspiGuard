'use strict';

define(['app'], function (app) {

    var zoneDescriptionFilter = function () {

        return function (zones, filterValue) {
            if (!filterValue) return zones;

            var matches = [];
            filterValue = filterValue.toLowerCase();
            for (var i = 0; i < zones.length; i++) {
                var zone = zones[i];
                if (zone.description.toLowerCase().indexOf(filterValue) > -1 ) {
                    matches.push(zone);
                }
            }
            return matches;
        };
    };

    app.filter('zoneDescriptionFilter', zoneDescriptionFilter);

});