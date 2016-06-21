var app = angular.module("search", []);

app.controller("results", function ($scope, $http) {

  $scope.init = function(filter, logged) {
    $scope.filter = filter;
    $scope.logged = logged;
    $scope.getPersonResults();
    $scope.getGroupResults();
  };

  $scope.getPersonResults = function() {
    
    $scope.personResults = [];
    
    $http.post("/Person/getSearchResults", {
      filter: $scope.filter
    }).then(
      
      function(res) {
        
        res.data.forEach(function(item) {
          $scope.personResults.push({
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
    
  };

  $scope.getGroupResults = function() {
    
    $scope.groupResults = [];
    
    $http.post("/Community/getSearchResults", {
      person: $scope.logged,
      filter: $scope.filter
    }).then(
      
      function(res) {
        
        res.data.forEach(function(item) {
          $scope.groupResults.push({
            id: item.id,
            owner: item.owner,
            name: item.name
          });
        });
        
      },
      
      function(res) {
        console.log("ERROR " + res.status + ": " + res.statusText + "!");
      }
      
    );
    
  }

});
