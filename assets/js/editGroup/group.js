var app = angular.module("editGroup", []);

app.controller("group", function ($scope, $http) {

  $scope.init = function(group, logged) {
    $scope.logged = logged;
    $scope.getGroup(group, logged);
  };

  $scope.getGroup = function(group, logged) {
    
    $scope.group = {};

    $http.post("/Community/getDataById", {
      id: group
    }).then(

      function(res) {
        
        if (logged != res.data.owner) {
          alert("Você não é o dono deste grupo.")
          window.location = "/home";
        }

        $scope.group.id = group;
        $scope.group.name = res.data.name;
        $scope.group.owner = res.data.owner;
        $scope.group.members = [];

        $http.post("/Community/getGroupMembers", {
          id: group
        }).then(

          function(res) {
        
            res.data.forEach(function(item) {
            $scope.group.members.push({
              id: item.id,
              login: item.login,
              displayName: item.display_name
            });

          });

          },

          function(res) {
            console.log("ERROR " + res.status + ": " + res.statusText + "!");
          }

        );

      },

      function(res) {
        console.log("ERROR " + res.status + ": " + res.statusText + "!");
      }

    );

  };

  $scope.removePerson = function(index) {

    $http.post("/Community/removeMember", {
      group: $scope.group.id,
      person: $scope.group.members[index].id
    }).then(

      function(res) {
        $scope.group.members.splice(index, 1);
      },

      function(res) {
        console.log("ERROR " + res.status + ": " + res.statusText + "!");
      }

    );

  };

});