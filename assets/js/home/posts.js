var app = angular.module("home");

app.controller("posts", function ($scope, $http, $sce) {

  $scope.init = function(logged) {
    $scope.logged = logged;
    $scope.filter = "";
    $scope.getFollowingPosts();
  };

  $scope.getFollowingPosts = function() {
    
    $scope.posts = [];
    
    $http.post("/Content/getFollowingContent", {
      person: $scope.logged,
      filter: $scope.filter
    }).then(
      
      function(res) {
        
        res.data.forEach(function(item) {
          $scope.posts.push({
            id: item.id,
            authorDisplayName: item.author_display_name,
            authorLogin: item.author_login,
            content: item.content,
            postedAt: item.posted_at,
            title: item.title,
            likes: item.likes,
            unlikes: item.unlikes
          });
        });
        
      },
      
      function(res) {
        console.log("ERROR " + res.status + ": " + res.statusText + "!");
      }
      
    );
    
  };

  $scope.newPost = function() {
    
    $http.post("/Content/newPersonContent", {
      id: $scope.logged,
      title: $scope.newPost.title,
      content: $scope.newPost.content
    }).then(

      function(res) {
        
        $scope.newPost.title = "";
        $scope.newPost.content = ""; 
        
      },

      function(res) {
        console.log("ERROR " + res.status + ": " + res.statusText + "!");
      }

    );

  }

  $scope.likeContent = function(index) {

    $http.post("/Reaction/like", {
      person: $scope.logged,
      content: $scope.posts[index].id
    }).then(
      
      function(res) {

        switch (res.data) {
          case 1:
            $scope.posts[index].likes++;
            $scope.posts[index].unlikes--;
            break;
          case 0:
            $scope.posts[index].likes++;
            break;
          case -1:
            $scope.posts[index].likes--;
            break;
        }

      },

      function(res) {
        console.log("ERROR " + res.status + ": " + res.statusText + "!");
      }

    );

  };

  $scope.unlikeContent = function(index) {

    $http.post("/Reaction/unlike", {
      person: $scope.logged,
      content: $scope.posts[index].id
    }).then(
      
      function(res) {

        switch (res.data) {
          case 1:
            $scope.posts[index].unlikes++;
            $scope.posts[index].likes--;
            break;
          case 0:
            $scope.posts[index].unlikes++;
            break;
          case -1:
            $scope.posts[index].unlikes--;
            break;
        }
      
      },

      function(res) {
        console.log("ERROR " + res.status + ": " + res.statusText + "!");
      }

    );

  };

  $scope.repostContent = function(index) {

    var accept = confirm("Você deseja republicar esta publicação?");
    if (accept) {
      $http.post("/Content/repostPersonContent", {
        person: $scope.logged, 
        content: $scope.posts[index].id
      }).then(
        
        function(res) {

        },

        function(res) {
          console.log("ERROR " + res.status + ": " + res.statusText + "!");
        }

      );
    }
  };

  $scope.getComments = function(index) {
    
    $scope.posts[index].comments = [];

    $http.post("/Comment/getComments", {
      content: $scope.posts[index].id
    }).then(

      function(res) {

        res.data.forEach(function(item) {

          $scope.posts[index].comments.push({
            authorDisplayName: item.author_display_name,
            authorLogin: item.author_login,
            description: item.description,
            commentedAt: item.commented_at
          });

        });

      },

      function(res) {
        console.log("ERROR " + res.status + ": " + res.statusText + "!");
      }

    );

  };

  $scope.newComment = function(index) {

    var logged = {};

    $http.post("/Person/getDataById", {
      id: $scope.logged
    }).then(

      function(res) {
        logged.login = res.data.login;
        logged.displayName = res.data.display_name;
      },

      function(res) {
        console.log("ERROR " + res.status + ": " + res.statusText + "!");
      }

    );

    $http.post("/Comment/newComment", {
      person: $scope.logged,
      content: $scope.posts[index].id,
      description: $scope.posts[index].buffer 
    }).then(

      function(res) {
        
        $scope.posts[index].comments.push({
          authorDisplayName: logged.displayName,
          authorLogin: logged.login,
          description: $scope.posts[index].buffer.slice(0),
          commentedAt: Date.now()
        });

        $scope.posts[index].buffer = "";

      },

      function(res) {
        console.log("ERROR " + res.status + ": " + res.statusText + "!");
      }

    );

  };

  $scope.parse = function(text) {
    return $sce.trustAsHtml(text
      .replace(/\$l:"(.*?)"/g, "<a href=\"$1\">$1</a>")
      .replace(/\$i:"(.*?)"/g, "<img src=\"$1\"/>")
      .replace(/\$v:"(.*?)"/g, "<video src=\"$1\" controls>$1</video>"));
  }

});
