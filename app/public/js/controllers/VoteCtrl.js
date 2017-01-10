angular.module('spotivote')
    .controller('VoteCtrl', ['$scope', '$http', '$location', '$stateParams', '$state',
        function($scope, $http, $location, $stateParams, $state) {
            $scope.id = $stateParams.id;
            $scope.username = $stateParams.username;

            $scope.playlist = [];

            // Get playlist
            $http({
                url: '/vote/' + $scope.id,
                method: 'GET'
            }).success(function(data) {
                event.preventDefault();
                console.log(data);
                $scope.snapshotId = data.snapshot_id;
                data.tracks.items.forEach(function(track) {
                    $scope.playlist.push(track);
                })
                $scope.accessCode = data.accessCode;
                $scope.playlistId = data.id;
                console.log('items', data.tracks.items);
                $scope.name = data.name;
            })

            // Search for songs to add to playlist
            $scope.searching = false;

            $scope.results = [];

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
                    console.log('search!', data);
                    data.body.tracks.items.forEach(function(track) {
                        $scope.results.push(track);
                    })
                    // $scope.results = data.body.tracks.items;
                    console.log('results', $scope.results);
                })
            }

            // Add track to playlist
            $scope.addTrackToPlaylist = function(trackId, title, artist) {
                $http({
                    url: '/playlist/' + $scope.playlistId,
                    method: 'POST',
                    data: {
                        track: trackId,
                        title: title,
                        artist: artist
                    }
                }).success(function(data) {
                    event.preventDefault();
                    console.log(data);
                    $scope.results = '';
                    $state.go($state.current, {}, {reload: true});
                })
            }

            // Add vote to a track
            $scope.addVote = function(track) {
                $http({
                    url: '/playlist/' + $scope.playlistId + '/vote',
                    method: 'POST',
                    data: {
                        track: track
                    }
                }).success(function(data) {
                    event.preventDefault();
                    console.log(data);
                    $state.go($state.current, {}, {reload: true});
                })
            }

            // Search for songs in the playlist
            $scope.playlistResults = [];
            $scope.keyword = '';

            function escapeRegExp(string){
                return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
            }

            var regex;

            $scope.$watch('keyword', function (newValue, oldValue) {
                regex = new RegExp('\\b' + escapeRegExp(newValue), 'i');
                if (!newValue) {
                    $scope.playlistResults = [];
                }
            });

            $scope.searchPlaylist = function(keyword) {

                if (!$scope.keyword) {
                    $scope.playlistResults = [];
                }

                $scope.playlistResults = [];

                for (var i = 0; i < $scope.playlist.length; i++) {
                    if ( (regex.test($scope.playlist[i].track.artists[0].name)) || ( regex.test($scope.playlist[i].track.name))) {
                        $scope.playlistResults.push($scope.playlist[i]);
                    }
                }
            }

        }]);