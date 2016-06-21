var app = angular.module("profile");

app.controller("info", function ($scope, $http, person) {

  $scope.init = function(login, logged) {
    $scope.login = login;
    $scope.logged = logged;
    $scope.getPerson();
    $scope.getFollowNumbers();
    $scope.isFollowing();
  };

  $scope.isProfileOwner = function() {
    return $scope.logged === $scope.person.id;
  };

  $scope.getPerson = function() {
    $scope.person = {};
    person.getPerson($scope.login, $scope.person);
  };
  
  $scope.getFollowNumbers = function() {
    
    $scope.follow = {};
    
    $http.post("/Person/getFollowNumbers", {
      login: $scope.login
    }).then(
      
      function(res) {
        $scope.follow = res.data;
      },
      
      function(res) {
        console.log("ERROR " + res.status + ": " + res.statusText + "!");
      }
      
    );
    
  };

  $scope.isFollowing = function() {
    
    $http.post("/Person/getDataByLogin", {
      login: $scope.login
    }).then(
      
      function(res) {

        $http.post("/Person/isFollowing", {
          follower: $scope.logged,
          following: res.data.id
        }).then(
          
          function(res) {
            $scope.following = res.data;
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

  $scope.followUnfollow = function() {

    $http.post("/Person/followUnfollow", {
      follower: $scope.logged,
      following: $scope.person.id,
      follows: $scope.following
    }).then(
      
      function(res) {
        $scope.following = !$scope.following;
        if ($scope.following) {
          $scope.follow.followers++;
        }
        else {
          $scope.follow.followers--;
        }

      },
      
      function(res) {
        console.log("ERROR " + res.status + ": " + res.statusText + "!");
      }
      
    );

  };

  $scope.removePerson = function() {

    var accept = confirm("Você deseja excluir-se do Twitbook?");
    if (accept) {

      location = "/deletePerson";

    }
      
}
	
});
