'use strict';

define(['app'], function (app) {

    var devicesController = function ($rootScope, $scope, $location, $routeParams, $timeout, config, dataService, modalService) {

        var deviceID = ($routeParams.deviceID) ? parseInt($routeParams.deviceID) : 0,
            timer,
            onRouteChangeOff;

        $scope.device;
        $scope.title = (deviceID > 0) ? 'Edit' : 'Add';
        $scope.buttonText = (deviceID > 0) ? 'Update' : 'Add';
        $scope.updateStatus = false;
        $scope.errorMessage = '';

        init();

        $scope.saveDevice = function () {
            if ($scope.editForm.$valid) {
                if (!$scope.device.device_id) {
                    dataService.insertDevice($scope.device).then(function (device) {
                        $scope.device = device;
                        processSuccess ();
                    }, processError);
                }
                else {
                    dataService.updateDevice($scope.device).then(function (device) {
                        $scope.device = device;
                        processSuccess ();
                    }, processError);       
                }
            }
        };

        $scope.deleteDevice = function () {
            var devName = $scope.device.device_id + ' ' + $scope.device.description;
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Delete Device',
                headerText: 'Delete ' + devName + '?',
                bodyText: 'Are you sure you want to delete this device?'
            };

            modalService.showModal({}, modalOptions).then(function (result) {
                if (result === 'ok') {
                    dataService.deleteDevice($scope.device.device_id).then(function () {
                        onRouteChangeOff(); //Stop listening for location changes
                        $location.path('/devices');
                    }, processError);
                }
            });
        };

        function init() {
            if (deviceID > 0) {
                dataService.getDevice(deviceID).then(function (device) {
                    $scope.device = device;
                }, processError);
            } else {
                dataService.newDevice().then(function (device) {
                    $scope.device = device;
                });

            }

            //Make sure they're warned if they made a change but didn't save it
            //Call to $on returns a "deregistration" function that can be called to
            //remove the listener (see routeChange() for an example of using it)
            onRouteChangeOff = $rootScope.$on('$locationChangeStart', routeChange);
        }

        function routeChange(event, newUrl) {
            //Navigate to newUrl if the form isn't dirty
            if (!$scope.editForm.$dirty) return;

            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ignore Changes',
                headerText: 'Unsaved Changes',
                bodyText: 'You have unsaved changes. Leave the page?'
            };

            modalService.showModal({}, modalOptions).then(function (result) {
                if (result === 'ok') {
                    onRouteChangeOff(); //Stop listening for location changes
                    $location.path(newUrl); //Go to page they're interested in
                }
            });

            //prevent navigation by default since we'll handle it
            //once the user selects a dialog option
            event.preventDefault();
            return;
        }

        function processSuccess() {
            $scope.editForm.$dirty = false;
            $scope.updateStatus = true;
            $scope.title = 'Edit';
            $scope.buttonText = 'Update';
            startTimer();
        }

        function processError(error) {
            $scope.errorMessage = error.message;
            startTimer();
        }

        function startTimer() {
            timer = $timeout(function () {
                $timeout.cancel(timer);
                $scope.errorMessage = '';
                $scope.updateStatus = false;
            }, 3000);
        }
    };

    app.register.controller('deviceEditController',
       ['$rootScope', '$scope', '$location', '$routeParams', '$timeout', 'config', 'dataService', 'modalService', devicesController]);

});