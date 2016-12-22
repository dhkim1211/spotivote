angular.module('spotivote')
    .controller('PlaylistCtrl', ['$scope', '$http', '$location', '$stateParams', '$state',
        function($scope, $http, $location, $stateParams, $state) {
            $scope.id = $stateParams.id;
            $scope.username = $stateParams.username;

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

            $scope.addTrackToPlaylist = function(trackId, title, artist) {
                $http({
                    url: '/playlist/' + $scope.id,
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

            $scope.removeTrack = function(position, track) {
                $http({
                    url: '/playlist/' + $scope.id + '?position=' + position + '&snapshot=' + $scope.snapshotId + '&track=' + track,
                    method: 'DELETE'
                }).success(function(data) {
                    event.preventDefault();
                    console.log(data);
                    $scope.results = '';
                    $state.go($state.current, {}, {reload: true});
                })
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
                            destinationPosition: newIndex
                        }
                    }).success(function(data) {
                        event.preventDefault();
                        console.log(data);
                        $scope.results = '';
                        $state.go($state.current, {}, {reload: true});
                    })

                    console.log('sortable', ui.item.sortable.index);
                    console.log('drop', ui.item.sortable.dropindex);
                },
                sort: function(e, ui) {
                    // console.log('sort');
                    // console.log('sortable', ui.item.sortable.index);
                },
                start: function(e, ui) {
                    // var songTitle = ui.item[0].outerText.split("  ");
                    // console.log('songTitle', songTitle);
                    // songTitle = songTitle.toString().split("by");
                    // $scope.song = songTitle[0];
                    // console.log('song', $scope.song);
                },
                update: function(e, ui) {
                }
            };


        }]);