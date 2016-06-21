var app = angular.module("profile", []);

app.factory("person", function($http) {
  
  return {

    getPerson: function(login, person) {

      $http.post("/Person/getDataByLogin", {
        login: login
      }).then(
        
        function(res) {

          person.id = res.data.id;
          person.displayName = res.data.display_name;
          person.photo = res.data.photo;
          person.description = res.data.description;
          person.birthDate = res.data.birth_date;
          
        },
        
        function(res) {
          person = null;
          console.log("ERROR " + res.status + ": " + res.statusText + "!");
        }
        
      );
    
    }

  };

});
