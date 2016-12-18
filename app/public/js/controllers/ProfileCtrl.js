angular.module('spotivote')
    .controller('ProfileCtrl', ['$scope', '$http', '$location', '$rootScope', '$state',
        function($scope, $http, $location, $rootScope, $state) {
            $http({
                url: '/profile',
                method: 'GET'
            }).success(function(data) {
                event.preventDefault();
                console.log(data)
                $scope.profile = data.user;
                $scope.playlists = data.playlists.items;

                $state.go('profile', {profile: data})

            })

            $scope.name = '';

            $scope.create = false;

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

            $scope.viewPlaylist = function(id, username) {
                // $http({
                //     url: '/playlist/' + id,
                //     method: 'GET'
                // }).success(function(data) {
                //     event.preventDefault();
                //     console.log('data', data)
                //     $state.go('playlist', {id: id, playlist: data.body, username: username});
                // })
                $state.go('playlist', {id: id, username: username});

            }


        }]);