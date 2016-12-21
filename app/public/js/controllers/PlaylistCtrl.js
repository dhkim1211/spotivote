angular.module('spotivote')
    .controller('PlaylistCtrl', ['$scope', '$http', '$location', '$stateParams', '$state',
        function($scope, $http, $location, $stateParams, $state) {
            $scope.id = $stateParams.id;
            $scope.username = $stateParams.username;
            // $scope.playlist = $stateParams.playlist;

            var list = [];

            $http({
                url: '/playlist/' + $scope.id,
                method: 'GET'
            }).success(function(data) {
                event.preventDefault();
                console.log(data);
                $scope.snapshotId = data.snapshot_id;
                data.tracks.items.forEach(function(track) {
                    list.push(track);
                })
                console.log('items', data.tracks.items);
                // $scope.playlist = data.body.tracks.items;
                $scope.name = data.name;
            })

            $scope.playlist = list;

            $scope.searching = false;
            $scope.formData = {artist: '', album: '', track: ''};

            $scope.types = [
                {name: 'Artist', value: 'artist'},
                {name: 'Album', value: 'album'},
                {name: 'Track', value: 'track'},
                {name: 'Playlist', value: 'playlist'}
            ]

            $scope.search = function(a, b, c) {
                $scope.searching = false;
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
                    url: '/playlist/' + $scope.id,
                    method: 'POST',
                    data: {
                        track: trackId
                    }
                }).success(function(data) {
                    event.preventDefault();
                    console.log(data);
                    $scope.results = '';
                    $state.go($state.current, {}, {reload: true});
                })
            }

            $scope.removeTrack = function(trackId) {
                $http({
                    url: '/playlist/' + $scope.id + '?position=' + trackId + '&snapshot=' + $scope.snapshotId,
                    method: 'DELETE'
                }).success(function(data) {
                    event.preventDefault();
                    console.log(data);
                    $scope.results = '';
                    $state.go($state.current, {}, {reload: true});
                })
            }

            // set up sortable options
            $scope.sortableOptions = {
                stop: function(e, ui) {
                    console.log('item', ui.item);
                    console.log('position', ui.position);
                    console.log('original', ui.originalPosition);
                },
                sort: function() {
                    console.log('sort');
                }
            };


        }]);