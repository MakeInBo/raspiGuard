'use strict';

define(['app'], function (app) {

    var eventDescriptionFilter = function () {

        return function (events, filterValue) {
            if (!filterValue) return events;

            var matches = [];
            filterValue = filterValue.toLowerCase();
            for (var i = 0; i < events.length; i++) {
                var event = events[i];
                if (event.description.toLowerCase().indexOf(filterValue) > -1 ) {
                    matches.push(event);
                }
            }
            return matches;
        };
    };

    app.filter('eventDescriptionFilter', eventDescriptionFilter);

});