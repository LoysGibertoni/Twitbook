var app = angular.module("home", []);

app.controller("info", function ($scope, $http) {

  $scope.init = function(logged) {
    $scope.getLogged(logged);
  };

  $scope.getLogged = function(logged) {
    
    $scope.logged = {};

    $http.post("/Person/getDataById", {
      id: logged
    }).then(

      function(res) {
        
        $scope.logged.login = res.data.login;
        $scope.logged.displayName = res.data.display_name;
        $scope.logged.photo = res.data.photo;
        $scope.logged.description = res.data.description;
        $scope.logged.birthDate = res.data.birth_date;
        $scope.logged.groups = [];

        $http.post("/Person/getGroups", {
          id: logged
        }).then(

          function(res) {
            
            res.data.forEach(function(item) {
            $scope.logged.groups.push({
              id: item.id,
              name: item.name,
              owner: item.owner
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

  }

});