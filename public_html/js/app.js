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

    $scope.selectedFile = null;
    $scope.selectedFileStreamUrl = null;

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

    $scope.playFile = function(file) {
        $scope.selectedFile = file;
        $scope.selectedFileStreamUrl = location.href + 'api/stream-file?location=' + file.data.fullPath;

        console.log($scope.selectedFileStreamUrl);

        setTimeout(function () {
            $('#exampleModalCenter').on('hidden.bs.modal', function (e) {
                $http.get('api/stop-stream-file')
                    .then(function(response) {
                        $scope.selectedFile = null;
                        $scope.selectedFileStreamUrl = null;
                        console.log('hide');
                    });
            })
        }, 1);
    };

    $scope.goTo('C:\\Users\\jenyas\\Downloads');
});