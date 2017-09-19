angular.module('app', ['ui.router'])
    .config(function ($stateProvider, $locationProvider) {
        $locationProvider.html5Mode(true)
        $stateProvider
            .state({
                name: 'home',
                url: '/',
                templateUrl: '/d/templates/home.html',
                controller: 'homeCtrl'
            })
            .state({
                name: 'about',
                url: '/about',
                templateUrl: '/d/templates/about.html',
                controller: 'aboutCtrl'
            });
    })
    .run(function ($http, $rootScope, api) {
        api.version()
            .then(function (res) {
                $rootScope.config = res.config;
            }).catch(function (err) {
                console.log(err);
            });
    })
    .controller('homeCtrl', function ($scope, api) {
        $scope.link = {};

        $scope.show = function () {
            if ($scope.showOptions === true) {
                $scope.showOptions = false;
            } else {
                $scope.showOptions = true;
            }
        }

        $scope.shorten = function (link, isValid) {
            if (isValid) {
                api.links.shorten(link)
                    .then(function (res) {
                        $scope.link = res;
                        $scope.success = true;
                    }).catch(function (err) {
                        $scope.error = err;
                        console.log(err);
                    });
            }
        }
    })

    .controller('aboutCtrl', function ($scope) {})
    .factory('api', function ($http, $q) {
        var apiVersion = 'v1';
        var apiBase = '/d/api/' + apiVersion;

        function getVer() {
            var defered = $q.defer();
            $http.get(apiBase).then(function (res) {
                defered.resolve(res.data)
            }).catch(function (err) {
                defered.reject(err);
            });

            return defered.promise;
        }

        function shortenUrl(data) {
            var defered = $q.defer();
            $http.post(apiBase + '/links/shorten', data).then(function (res) {
                defered.resolve(res.data)
            }).catch(function (err) {
                defered.reject(err);
            });

            return defered.promise;
        }

        function lookupUrl(ending) {
            var defered = $q.defer();
            $http.get(apiBase + '/links/lookup/' + ending).then(function (res) {
                defered.resolve(res.data)
            }).catch(function (err) {
                defered.reject(err);
            });

            return defered.promise;
        }

        function listAll() {
            var defered = $q.defer();
            $http.get(apiBase + '/links').then(function (res) {
                defered.resolve(res.data)
            }).catch(function (err) {
                defered.reject(err);
            });

            return defered.promise;
        }

        function healthCheck() {
            var defered = $q.defer();
            $http.get(apiBase + '/healthcheck').then(function (res) {
                defered.resolve(res.data)
            }).catch(function (err) {
                defered.reject(err);
            });

            return defered.promise;
        }

        return {
            health: healthCheck,
            version: getVer,
            links: {
                shorten: shortenUrl,
                lookup: lookupUrl,
                list: listAll
            }
        };
    });
