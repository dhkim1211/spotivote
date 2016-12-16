angular.module('spotivote', ['ui.router'])
    .config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
        function($stateProvider, $urlRouterProvider, $locationProvider) {
            $stateProvider
                .state('home', {
                    url: '/',
                    templateUrl:'/views/home.html',
                    controller: 'MainCtrl'
                })
                .state('login', {
                    url: '/login',
                    templateUrl:'/views/login.html',
                    controller: 'MainCtrl'
                })
                .state('register', {
                    url: '/register',
                    templateUrl:'/views/register.html',
                    controller: 'MainCtrl'
                })
            $locationProvider.html5Mode(true);
        }])