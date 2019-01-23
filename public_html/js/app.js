let app = angular.module('myApp', []);
app.controller('myCtrl', function($scope, $http) {
    $scope.files = [];
    $scope.location = '';

    $scope.searchFiles = function(location) {
        $http.get('api/media-file?location=' + location)
            .then(function(response) {
                $scope.files = response.data.files;
                $scope.location = response.data.location;
            });
    };
    $scope.searchFiles('');
});