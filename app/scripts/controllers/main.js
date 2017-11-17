'use strict';

/**
 * @ngdoc function
 * @name cycleApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the cycleApp
 */
angular.module('cycleApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
