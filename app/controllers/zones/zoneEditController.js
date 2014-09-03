'use strict';

define(['app'], function (app) {

    var zonesController = function ($rootScope, $scope, $location, $routeParams, $timeout, config, dataService, modalService) {

        var zoneID = ($routeParams.zoneID) ? parseInt($routeParams.zoneID) : 0,
            timer,
            onRouteChangeOff;

        $scope.zone;
        $scope.title = (zoneID > 0) ? 'Edit' : 'Add';
        $scope.buttonText = (zoneID > 0) ? 'Update' : 'Add';
        $scope.updateStatus = false;
        $scope.errorMessage = '';

        init();

        $scope.saveZone = function () {
            if ($scope.editForm.$valid) {
                if (!$scope.zone.zone_id) {
                    dataService.insertZone($scope.zone).then(function (zone) {
                        $scope.zone = zone;
                        processSuccess ();
                    }, processError);
                }
                else {
                    dataService.updateZone($scope.zone).then(function (zone) {
                        $scope.zone = zone;
                        processSuccess ();
                    }, processError);       
                }
            }
        };

        $scope.deleteZone = function () {
            var zonName = $scope.zone.zone_id + ' ' + $scope.zone.description;
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Delete Zone',
                headerText: 'Delete ' + zonName + '?',
                bodyText: 'Are you sure you want to delete this zone?'
            };

            modalService.showModal({}, modalOptions).then(function (result) {
                if (result === 'ok') {
                    dataService.deleteZone($scope.zone.zone_id).then(function () {
                        onRouteChangeOff(); //Stop listening for location changes
                        $location.path('/zones');
                    }, processError);
                }
            });
        };

        function init() {
            if (zoneID > 0) {
                dataService.getZone(zoneID).then(function (zone) {
                    $scope.zone = zone;
                }, processError);
            } else {
                dataService.newZone().then(function (zone) {
                    $scope.zone = zone;
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

    app.register.controller('zoneEditController',
       ['$rootScope', '$scope', '$location', '$routeParams', '$timeout', 'config', 'dataService', 'modalService', zonesController]);

});