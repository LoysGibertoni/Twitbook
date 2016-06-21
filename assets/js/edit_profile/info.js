var app = angular.module("editProfile", []);

app.controller("editInfo", function($scope, $http) {
  
  $scope.init = function(logged) {
    $scope.getLogged(logged);
    $scope.logged.id = logged;
    $scope.editingPassword = {
      current: "",
      update: "",
      confirm: ""
    };
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
        $scope.logged.birthDate = new Date(Date.parse(res.data.birth_date));

      },

      function(res) {
        console.log("ERROR " + res.status + ": " + res.statusText + "!"); 
      }

    );

  };

  $scope.update = function(log) {
    
    $http.post("/Person/updateProfile", {
      id: $scope.logged.id,
      oldp: $scope.editingPassword.current,
      newp: $scope.editingPassword.update,
      confirmp: $scope.editingPassword.confirm,
      display: $scope.logged.displayName,
      description: $scope.logged.description,
      bdate: $scope.logged.birthDate.toISOString()
    }).then(

      function(res) {
        
        if (!res.data) {
          console.log("Senha errada!");  
        }

      },

      function(res) {
        console.log("ERROR " + res.status + ": " + res.statusText + "!"); 
      }

    );

  }

});