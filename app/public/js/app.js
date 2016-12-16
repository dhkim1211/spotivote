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
                .state('spotify', {
                    url: '/auth/spotify',
                    onEnter: function() {
                        window.location = "http://localhost:3000/auth/spotify"
                    }
                })
                .state('profile', {
                    url: '/profile',
                    templateUrl: '/views/profile.html',
                    controller: 'ProfileCtrl'
                })
            $locationProvider.html5Mode(true);
        }])