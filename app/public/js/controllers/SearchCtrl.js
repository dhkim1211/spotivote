angular.module('spotivote')
    .controller('SearchCtrl', ['$scope', '$http', '$location', '$rootScope', '$state',
        function($scope, $http, $location, $rootScope, $state) {

            $scope.formData = {artist: '', album: '', track: ''};

            $scope.types = [
                {name: 'Artist', value: 'artist'},
                {name: 'Album', value: 'album'},
                {name: 'Track', value: 'track'},
                {name: 'Playlist', value: 'playlist'}
            ]

            $scope.search = function(a, b, c) {
                $http({
                    url: '/search',
                    method: 'POST',
                    data: {
                        artist: a,
                        album: b,
                        track: c
                    }
                }).success(function(data) {
                    event.preventDefault();
                    console.log(data);
                    $scope.results = data.body.tracks.items;
                })
            }

            $scope.addTrackToPlaylist = function(trackId) {
                $http({
                    url: '/playlist/0dJngvMC4JuqfQn1agu4p3',
                    method: 'POST',
                    data: {
                        track: trackId
                    }
                }).success(function(data) {
                    event.preventDefault();
                    console.log(data);
                    $state.go('playlist', {id: '0dJngvMC4JuqfQn1agu4p3'});
                })
            }


        }]);