angular.module('spotivote')
    .controller('ProfileCtrl', ['$scope', '$http', '$location', '$rootScope', '$state',
        function($scope, $http, $location, $rootScope, $state) {
            $http({
                url: '/profile',
                method: 'GET'
            }).success(function(data) {
                event.preventDefault();

                $scope.profile = data;
                $state.go('profile', {profile: data})
                console.log(data)
            })

        }]);