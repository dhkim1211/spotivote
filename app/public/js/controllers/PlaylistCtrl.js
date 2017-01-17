angular.module('spotivote')
    .controller('PlaylistCtrl', ['$scope', '$http', '$location', '$stateParams', '$state', '$window',
        function($scope, $http, $location, $stateParams, $state, $window) {
            $scope.id = $stateParams.id;
            $scope.username = $stateParams.username;

            $scope.playlist = [];

            $http({
                url: '/playlist/' + $scope.id,
                method: 'GET'
            }).success(function(data) {
                event.preventDefault();
                console.log(data);
                $scope.snapshotId = data.snapshot_id;
                data.tracks.items.forEach(function(track) {
                    $scope.playlist.push(track);
                })
                $scope.accessCode = data.accessCode;
                console.log('items', data.tracks.items);
                // $scope.playlist = data.body.tracks.items;
                $scope.name = data.name;
            })

            // Open 30 sec song preview in new window
            $scope.preview = function(url) {
                $window.open(url);
            }

            $scope.searching = false;

            $scope.results = '';

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
                    console.log('results', $scope.results);
                })
            }

            $scope.addTrackToPlaylist = function(uri, trackId, title, artist) {
                $http({
                    url: '/playlist/' + $scope.id,
                    method: 'POST',
                    data: {
                        uri: uri,
                        title: title,
                        artist: artist,
                        track: trackId
                    }
                }).success(function(data) {
                    event.preventDefault();
                    console.log(data);
                    $state.go($state.current, {}, {reload: true});
                })
            }

            $scope.removeTrack = function(position, track) {
                $http({
                    url: '/playlist/' + $scope.id + '?position=' + position + '&track=' + track + '&snapshot=' + $scope.snapshotId,
                    method: 'DELETE'
                }).success(function(data) {
                    event.preventDefault();
                    console.log(data);
                    // $scope.results = '';
                    $state.go($state.current, {}, {reload: true});
                })
            }

            $scope.addVote = function(track) {
                $http({
                    url: '/playlist/' + $scope.id + '/vote',
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

            // View single playlist
            $scope.goToVote = function(accessCode) {
                $state.go('vote', {id: accessCode});
            }


            $scope.song = '';
            // set up sortable options
            $scope.sortableOptions = {
                stop: function(e, ui) {
                    console.log('item', ui);
                    console.log('itemIndex', ui.item.index());
                    console.log('playlist', $scope.playlist);
                    var originalIndex = ui.item.index();
                    var newIndex = ui.item.sortable.dropindex;

                    $http({
                        url: '/playlist/' + $scope.id,
                        method: 'PUT',
                        data: {
                            initialPosition: originalIndex,
                            destinationPosition: newIndex,
                            track: $scope.playlist[newIndex].track.id
                        }
                    }).success(function(data) {
                        event.preventDefault();
                        console.log(data);
                        $state.go($state.current, {}, {reload: true});
                    })

                    console.log('sortable', ui.item.sortable.index);
                    console.log('drop', ui.item.sortable.dropindex);
                },
                sort: function(e, ui) {

                },
                start: function(e, ui) {

                },
                update: function(e, ui) {
                }
            };


        }]);