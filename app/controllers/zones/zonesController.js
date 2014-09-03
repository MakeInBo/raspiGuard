'use strict';

define(['app'], function (app) {
    
    var zonesController = function ($rootScope, $scope, $location, $filter, dataService, modalService) {

        $rootScope.zoneID = -1;
        $rootScope.deviceID = -1;
        
        $scope.zones = [];
        $scope.filteredZones = [];
        $scope.filteredCount = 0;
        $scope.orderby = 'zone_id';
        $scope.reverse = false;
        
        if (angular.isUndefined($scope.devices)) {$scope.devices = [];};

        //paging
        $scope.totalRecords = 0;
        $scope.pageSize = 10;
        $scope.currentPage = 1;

        init();

        $scope.pageChanged = function (page) {
            $scope.currentPage = page;
            getZones();
        };

        $scope.deleteZone = function (id) {
            var zone = getZoneById(id);
            var zoneName = zone.zone_id + ' ' + zone.description;

            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Delete Zone',
                headerText: 'Delete ' + zoneName + '?',
                bodyText: 'Are you sure you want to delete this zone?'
            };

            modalService.showModal({}, modalOptions).then(function (result) {
                if (result === 'ok') {
                    dataService.deleteZone(id).then(function () {
                        for (var i = 0; i < $scope.zones.length; i++) {
                            if ($scope.zones[i].id == id) {
                                $scope.zones.splice(i, 1);
                                break;
                            }
                        }
                        filterZones($scope.searchText);
                    }, function (error) {
                        alert('Error deleting zone: ' + error.message);
                    });
                }
            });
        };

        $scope.ViewEnum = {
            Card: 0,
            List: 1
        }

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
            getZones();
        }

        function createWatches() {
            //Watch searchText value and pass it and the zones to zoneDescriptionFilter
            //Doing this instead of adding the filter to ng-repeat allows it to only be run once (rather than twice)
            //while also accessing the filtered count via $scope.filteredCount above
            $scope.$watch("searchText", function (filterText) {
                filterZones(filterText);
            });
        }

        function getZones() {
            dataService.getZones($scope.currentPage - 1, $scope.pageSize)
            .then(function (data) {
                $scope.totalRecords = data.totalRecords;
                $scope.zones = data.results;
                var zon0 = {
                   zone_id : 0,
                   zone_parent : 0,
                   description : '## system ##',
                   position :'',
                   enabled : 1,
                   action  : ''
                };
                $scope.zones .push (zon0);
                $scope.totalRecords ++;
                dataService.getDevices()
                .then(function (data) {
                    $scope.devices = data.results;
                    var zLen = $scope.zones.length;
                    var dLen = $scope.devices.length;                  
                  //Iterate through device
                    for (var i = 0; i < zLen; i++) {
                       $scope.zones[i].deviceCount = 0;
                       var vZk = parseInt ($scope.zones[i].zone_id);
                       if (isNaN (vZk) ) {vZk = 0;};
                       for (var j = 0; j < dLen; j++) {
                           var vDk = parseInt ($scope.devices[j].zone_id);
                           if (isNaN (vDk) ) {vDk = 0;};
                           if (vZk === vDk) {
                               $scope.zones[i].deviceCount++;
                           };
                       }
                    }
                }, function (error) {
                    alert(error.message);
                });
                filterZones(''); //Trigger initial filter
            }, function (error) {
                alert(error.message);
            });
        }

        function filterZones(filterText) {
            $scope.filteredZones = $filter("zoneDescriptionFilter")($scope.zones, filterText);
            $scope.filteredCount = $scope.filteredZones.length;
        }

        function getZoneById(id) {
            for (var i = 0; i < $scope.zones.length; i++) {
                var zone = $scope.zones[i];
                if (zone.zone_id === id) {
                    return zone;
                }
            }
        }

    };

    app.register.controller('zonesController',
        ['$rootScope', '$scope', '$location', '$filter', 'dataService', 'modalService', zonesController]);

});