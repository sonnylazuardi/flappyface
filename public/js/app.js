'use strict';

// Declare app level module which depends on filters, and services
angular.module('FlappyFace', [
  'ngRoute',
  'FlappyFace.filters',
  'FlappyFace.services',
  'FlappyFace.directives',
  'FlappyFace.controllers'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/login', {templateUrl: 'partials/login.html', controller: 'LoginCtrl'});
  $routeProvider.when('/play', {templateUrl: 'partials/play.html', controller: 'PlayCtrl'});
  $routeProvider.otherwise({redirectTo: '/login'});
}]);