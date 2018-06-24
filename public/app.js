var app = angular.module('myApp', ['ui.router']);
app.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/home');
    $stateProvider
        .state('home', {
            url: '/home',
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
app.factory("StudentService", function ($filter,$http) {
    return new function () {
        var studentInfo = {};
        studentInfo.studentList = [];
        studentInfo.addStudent = function (indexId, id, name, dob) {
            studentInfo.studentList.push({ indexId, id, name, dob });
			/*MongoClient.connect(url, function(err, db) {
			  if (err) throw err;
			  var dbo = db.db("mydb");
			  var myobj = { indexId:indexId,id:id,name: name,dob:dob};
			  dbo.collection("studoo").insertOne(myobj, function(err, res) {
				if (err) throw err;
				console.log("1 document inserted");
				db.close();
			  });
			});*/
			$http({
			  method: 'POST',
			  url: '/addStudent',
			  headers: {
			   'Content-Type': "application/json"
			 },
			  data: JSON.stringify({indexId:indexId,id:id,name: name,dob:dob})
			}).success(function(response) {
			  console.log('student added');
			  $scope.response = response;
			});
        }
        studentInfo.viewStudents = function () {
			$http({
			  method: 'GET',
			  url: '/getStudents',
			  headers: {
			   'Content-Type': "application/json"
			 },
			}).success(function(response) {
			  console.log('students received');
			  console.log(response[0]);
			  var temp=[];
			  for(var i=0; i < response.length; i++){
				  temp.push({indexId:response[i].indexId,id:response[i].id,name: response[i].name,dob:response[i].dob});
			  }
			  studentInfo.studentList=temp;
			  console.log(studentInfo.studentList);
		}).error(function(res,err){ console.log("error")});
            return studentInfo.studentList;
        }
        studentInfo.getStudent = function (indexId) {
            console.log("In getStudent");
            console.log("Index id " + indexId);
            console.log(studentInfo.studentList);
            var position=studentInfo.studentList.map(function(e){ return e.indexId; }).indexOf(indexId);
            console.log("POSITION "+position);
            return studentInfo.studentList[position];
        }
        studentInfo.editStudent = function (student) {
            var position=studentInfo.studentList.map(function(e){ return e.indexId; }).indexOf(student.indexId);
            console.log(position);
            studentInfo.studentList[position] = student;
        }
        studentInfo.deleteStudent=function(indexId){
            // console.log(studentInfo.studentList[indexId]);
            var position=studentInfo.studentList.map(function(e){ return e.indexId; }).indexOf(indexId);
            studentInfo.studentList.splice(position,1);
        }
        return studentInfo;
    }
});
app.controller("MainController", function ($scope, $location, $route, $window, StudentService) {
    var indexId = 0;
    console.log("In MainController");
    $scope.incrementIndexId = function () {
        indexId++;
    }
    $scope.addStudent = function (id, name, dob) {
        console.log("Add student " + indexId + " " + id + " " + name + " " + dob);
        StudentService.addStudent(indexId, id, name, dob);
        $scope.incrementIndexId();
        $scope.students = StudentService.viewStudents();
        console.log($location.url());
        $location.url('/home');
        console.log($location.url());
    }
    $scope.viewStudents = function () {
        $scope.students = StudentService.viewStudents();
    }
    $scope.editStudent = function (indexId) {
        console.log("In edit Student");
        $scope.student = StudentService.getStudent(indexId);
        console.log($scope.student);
        $scope.submit = StudentService.editStudent($scope.student);
        $scope.students = StudentService.viewStudents();
    }

    $scope.deleteStudent=function(indexId){
        console.log("deleteStudent "+indexId);
        StudentService.deleteStudent(indexId);
        $scope.students = StudentService.viewStudents();
    }

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