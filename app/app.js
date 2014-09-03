/*#######################################################################
  
  MakeInBo
  http://www.makeinbo.it


  #######################################################################*/

'use strict';

define(['services/routeResolver'], function () {

    var app = angular.module('raspiGuardApp', ['ngRoute', 'ngAnimate', 'routeResolverServices', 'wc.Directives', 'wc.Animations', 'ui.bootstrap']);

    app.config(['$routeProvider', 'routeResolverProvider', '$controllerProvider', '$compileProvider', '$filterProvider', '$provide', '$httpProvider',
        function ($routeProvider, routeResolverProvider, $controllerProvider, $compileProvider, $filterProvider, $provide, $httpProvider) {

            //Change default views and controllers directory using the following:
            //routeResolverProvider.routeConfig.setBaseDirectories('/app/views', '/app/controllers');

            app.register =
            {
                controller: $controllerProvider.register,
                directive: $compileProvider.directive,
                filter: $filterProvider.register,
                factory: $provide.factory,
                service: $provide.service
            };

            //Define routes - controllers will be loaded dynamically
            var route = routeResolverProvider.route;

            $routeProvider
                //route.resolve() now accepts the convention to use (name of controller & view) as well as the 
                //path where the controller or view lives in the controllers or views folder if it's in a sub folder. 
                //For example, the controllers for customers live in controllers/customers and the views are in views/customers.
                //The controllers for orders live in controllers/orders and the views are in views/orders
                //The second parameter allows for putting related controllers/views into subfolders to better organize large projects
                //Thanks to Ton Yeung for the idea and contribution
                .when('/zones', route.resolve('zones', 'zones/'))
                .when('/zoneedit/:zoneID', route.resolve('zoneEdit', 'zones/'))
                .when('/devices', route.resolve('devices', 'devices/'))
                .when('/devices/:zoneID', route.resolve('devices', 'devices/'))
                .when('/deviceedit/:deviceID', route.resolve('deviceEdit', 'devices/'))
                .when('/events', route.resolve('events', 'events/'))
                .when('/events/:deviceID', route.resolve('events', 'events/'))
                .when('/about', route.resolve('about'))
                .otherwise({ redirectTo: '/zones' });

    }]);

    return app;

});





