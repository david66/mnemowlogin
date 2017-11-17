angular.module('mnemoApp', ['restangular', 'ngRoute', 'ui.bootstrap']).
    config(function ($routeProvider, RestangularProvider) {
        $routeProvider.
            when('/', {
                controller:ListCtrl,
                templateUrl:'home.html'
            }).
            when('/list', {
                controller:ListCtrl,
                templateUrl:'partials/list.html'
            }).
            when('/edit/:projectId', {
                controller:EditCtrl,
                templateUrl:'partials/edit.html',
                resolve:{
                    project:function (Restangular, $route) {
                        return Restangular.one('projects', $route.current.params.projectId).get();
                    }
                }
            }).
            when('/view/:projectId', {
                controller:EditCtrl,
                templateUrl:'partials/view.html',
                resolve:{
                    project:function (Restangular, $route) {
                        return Restangular.one('projects', $route.current.params.projectId).get();
                    }
                }
            }).
            when('/new', {controller:CreateCtrl, templateUrl:'partials/detail.html'}).
            when('/login', {templateUrl: 'partials/login.html', login: true}).
            when('/signup', {templateUrl: 'partials/signup.html', public: true}).
            otherwise({redirectTo:'/'});

        RestangularProvider.setBaseUrl('https://api.mongolab.com/api/1/databases/mnemo/collections');
        RestangularProvider.setDefaultRequestParams({ apiKey:'fNHHPvTcqgPAcJuVwdC8x0zFzR8Ua0pC' });
        RestangularProvider.setRestangularFields({
            id:'_id.$oid'
        });

        RestangularProvider.setRequestInterceptor(function (elem, operation, what) {

            if (operation === 'put') {
                elem._id = undefined;
                return elem;
            }
            return elem;
        })
    }).controller('mainController',function ($scope, $http, $log, $timeout) {

        $scope.prioridadListOptions = {
            'baja':'Baja',
            'media':'Media',
            'alta':'Alta',
            'critica':'Critica',
        };

        $scope.estadoListOptions = {
            'abierta':'Abierta',
            'resolviendose':'Resolviendose',
            'feedback':'Feedback',
            'cerrada':'Cerrada',
            'resuelta':'Resuelta'
        };

        $scope.today = function () {
            $scope.fecha = new Date();
        };
        $scope.today();

        $scope.open = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.opened = true;
        };

        $scope.dateOptions = {
            dateFormat: "yy-mm-dd",
            showOn: "focus",
            startingDay:1
        };

    });

function HeaderController($scope, $location)
{
    $scope.isActive = function (viewLocation) {
        return viewLocation === $location.path();
    };
}

function ListCtrl($scope, Restangular) {
    $scope.projects = Restangular.all("projects").getList().$object;
}

function CreateCtrl($scope, $location, Restangular, $timeout) {
    $scope.save = function () {

        $scope.messages = '¡El Ticket se ha grabado correctamente!';

        Restangular.all('projects').post($scope.project).then(function (project) {
            // Hide the status message which was set above after 3 seconds.
            $timeout(function () {
                $scope.messages = null;
            }, 3000);
            $location.path('/new');
        });
    }
}

function EditCtrl($scope, $location, Restangular, project, $timeout, $route) {
    var original = project;
    $scope.project = Restangular.copy(original);

    $scope.isClean = function () {
        return angular.equals(original, $scope.project);
    };

    $scope.destroy = function () {
        original.remove().then(function () {
            $location.path('/list');
        });
    };

    $scope.save = function () {

        $scope.messages = '¡La incidencia se ha grabado correctamente!';
        $scope.project.put().then(function () {
            // Hide the status message which was set above after 3 seconds.
            $timeout(function () {
                $scope.messages = null;
            }, 3000);
            $location.path('/list');
        });
    };
}