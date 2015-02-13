'use strict';

// Organizations controller
angular.module('organizations').controller('OrganizationsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Organizations', 'Employees',
    function ($scope, $stateParams, $location, Authentication, Organizations, Employees) {
        $scope.authentication = Authentication;
        $scope.owners = Employees.query();

        // Create new Organization
        $scope.create = function () {
            // Create new Organization object
            var organization = new Organizations({
                name: this.name,
                owner: this.owner,
                totalHeadCount: this.totalHeadCount,
                billableHeadCount: this.billableHeadCount,
                benchHeadCount: this.benchHeadCount
            });

            // Redirect after save
            organization.$save(function (response) {
                $location.path('organizations/' + response._id);

                // Clear form fields
                $scope.name = '';
                $scope.owner = {};
                $scope.totalHeadCount = 0;
                $scope.billableHeadCount = 0;
                $scope.benchHeadCount = 0;

            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Remove existing Organization
        $scope.remove = function (organization) {
            if (organization) {
                organization.$remove();

                for (var i in $scope.organizations) {
                    if ($scope.organizations [i] === organization) {
                        $scope.organizations.splice(i, 1);
                    }
                }
            } else {
                $scope.organization.$remove(function () {
                    $location.path('organizations');
                });
            }
        };

        // Update existing Organization
        $scope.update = function () {
            var organization = $scope.organization;

            organization.$update(function () {
                $location.path('organizations/' + organization._id);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Find a list of Organizations
        $scope.find = function () {
            $scope.organizations = Organizations.query(function () {
                $scope.organizations.forEach(function (org) {
                    org.labels = [];
                    org.series = ['Total', 'Billable', 'Bench'];
                    org.legend = true;
                    var total = [];
                    var billable = [];
                    var bench = [];

                    org.projects.forEach(function (project) {
                        org.labels.push(project.name);
                        total.push(project.totalHeadCount);
                        billable.push(project.billableHeadCount);
                        bench.push(project.benchHeadCount);
                    });
                    org.data = [total, billable, bench];
                });
            });
        };

        // Find existing Organization
        $scope.findOne = function () {
            $scope.organization = Organizations.get({
                organizationId: $stateParams.organizationId
            }, function () {
                $scope.organization.labels = [];
                $scope.organization.series = ['Total', 'Billable', 'Bench'];
                $scope.organization.legend = true;
                var total = [];
                var billable = [];
                var bench = [];

                $scope.organization.projects.forEach(function (project) {
                    $scope.organization.labels.push(project.name);
                    total.push(project.totalHeadCount);
                    billable.push(project.billableHeadCount);
                    bench.push(project.benchHeadCount);
                });
                $scope.organization.data = [total, billable, bench];
            });

        };
    }
]);
