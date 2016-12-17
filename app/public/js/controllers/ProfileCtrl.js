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

        }]);