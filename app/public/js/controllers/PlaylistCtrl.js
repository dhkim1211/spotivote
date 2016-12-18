angular.module('spotivote')
    .controller('PlaylistCtrl', ['$scope', '$http', '$location', '$stateParams',
        function($scope, $http, $location, $stateParams) {
            $scope.id = $stateParams.id;
            $scope.username = $stateParams.username;
            // $scope.playlist = $stateParams.playlist;



            $http({
                url: '/playlist/' + $scope.id,
                method: 'GET'
            }).success(function(data) {
                event.preventDefault();
                console.log(data)
                $scope.playlist = data.body;

            })
        }]);