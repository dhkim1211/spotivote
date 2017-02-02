angular.module('spotivote')
    .controller('ProfileCtrl', ['$scope', '$http', '$location', '$rootScope', '$state',
        function($scope, $http, $location, $rootScope, $state) {
            // Get profile & user's playlists
            $http({
                url: '/profile',
                method: 'GET'
            }).success(function(data) {
                if (!data.user) {
                    $state.go('login');
                }
                if (!data.playlists) {
                    $scope.noPlaylists = true;
                }
                event.preventDefault();
                console.log(data)
                $scope.username = data.user;
                $scope.playlists = data.playlists;
            })

            $scope.name = '';

            $scope.create = false;

            // Create Playlist
            $scope.createPlaylist = function(name) {
                $http({
                    url: '/playlist/create',
                    method: 'POST',
                    data: {
                        playlistName: name
                    }
                }).success(function(data) {
                    event.preventDefault();
                    console.log(data)
                    $state.go('playlist', {id: data.body.id});
                })
            }

            // View single playlist
            $scope.viewPlaylist = function(id, username) {
                $state.go('playlist', {id: id, username: username});
            }


        }]);