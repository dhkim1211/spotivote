angular.module('spotivote', ['ui.router', 'ui.sortable'])
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
                .state('search', {
                    url: '/search',
                    templateUrl: '/views/search.html',
                    controller: 'SearchCtrl'
                })
                .state('playlist', {
                    url: '/playlist/:id',
                    params: {
                        id: null,
                        username: null
                    },
                    templateUrl: '/views/playlist.html',
                    controller: 'PlaylistCtrl'
                })
            $locationProvider.html5Mode(true);
        }])