var app = angular.module('myApp', ['ui.router']);
app.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/home');
    $stateProvider
        .state('home', {
            url: '/getStudents',
            templateUrl: '/static/view-student.html'
        })
        .state('addStudent', {
            url: '/addStudent',
            templateUrl: '/static/add-student.html'
        })
        .state('editStudent', {
            url: '/home/editStudent',
            templateUrl: '/static/edit-student.html'
        });
});
app.factory("StudentService", function ($q, $filter, $http) {
    return new function () {
        var studentInfo = {};
        studentInfo.studentList = [];
        studentInfo.addStudent = function (id, name, dob) {
            studentInfo.studentList.push({ id, name, dob });
            $http({
                method: 'POST',
                url: '/addStudent',
                headers: {
                    'Content-Type': "application/json"
                },
                data: JSON.stringify({ id: id, name: name, dob: dob })
            }).success(function (response) {
                console.log('student added');
            });
        }
        studentInfo.viewStudents = function () {
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: '/getStudents',
                headers: {
                    'Content-Type': "application/json"
                },
            }).success(function (response) {
                console.log('students received');
                var temp = [];
                for (var i = 0; i < response.length; i++) {
                    temp.push({ _id: response[i]._id, id: response[i].id, name: response[i].name, dob: response[i].dob });
                }
                studentInfo.studentList = temp;
                console.log("1 studentList bf")
                console.log(studentInfo.studentList);
                console.log("1 studentList af")
                deferred.resolve(studentInfo.studentList);
            }).error(function (res, err) { console.log("error"); deferred.reject("Rejected"); });
            return deferred.promise;
        }
        studentInfo.getStudent = function (_id) {
            console.log("In getStudent");
            console.log(studentInfo.studentList);
            var position = studentInfo.studentList.map(function (e) { return e._id; }).indexOf(_id);
            console.log("POSITION " + position);
            return studentInfo.studentList[position];
        }
        studentInfo.editStudent = function (student) {
            var position = studentInfo.studentList.map(function (e) { return e._id; }).indexOf(student._id);
            console.log(position);
            studentInfo.studentList[position] = student;
            $http({
                method: 'POST',
                url: '/updateStudent',
                headers: {
                    'Content-Type': "application/json"
                },
                data: JSON.stringify({ _id: student._id, id: student.id, name: student.name, dob: student.dob })
            }).success(function (response) {
                console.log("Successfully updated");
            });
        }
        studentInfo.deleteStudent = function (_id) {
            // console.log(studentInfo.studentList[indexId]);
            var position = studentInfo.studentList.map(function (e) { return e._id; }).indexOf(_id);
            console.log(position);
            studentInfo.studentList.splice(position, 1);
            $http({
                method: 'POST',
                url: '/deleteStudent',
                headers: {
                    'Content-Type': "application/json"
                },
                data: JSON.stringify({ _id: _id})
            }).success(function (response) {
                console.log("Successfully deleted");
            });
        }
        return studentInfo;
    }
});
app.controller("MainController", function ($scope, $location, $route, $window, StudentService) {
    console.log("In MainController");
    $scope.onloadFun=function(){
        console.log("In init");
        $scope.students = StudentService.viewStudents();
    }
    $scope.addStudent = function (id, name, dob) {
        console.log("Add student " + " " + id + " " + name + " " + dob);
        StudentService.addStudent(id, name, dob);
        $scope.students = StudentService.viewStudents();
        // console.log("Scope students after StudentService call");
        // console.log($scope.students);
        $location.url('/home');
    }
    $scope.viewStudents = function () {
        $scope.students = StudentService.viewStudents();
        console.log("In controller view students");
        console.log($scope.students);
    }
    $scope.editStudent = function (_id) {
        console.log("In edit Student");
        $scope.student = [];
        $scope.student = StudentService.getStudent(_id);
        console.log($scope.student);
        // $scope.submit = StudentService.editStudent($scope.student);
        $scope.submit = function () {
            console.log($scope.student);
            StudentService.editStudent($scope.student);
        }
        console.log($scope.student);
        $scope.students = StudentService.viewStudents();
    }

    $scope.deleteStudent = function (_id) {
        console.log("deleteStudent " + _id);
        StudentService.deleteStudent(_id);
        $scope.students = StudentService.viewStudents();
    }

    // viewStudents();
});
app.directive("myStudent", function () {
    return {
        restrict: 'EA',
        templateUrl: '/static/view-student.html'
    }
});
app.directive('newStudent', function () {
    return {
        restrict: 'EA',
        templateUrl: '/static/add-student.html'
    };
});