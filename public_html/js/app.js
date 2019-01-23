let app = angular.module('myApp', []);

app.filter('filterFiles', function () {
    return function(files, filter) {
        return files.filter(fileItem => {
            return fileItem.data.isDirectory ||
                (filter.showAudio && fileItem.data.type === 'AUDIO') ||
                (filter.showVideo && fileItem.data.type === 'VIDEO') ||
                (filter.showOther && fileItem.data.type === 'OTHER');
        });
    }
});

app.controller('myCtrl', function($scope, $http) {
    $scope.files = [];
    $scope.location = '';

    $scope.filter = {
        showAudio: true,
        showVideo: true,
        showOther: false
    };

    $scope.goTo = function(location) {
        $http.get('api/media-file?location=' + location)
            .then(function(response) {
                $scope.files = $scope.mapFilesResponse(response.data.files);
                $scope.location = response.data.location;
            });
    };

    $scope.mapFilesResponse = function (filesToMap) {
        let directories = filesToMap.filter(item => {
            return item.data.isDirectory;
        });
        let files = filesToMap.filter(item => {
            return !item.data.isDirectory;
        });

        return directories.concat(files);
    };

    $scope.navigateBack = function () {
        let locationArr = $scope.location.split('\\');
        if (locationArr.length > 1) {
            locationArr.pop();
        }
        $scope.location = locationArr.join('\\');
        $scope.goTo($scope.location);

    };

    $scope.navigateOrPlay = function (file) {
        if (file.data.isDirectory) {
            $scope.goTo(file.data.fullPath);
        }
    };

    $scope.goTo('');
});