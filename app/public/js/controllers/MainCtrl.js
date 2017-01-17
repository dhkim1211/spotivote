angular.module('spotivote')
    .controller('MainCtrl', ['$scope', '$http', '$location', '$state',
        function($scope, $http, $location, $state) {
            $scope.params = $location.path().split('/')[3] || "Unknown";

            $scope.verify = function() {
                $http.post('/register/verify/' + $scope.params, $scope.data)
            }

            $scope.joinEvent = function(code) {
                $state.go('vote', {id: code});
            }

            $scope.state = $state;

            $scope.logout = function() {
                $http.get('/auth/logout').success(function(data) {
                    $state.go('home');
                })
            }
        }]);