'use strict';

define(['app'], function (app) {
    
    var eventsController = function ($rootScope, $scope, $location, $routeParams, $filter, dataService, modalService) {

        $rootScope.zoneID = ($routeParams.zoneID) ? parseInt($routeParams.zoneID) : -1;
        $rootScope.eventID = -1;
       
        $scope.events = [];
        $scope.filteredEvents = [];
        $scope.filteredCount = 0;
        $scope.orderby = 'event_id';
        $scope.reverse = false;
        
        if (angular.isUndefined($scope.events)) {$scope.events = [];};

        //paging
        $scope.totalRecords = 0;
        $scope.pageSize = 10;
        $scope.currentPage = 1;

        init();

        $scope.pageChanged = function (page) {
            $scope.currentPage = page;
            getEvents();
        };
        
        $scope.deleteEvent = function (id) {
            var event = getEventById(id);
            var eventName = event.event_id + ' ' + event.description;

            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Delete Event',
                headerText: 'Delete ' + eventName + '?',
                bodyText: 'Are you sure you want to delete this event?'
            };

            modalService.showModal({}, modalOptions).then(function (result) {
                if (result === 'ok') {
                    dataService.deleteEvent(id).then(function () {
                        for (var i = 0; i < $scope.events.length; i++) {
                            if ($scope.events[i].id == id) {
                                $scope.events.splice(i, 1);
                                break;
                            }
                        }
                        filterEvents($scope.searchText);
                    }, function (error) {
                        alert('Error deleting event: ' + error.message);
                    });
                }
            });
        };

        $scope.ViewEnum = {
            Card: 0,
            List: 1
        };

        $scope.changeView = function (view) {
            switch (view) {
                case $scope.ViewEnum.Card:
                    $scope.listViewEnabled = false;
                    break;
                case $scope.ViewEnum.List:
                    $scope.listViewEnabled = true;
                    break;
            }
        };

        $scope.navigate = function (url) {
            $location.path(url);
        };

        $scope.setOrder = function (orderby) {
            if (orderby === $scope.orderby) {
                $scope.reverse = !$scope.reverse;
            }
            $scope.orderby = orderby;
        }; 
        
        function init() {
            createWatches();
            getEvents();
        }

        function createWatches() {
            //Watch searchText value and pass it and the events to eventDescriptionFilter
            //Doing this instead of adding the filter to ng-repeat allows it to only be run once (rather than twice)
            //while also accessing the filtered count via $scope.filteredCount above
            $scope.$watch("searchText", function (filterText) {
                filterEvents(filterText);
            });
        }

        function getEvents() {
console.log('getEvents');
            dataService.getEvents($scope.currentPage - 1, $scope.pageSize, $rootScope.zoneID)
            .then(function (data) {
                $scope.totalRecords = data.totalRecords;
                $scope.events = data.results;
                dataService.getDevices()
                .then(function (data) {
                    $scope.devices = data.results;
                    var eLen = $scope.events.length;                  
                    var dLen = $scope.devices.length;
                    //Iterate through elements
                    for (var i = 0; i < eLen; i++) {
                        var vEk = parseInt ($scope.events[i].device_id);
                        if (isNaN (vEk) ) {vEk = 0;};
                        $scope.events[i].description = vEk.toString();
                        for (var j = 0; j < dLen; j++) {
                            var vDk = parseInt ($scope.devices[j].device_id);
                            if (isNaN (vDk) ) {vDk = 0;};
                            if (vDk === vEk) {
                               $scope.events[i].description = $scope.devices[j].description;
                               break;
                            };
                        }
                    }
                }, function (error) {
                    alert(error.message);
                });
                filterEvents(''); //Trigger initial filter
            }, function (error) {
                alert(error.message);
            });
        }

        function filterEvents(filterText) {
            $scope.filteredEvents = $filter("eventDescriptionFilter")($filter('orderBy')($scope.events, 'description'), filterText);
            $scope.filteredCount = $scope.filteredEvents.length;
        }

        function getEventById(id) {
            for (var i = 0; i < $scope.events.length; i++) {
                var event = $scope.events[i];
                if (event.event_id === id) {
                    return event;
                }
            }
        }

    };

    app.register.controller('eventsController',
        ['$rootScope', '$scope', '$location', '$routeParams',  '$filter', 'dataService', 'modalService', eventsController]);

});