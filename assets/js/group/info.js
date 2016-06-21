var app = angular.module("group", []);

app.controller("info", function ($scope, $http) {

  $scope.group = {};

  $scope.init = function(group, logged) {
    $scope.logged = logged;
    $scope.getGroup(group);
    $scope.getGroupMembers(group);
  };

  $scope.getGroup = function(group) {
    
    $http.post("/Community/getDataById", {
      id: group
    }).then(

      function(res) {
        
        $scope.group.id = group;
        $scope.group.owner = res.data.owner;
        $scope.group.name = res.data.name;

      },

      function(res) {
        console.log("ERROR " + res.status + ": " + res.statusText + "!");
      }

    );

  };

  $scope.getGroupMembers = function(group) {
    
    $scope.group.members = [];

    $http.post("/Community/getGroupMembers", {
      id: group
    }).then(
      
      function(res) {
        res.data.forEach(function(item) {
          $scope.group.members.push({
            displayName: item.display_name,
            login: item.login,
          });
        });
        
      },
      
      function(res) {
        console.log("ERROR " + res.status + ": " + res.statusText + "!");
      }
      
    );
  };

  $scope.removeGroup = function() {

    var accept = confirm("Você deseja excluir este grupo?");
    if (accept) {

      $http.post("/Community/delete", {
        group: $scope.group.id
      });
      location = "/home";

    }

  }

});