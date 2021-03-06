var app = angular.module("group");

app.controller("posts", function ($scope, $http, $sce) {

  $scope.init = function(group, logged) {
    $scope.group = group;
    $scope.logged = logged;
    $scope.getGroupPosts(group);
    $scope.editing = -1;
  };

  $scope.isPostOwner = function(index) { // Arrumar?

    return $scope.logged === $scope.posts[index].authorId;

  };

  $scope.getGroupPosts = function() {
    
    $scope.posts = [];
    
    $http.post("/Content/getGroupContent", {
      group: $scope.group
    }).then(
      
      function(res) {
        
        res.data.forEach(function(item) {
          $scope.posts.push({
            id: item.id,
            authorDisplayName: item.author_display_name,
            authorLogin: item.author_login,
            authorId: item.author_id,
            content: item.content,
            postedAt: item.posted_at,
            title: item.title,
            likes: item.likes,
            unlikes: item.unlikes,
            repost: item.repost
          });
        });
        
      },
      
      function(res) {
        console.log("ERROR " + res.status + ": " + res.statusText + "!");
      }
      
    );
    
  };

  $scope.newPost = function() {
    
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

    $http.post("/Content/newGroupContent", {
      id: $scope.group,
      person: $scope.logged,
      title: $scope.newPost.title,
      content: $scope.newPost.content
    }).then(

      function(res) {
        
        $scope.posts.unshift({
          id: res.data,
          authorDisplayName: logged.displayName,
          authorLogin: logged.login,
          authorId: $scope.logged,
          content: $scope.newPost.content,
          postedAt: Date.now(),
          title: $scope.newPost.title,
          likes: 0,
          unlikes: 0,
          repost: false,
          buffer: ""
        });

        $scope.newPost.title = "";
        $scope.newPost.content = ""; 
        
      },

      function(res) {
        console.log("ERROR " + res.status + ": " + res.statusText + "!");
      }

    );

  }

 $scope.editContent = function(index) {

    if ($scope.editing >= 0) {
      $scope.posts[$scope.editing].content = $scope.buffer.content;
      $scope.posts[$scope.editing].title = $scope.buffer.title;
    }

    $scope.editing = index;
    $scope.buffer = {
      content: $scope.posts[index].content,
      title: $scope.posts[index].title
    };
  };

  $scope.confirmChanges = function() {
    $http.post("/Content/updateContent", {
      id: $scope.posts[$scope.editing].id,
      title: $scope.posts[$scope.editing].title ? $scope.posts[$scope.editing].title : null, 
      content: $scope.posts[$scope.editing].content
    }).then(
      
      function(res) {

        $scope.editing = -1;

      },

      function(res) {
        console.log("ERROR " + res.status + ": " + res.statusText + "!");
      }

    );
  };

  $scope.cancelChanges = function() {
    $scope.posts[$scope.editing].content = $scope.buffer.content;
    $scope.posts[$scope.editing].title = $scope.buffer.title;
    delete $scope.buffer;
    $scope.editing = -1;
  };

  $scope.removeContent = function(index) {

    $http.post("/Content/removeContent", {
      id: $scope.posts[index].id
    }).then(

      function(res) {
        $scope.posts.splice(index, 1);
      },

      function(res) {
        console.log("ERROR " + res.status + ": " + res.statusText + "!");
      }

    );

  };

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
      $http.post("/Content/repostGroupContent", {
        group: $scope.group, 
        content: $scope.posts[index].id
      }).then(
        
        function(res) {
          $scope.posts.unshift({
            id: res.data,
            authorDisplayName: $scope.posts[index].authorDisplayName,
            authorLogin: $scope.posts[index].authorLogin,
            authorId: $scope.posts[index].authorId,
            content: $scope.posts[index].content,
            postedAt: Date.now(),
            title: $scope.posts[index].title,
            likes: 0,
            unlikes: 0,
            repost: true
          });
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
