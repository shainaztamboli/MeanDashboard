'use strict';

// Projects controller
angular.module('projects').controller('ProjectsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Projects', 'Employees', 'Organizations',
    function ($scope, $stateParams, $location, Authentication, Projects, Employees, Organizations) {
        $scope.authentication = Authentication;
        $scope.organizations = Organizations.query();
        $scope.members = [];

        $scope.setMembers = function (id) {
            $scope.members = [];
            $scope.organizations.forEach(function (org) {
                if (org._id == id) {
                    $scope.members = org.members;
                }
            });
        };

        // Create new Project
        $scope.create = function () {
            // Create new Project object
            var project = new Projects({
                name: this.name,
                startDate: this.startDate,
                endDate: this.endDate,
                ongoing: this.ongoing,
                owner: this.owner,
                belongsTo: this.belongsTo,
                totalHeadCount: this.totalHeadCount,
                billableHeadCount: this.billableHeadCount,
                benchHeadCount: this.benchHeadCount
            });

            // Redirect after save
            project.$save(function (response) {
                $location.path('projects/' + response._id);

                // Clear form fields
                $scope.name = '';
                $scope.startDate = new Date();
                $scope.endDate = new Date();
                $scope.ongoing = false;
                $scope.owner = {};
                $scope.belongsTo = {};
                $scope.totalHeadCount = 0;
                $scope.billableHeadCount = 0;
                $scope.benchHeadCount = 0;
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Remove existing Project
        $scope.remove = function (project) {
            if (project) {
                project.$remove();

                for (var i in $scope.projects) {
                    if ($scope.projects [i] === project) {
                        $scope.projects.splice(i, 1);
                    }
                }
            } else {
                $scope.project.$remove(function () {
                    $location.path('projects');
                });
            }
        };

        // Update existing Project
        $scope.update = function () {
            var project = $scope.project;

            project.$update(function () {
                $location.path('projects/' + project._id);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Find a list of Projects
        $scope.find = function () {
            $scope.projects = Projects.query(function (result) {
                $scope.projects.forEach(function (item) {
                    item.labels = ['Total', 'Billable', 'Bench'];
                    item.data = [item.totalHeadCount, item.billableHeadCount, item.benchHeadCount];
                });

            })
        };

        // Find existing Project
        $scope.findOne = function () {
            $scope.project = Projects.get({
                projectId: $stateParams.projectId
            }, function (result) {
                if ($scope.project.belongsTo) {
                    $scope.setMembers($scope.project.belongsTo._id);
                }
                $scope.project.labels = ['Total', 'Billable', 'Bench'];
                $scope.project.data = [$scope.project.totalHeadCount, $scope.project.billableHeadCount, $scope.project.benchHeadCount];
            });


        };
    }
]);
