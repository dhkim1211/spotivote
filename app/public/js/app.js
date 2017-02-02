angular.module('spotivote', ['ui.router', 'ui.sortable', 'ui.materialize', 'monospaced.qrcode', 'ngStorage'])
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
                .state('logout', {
                    url: '/auth/logout'
                })
                .state('spotify', {
                    url: '/auth/spotify',
                    onEnter: function() {
                        window.location = "http://localhost:3000/auth/spotify"
                    }
                })
                .state('profile', {
                    url: '/me',
                    templateUrl: '/views/profile.html',
                    controller: 'ProfileCtrl',
                    hideLogin: true
                })
                .state('playlist', {
                    url: '/:id',
                    params: {
                        id: null,
                        username: null
                    },
                    templateUrl: '/views/playlist.html',
                    controller: 'PlaylistCtrl',
                    hideLogin: true
                })
                .state('vote', {
                    url: '/:id/vote',
                    params: {
                        id: null
                    },
                    templateUrl: '/views/playlistVote.html',
                    controller: 'VoteCtrl',
                    hideNavbar: true
                })
            $locationProvider.html5Mode(true);
        }])