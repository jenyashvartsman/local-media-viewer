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
    $scope.path = '';

    $scope.filter = {
        showAudio: true,
        showVideo: true,
        showOther: false
    };

    $scope.selectedFile = null;
    $scope.selectedFileStreamUrl = null;

    $scope.navigate = function(path) {
        $http.get('api/file?path=' + path)
            .then(function(response) {
                $scope.files = $scope.mapFilesResponse(response.data.files);
                $scope.path = response.data.path;
            });
    };

    $scope.navigateBack = function () {
        let pathArr = $scope.path.split('\\');
        if (pathArr.length > 1) {
            pathArr.pop();
        }
        $scope.path = pathArr.join('\\');
        $scope.navigate($scope.path);

    };

    $scope.mapFilesResponse = function (filesToMap) {
        filesToMap.map(item => {
            if (!item.data.isDirectory) {
                item.data.size = $scope.bytesToSize(item.data.sizeBytes);
            }
           return item;
        });

        let directories = filesToMap.filter(item => {
            return item.data.isDirectory;
        });
        let files = filesToMap.filter(item => {
            return !item.data.isDirectory;
        });

        return directories.concat(files);
    };

    $scope.playFile = function(file) {
        $scope.selectedFile = file;
        $scope.selectedFileStreamUrl = location.href + 'api/stream/start?path=' + file.data.fullPath;

        setTimeout(function () {
            $('#exampleModalCenter').on('hidden.bs.modal', function (e) {
                $http.get('api/stream/stop')
                    .then(function(response) {
                        $scope.selectedFile = null;
                        $scope.selectedFileStreamUrl = null;
                    });
            })
        }, 1);
    };

    $scope.bytesToSize = function (bytes) {
        let sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes === 0) return '0 Byte';
        let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
    };

    $scope.navigate('');
});