'use strict';

// Employees controller
angular.module('employees').controller('EmployeesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Employees', 'Organizations', 'Projects',
    function ($scope, $stateParams, $location, Authentication, Employees, Organizations, Projects) {
        $scope.authentication = Authentication;
        $scope.organizations = Organizations.query();
        $scope.projects = [];

        $scope.setProjects = function (id, init) {
            $scope.projects = [];
            $scope.organizations.forEach(function (org) {
                if (org._id == id) {
                    $scope.projects = org.projects;
                }
                if (init && init != true) {
                    $scope.employee.worksFor = [];
                }
            });
        };

        $scope.roles = [
            'Junior Software Developer',
            'Software Developer',
            'Senior Software Developer',
            'Junior QA Engineer',
            'QA Engineer',
            'Senior QA Engineer',
            'Tech Lead',
            'QA Lead',
            'Engineering Manager',
            'QA Manager',
            'Architect',
            'BU Head'
        ];

        $scope.skillList = [
            'Java & J2EE',
            'c# & .Net',
            'Angular JS',
            'Javascript',
            'HTML & CSS',
            'C & C++',
            'Spring',
            'Hibernate',
            'Manual Testing',
            'Automation',
            'JQuery',
            'MongoDB',
            'Oracle',
            'MySQL',
            'Hadoop'
        ];

        // Create new Employee
        $scope.create = function () {
            // Create new Employee object
            var employee = new Employees({
                firstName: this.firstName,
                lastName: this.lastName,
                skills: this.skills,
                role: this.role,
                female: this.female,
                billable: this.billable,
                belongsTo: this.belongsTo,
                worksFor: this.worksFor,
                yrsOfExperience: this.yrsOfExperience
            });

            // Redirect after save
            employee.$save(function (response) {
                $location.path('employees/' + response._id);

                // Clear form fields
                $scope.firstName = '';
                $scope.lastName = '';
                $scope.skills = '';
                $scope.role = '';
                $scope.female = false;
                $scope.belongsTo = {};
                $scope.worksFor = [];
                $scope.billable = false;
                $scope.yrsOfExperience = 0;
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Remove existing Employee
        $scope.remove = function (employee) {
            if (employee) {
                employee.$remove();

                for (var i in $scope.employees) {
                    if ($scope.employees [i] === employee) {
                        $scope.employees.splice(i, 1);
                    }
                }
            } else {
                $scope.employee.$remove(function () {
                    $location.path('employees');
                });
            }
        };

        // Update existing Employee
        $scope.update = function () {
            var employee = $scope.employee;
            employee.$update(function () {
                $location.path('employees/' + employee._id);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Find a list of Employees
        $scope.find = function () {
            $scope.employees = Employees.query();
        };

        // Find existing Employee
        $scope.findOne = function () {
            $scope.employee = Employees.get({
                employeeId: $stateParams.employeeId
            }, function (result) {
                console.log(result.worksFor);
                $scope.employee.worksFor = result.worksFor;
                if ($scope.employee.belongsTo) {
                    $scope.setProjects($scope.employee.belongsTo._id, true);
                }
            });
            $scope.employee.$promise.then(function (employee) {
                var indexOf = $scope.roles.indexOf(employee.role);
                employee.role = $scope.roles[indexOf];
            });
        };
    }
]);
