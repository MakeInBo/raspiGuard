require.config({
    baseUrl: '/app',
    urlArgs: 'v=1.0'
});

require(
    [
        'animations/listAnimations',
        'app',
        'directives/wcUnique',
        'directives/wcOverlay',
        'services/routeResolver',
        'services/config',
        'services/dataService',
        'services/modalService',
        'filters/zoneDescriptionFilter',
        'filters/deviceDescriptionFilter',
        'filters/eventDescriptionFilter',
        'controllers/navBarController'
     ],
    function () {
        angular.bootstrap(document, ['raspiGuardApp']);
    });
