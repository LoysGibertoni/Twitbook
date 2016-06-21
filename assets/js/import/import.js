var app = angular.module("import", []);

app.controller("import", function ($scope, $http) {

  $scope.populateDatabase = function(object) {

    var fileTobeRead = document.getElementById('fileToRead').files[0];
    var fileReader = new FileReader(); 
    
    fileReader.onload = function (e) { 
      
      try{
        var object = JSON.parse(fileReader.result);
      }
      catch(err) {
        alert("Arquivo inválido.");
      }

      if (object != null) {
        
        // Importar usuários
        object.users.forEach(function(item) {

          var from = item.birthday.split("-");
          var birthDate = new Date(from[2], from[1] - 1, from[0]);

          $http.post("/Person/importPerson", {
            id: item.id,
            display_name: item.nome,
            login: item.login,
            password: item.password,
            birth_date: birthDate.toISOString(),
            description: item.bio
          });

        });

        // Importar seguidores
        object.follow.forEach(function(item) {

          $http.post("/Follower/importFollower", {
            id: item.id,
            follower: item.follower,
            following: item.follows
          });

        });

        // Importar grupos
        /*object.group.forEach(function(owner) {

          owner.list.forEach(function(group) {

            $http.post("/Community/importCommunity", {
              owner: owner.id,
              name: group.nome
            });

            group.users.forEach(function(member) {

              $http.post("/Community/addMember", {
                group: $scope.group,
                person: $scope.results[index].id
              });

            });

          });

        });

        // Importar tweets
        object.tweets.forEach(function(item) {

          $http.post("/Post/importPost", {
            id: item.id,
            title: item.title,
            content: item.text,
            author: item.user
          });

          $http.post("/Content/importContent", {
            id: item.id,
            title: item.title,
            content: item.text,
            author: item.user
          });

        });*/
      
      }

    } 
    fileReader.readAsText(fileTobeRead);

  }

});
