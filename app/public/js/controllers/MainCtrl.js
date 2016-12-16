angular.module('spotivote')
    .controller('MainCtrl', ['$scope', '$http', '$location',
        function($scope, $http, $location) {
            $scope.params = $location.path().split('/')[3] || "Unknown";
            $scope.register = function() {
                $http.post('/')
            }
            $scope.verify = function() {
                $http.post('/register/verify/' + $scope.params, $scope.data)
            }
        }]);