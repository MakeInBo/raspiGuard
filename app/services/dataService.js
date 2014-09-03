define(['app'], function (app) {
    "use strict";

    var dataService = function ($http, $q) {
        var serviceBase = '/api/dataservice/',
            dataFactory = {};

        dataFactory.getZones = function (pageIndex, pageSize) {
            return getPagedResource('zones', pageIndex, pageSize);
        };

        dataFactory.getDevices = function (pageIndex, pageSize, chainID) {
            return getPagedResource('devices', pageIndex, pageSize, chainID);
        };

        dataFactory.getEvents = function (pageIndex, pageSize, chainID) {
            return getPagedResource('events', pageIndex, pageSize, chainID);
        };

        dataFactory.insertZone = function (zone) {
            return $http.post(serviceBase + 'zones', zone).then(function (results) {
                 return results.data;
            });
        };

        dataFactory.newZone = function () {
            return $q.when({});
        };

        dataFactory.updateZone = function (zone) {
            return $http.put(serviceBase + 'zones/' + zone.zone_id, zone).then(function (results) {
                if (angular.isDefined (results.data.zone_id)) {
                    return results.data;
                }
                else {
                    throw exception;
                }
            });
        };

        dataFactory.deleteZone = function (id) {
            return $http.delete(serviceBase + 'zones/' + id).then(function (status) {
                return status.data;
            });
        };

        dataFactory.getZone = function (id) {
            //then does not unwrap data so must go through .data property
            //success unwraps data automatically (no need to call .data property)
            return $http.get(serviceBase + 'zones/' + id).then(function (results) {
                return results.data;
            });
        };

       dataFactory.insertDevice = function (device) {
            return $http.post(serviceBase + 'devices', device).then(function (results) {
                 return results.data;
            });
        };

        dataFactory.newDevice = function () {
            return $q.when({});
        };

        dataFactory.updateDevice = function (device) {
            return $http.put(serviceBase + 'devices/' + device.device_id, device).then(function (results) {
                if (angular.isDefined (results.data.device_id)) {
                    return results.data;
                }
                else {
                    throw exception;
                }
            });
        };

        dataFactory.deleteDevice = function (id) {
            return $http.delete(serviceBase + 'devices/' + id).then(function (status) {
                return status.data;
            });
        };

        dataFactory.getDevice = function (id) {
            //then does not unwrap data so must go through .data property
            //success unwraps data automatically (no need to call .data property)
            return $http.get(serviceBase + 'devices/' + id).then(function (results) {
                return results.data;
            });
        };

       function getPagedResource(baseResource, pageIndex, pageSize, chainID) {
            var resource = baseResource;
            var pagingUri = (angular.isDefined(pageSize)) ? buildPagingUri(pageIndex, pageSize) : '';     
            var chainUri  = (angular.isDefined(chainID )) ? buildChainUri (chainID) : '';     
            if (chainUri !== '') {
                if (pagingUri !== '')   {
                    pagingUri += '&' + chainUri;
                } else {
                    pagingUri = '?' + chainUri;
                }
            resource += pagingUri;
            }
            return $http.get(serviceBase + resource).then(function (response) {
                var recs = response.data;
                var hh = response.headers('Db-Content-Range').split('/');
                var recsCount = recs.length;
                if (angular.isDefined(hh[1])) recsCount = parseInt (hh[1]);
                return {
                    totalRecords: recsCount ,
                    results: recs
                };
            });
        }

        function buildPagingUri(pageIndex, pageSize) {
            var uri = '?$top=' + pageSize + '&$skip=' + (pageIndex * pageSize);
            return uri;
        }

        function buildChainUri(chainID) {
            var uri = '$chain=' + chainID;
            return uri;
        }

        return dataFactory;

    };

    app.factory('dataService', ['$http', '$q', dataService]);

});