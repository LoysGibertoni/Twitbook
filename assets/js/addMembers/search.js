var app = angular.module("addMembers", []);

app.controller("search", function ($scope, $http) {

  $scope.init = function(search, group, logged) {

    $http.post("/Community/getDataById", {
      id: group
    }).then(

      function(res) {
        
        if (logged != res.data.owner) {
          alert("Você não é o dono deste grupo.")
          window.location = "/home";
        }

        $scope.search = search;
        $scope.group = group;
        $scope.logged = logged;
        $scope.searchText = search;
        $scope.results = [];
        $scope.getSearchResults(search);

      },

      function(res) {
        console.log("ERROR " + res.status + ": " + res.statusText + "!");
      }

    );

  };

  $scope.getSearchResults = function(search) {

    $http.post("/Person/getNotMemberSearchResults", {
      group: $scope.group,
      filter: search
    }).then(

      function(res) {
        
        res.data.forEach(function(item) {
          $scope.results.push({
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

  $scope.addPerson = function(index) {

    $http.post("/Community/addMember", {
      group: $scope.group,
      person: $scope.results[index].id
    }).then(

      function(res) {
        window.location = "/editGroup/" + $scope.group;
      },

      function(res) {
        console.log("ERROR " + res.status + ": " + res.statusText + "!");
      }

    );

  }

});