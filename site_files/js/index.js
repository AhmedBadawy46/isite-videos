var app = app || angular.module('myApp', [])
    app.controller('channels', ($scope, $http) => {
        $scope.channel = {}
        $scope.channels = {}

        $scope.addChannel = function () {
            $http({
                method: 'POST',
                url: '/api/youtube/addchannel',
                data: $scope.channel
            }).then(function (response) {
                if (response.data.done) {
                    window.location.reload(true)
                }
            });
        };

        $scope.getChannels = function () {
            $http({
                method: 'POST',
                url: '/api/youtube/getUserChannels',
                data: {}
            }).then(function (response) {
                $scope.channels = response.data
            });
        };

        $scope.remove = function (channel) {
            $scope.channel = channel
            $scope.bannerPath = channel.bannerPath
            $scope.logoPath = channel.logoPath
            site.showModal('#deleteChannelModal');
        }

        $scope.delete = function (id) {
            $http({
                method: "POST",
                url: "/api/youtube/deleteChannel",
                data: {id: id}
            }).then(
                function (response) {
                    if (response.data.done) {
                        window.location.reload(true)
                    } else {
                        console.log(response.data.error)
                    }
                },
                function (err) {

                }
            )
        };

        $scope.uploadLogo = function (files) {
            var fd = new FormData();
            fd.append("fileToUpload", files[0]);
            $http.post('/uploadFile', fd, {
                withCredentials: true,
                headers: {
                    'Content-Type': undefined
                },
                uploadEventHandlers: {
                    progress: function (e) {
                        $scope.uploadStatus = "Uploading : " + Math.round((e.loaded * 100 / e.total)) +
                            " %";
                        if (e.loaded == e.total) {
                            $scope.uploadStatus = "100%";
                        }
                    }
                },
                transformRequest: angular.identity
            }).then(function (res) {
                if (res.data && res.data.done) {
                    $scope.uploadStatus = "File Uploaded"
                    $scope.logoPath = res.data.FilePath
                    $scope.channel.logoPath = res.data.FilePath
                }
            }, function (error) {
                $scope.uploadStatus = error;
            });
        };

        $scope.uploadBanner = function (files) {
            var fd = new FormData();
            fd.append("fileToUpload", files[0]);
            $http.post('/uploadFile', fd, {
                withCredentials: true,
                headers: {
                    'Content-Type': undefined
                },
                uploadEventHandlers: {
                    progress: function (e) {
                        $scope.uploadStatusBanner = "Uploading : " + Math.round((e.loaded * 100 /
                                e.total)) +
                            " %";
                        if (e.loaded == e.total) {
                            $scope.uploadStatusBanner = "100%";
                        }
                    }
                },
                transformRequest: angular.identity
            }).then(function (res) {
                if (res.data && res.data.done) {
                    $scope.uploadStatusBanner = "File Uploaded"
                    $scope.bannerPath = res.data.FilePath
                    $scope.channel.bannerPath = res.data.FilePath
                }
            }, function (error) {
                $scope.uploadStatusBanner = error;
            });
        };

        $scope.edit = function (channel) {
            $scope.channel = channel
            $scope.bannerPath = channel.bannerPath
            $scope.logoPath = channel.logoPath
            site.showModal('#updateChannelModal');
        };

        $scope.update = function () {
            $http({
                method: "POST",
                url: "/api/youtube/updatechannel",
                data: $scope.channel
            }).then(
                function (response) {
                    if (response.data.done) {
                        window.location.reload(true)
                    } else {
                        console.log(response.data.error);
                    }
                },
                function (err) {

                }
            )
        };

        $scope.details = function (channel) {
            $scope.channel = channel
            $scope.bannerPath = channel.bannerPath
            $scope.logoPath = channel.logoPath
            site.showModal('#viewChannelModal');
        }

        $scope.getChannels()
    })