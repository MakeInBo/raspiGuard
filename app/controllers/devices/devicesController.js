'use strict';

define(['app'], function (app) {
    
    var devicesController = function ($rootScope, $scope, $location, $routeParams, $filter, dataService, modalService) {

        $rootScope.zoneID = ($routeParams.zoneID) ? parseInt($routeParams.zoneID) : -1;
        $rootScope.deviceID = -1;
       
        $scope.devices = [];
        $scope.filteredDevices = [];
        $scope.filteredCount = 0;
        $scope.orderby = 'device_id';
        $scope.reverse = false;
        
        if (angular.isUndefined($scope.events)) {$scope.events = [];};

        //paging
        $scope.totalRecords = 0;
        $scope.pageSize = 10;
        $scope.currentPage = 1;

        init();

        $scope.pageChanged = function (page) {
            $scope.currentPage = page;
            getDevices();
        };
        
        $scope.deleteDevice = function (id) {
            var device = getDeviceById(id);
            var deviceName = device.device_id + ' ' + device.description;

            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Delete Device',
                headerText: 'Delete ' + deviceName + '?',
                bodyText: 'Are you sure you want to delete this device?'
            };

            modalService.showModal({}, modalOptions).then(function (result) {
                if (result === 'ok') {
                    dataService.deleteDevice(id).then(function () {
                        for (var i = 0; i < $scope.devices.length; i++) {
                            if ($scope.devices[i].id == id) {
                                $scope.devices.splice(i, 1);
                                break;
                            }
                        }
                        filterDevices($scope.searchText);
                    }, function (error) {
                        alert('Error deleting device: ' + error.message);
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
            getDevices();
        }

        function createWatches() {
            //Watch searchText value and pass it and the devices to deviceDescriptionFilter
            //Doing this instead of adding the filter to ng-repeat allows it to only be run once (rather than twice)
            //while also accessing the filtered count via $scope.filteredCount above
            $scope.$watch("searchText", function (filterText) {
                filterDevices(filterText);
            });
        }

        function getDevices() {
            dataService.getDevices($scope.currentPage - 1, $scope.pageSize, $rootScope.zoneID)
            .then(function (data) {
                $scope.totalRecords = data.totalRecords;
                $scope.devices = data.results;
                dataService.getEvents()
                .then(function (data) {
                    $scope.events = data.results;
                    var dLen = $scope.devices.length;
                    var eLen = $scope.events.length;                  
                   //Iterate through device
                    for (var i = 0; i < dLen; i++) {
                       $scope.devices[i].eventCount = 0;
                       var vDk = parseInt ($scope.devices[i].device_id);
                       if (isNaN (vDk) ) {vDk = 0;};
                       for (var j = 0; j < eLen; j++) {
                           var vEk = parseInt ($scope.events[j].device_id);
                           if (isNaN (vEk) ) {vEk = 0;};
                           if (vDk === vEk) {
                               $scope.devices[i].eventCount++;
                           };
                       }
                    }
                }, function (error) {
                    alert(error.message);
                });
                filterDevices(''); //Trigger initial filter
            }, function (error) {
                alert(error.message);
            });
        }

        function filterDevices(filterText) {
            $scope.filteredDevices = $filter("deviceDescriptionFilter")($filter('orderBy')($scope.devices, 'device_id'), filterText);
            $scope.filteredCount = $scope.filteredDevices.length;
        }

        function getDeviceById(id) {
            for (var i = 0; i < $scope.devices.length; i++) {
                var device = $scope.devices[i];
                if (device.device_id === id) {
                    return device;
                }
            }
        }

    };

    app.register.controller('devicesController',
        ['$rootScope', '$scope', '$location', '$routeParams',  '$filter', 'dataService', 'modalService', devicesController]);

});