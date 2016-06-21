module.exports = {

  login: function(req, res) {
    
    var login = req.param("login");
    var password = req.param("password");
    
    Person.query("SELECT person.authenticate('" + login + "', '" + password + "') AS result", function(error, queryResult) {
      
      if (error) {
        throw error;
      }

      var code = queryResult.rows[0].result;

      if (code == 1) {
        
        PersonService.getDataByLogin(login, function(result) {
          
          req.session.person = result;
          req.session.person.login = login;
          return res.redirect("/home");

        });

      } else if (code == 0) {

        // Handle error: wrong password
        return res.forbidden(); 

      } else if (code == -1) {

        // Handle error: user does not exist
        return res.redirect("/");

      } else {

        return res.serverError();

      }

    });

  },

  deletePerson: function(req, res) {

    Person.query("DELETE FROM person WHERE id = " + req.session.person.id, function(error, queryResult) {
    
      return res.redirect('/');

    });

  },

  signUp: function(req, res) {
    
    var login = req.param("login");
    var password = req.param("password");
    var confirm = req.param("confirmPassword");

    if (password != confirm) {
      // Handle error: confirm password doesn't match
    }

    Person.query("SELECT person.sign_up('" + login + "', '" + password + "')", function(error, queryResult) {
      
      if (error) {
        throw error;
      }

      // Add feedback
      return res.redirect('/');

    });

  },

  personView: function(req, res) {
    
    var login = req.param("login");
    
    Person.query("SELECT person.has_user('" + login + "') AS result", function(error, queryResult) {
      
      if (error) {
        throw error;
      }
      
      var found = queryResult.rows[0].result;
      
      if (found) {
        return res.view("profile", {
          person: login,
          logged: req.session.person.id
        });
      } else {
        return res.notFound();
      }
      
    });
    
  },

  homeView: function(req, res) {

    return res.view("home", {
      logged: req.session.person.id
    });

  },

  searchResultView: function(req, res) {

    var filter = req.param("filter");

    return res.view("searchResult", {
      logged: req.session.person.id,
      filter: filter
    });

  },

  editProfile: function(req, res) {
    
    return res.view("editProfile", {
      logged: req.session.person.id
    });

  },

  updateProfile: function(req, res) {
    
    var login = req.param("login");
    var oldPassword = req.param("oldp");
    var newPassword = req.param("newp");
    var confirmPassword = req.param("confirmp");
    var displayName = req.param("display");
    var description = req.param("description");
    var birthDate = new Date(req.param("bdate")).toISOString();

    if (newPassword != confirmPassword) {
      // Handle error: confirm password doesn't match
      return res.redirect("/profile/" + req.session.person.login);
    }

    if (oldPassword == "" && newPassword == "") {
      oldPassword = "NULL";
      newPassword = "NULL";
    } else {
      oldPassword = "'" + oldPassword + "'";
      newPassword = "'" + newPassword + "'"
    }
      
    Person.query("SELECT person.update_info('" + login + "', " + oldPassword + ", " + newPassword + ", '" + displayName + "', '" + description + "', '" + birthDate + "')", function(error, queryResult) {
      
      if (error) {
        throw error;
      }

      return res.redirect("/profile/" + req.session.person.login);

    });

  },

  goHome: function(req, res) {
    
    return res.redirect("/home");

  },

  logOut: function (req, res) {
    
    delete req.session.person;
    return res.redirect("/");

  },

  getDataById: function(req, res) {
    
    var id = req.param("id");
    PersonService.getDataById(id, function(result) {
      return res.json(result);
    });

  },

  getDataByLogin: function(req, res) {
    
    var login = req.param("login");
    PersonService.getDataByLogin(login, function(result) {
      return res.json(result);
    });

  },

  getFollowNumbers: function(req, res) {
    
    var login = req.param("login");
    
    Person.query("SELECT * FROM person.get_follow_numbers('" + login + "')", function(error, queryResult) {
      
      if (error) {
        throw error;
      }
      
      return res.json(queryResult.rows[0]);
      
    });
    
  },
  
  followUnfollow: function(req, res) {
    
    var follower = req.param("follower");
    var following = req.param("following");
    var follows = req.param("follows");

    if (follows) {

      Person.query("DELETE FROM follower WHERE follower = '" + follower + "' AND following = '" + following + "'", function(error, queryResult) {
      
        if (error) {
          throw error;
        }
        
        return res.json({});
        
      });

    }
    else {

      Person.query("INSERT INTO follower (follower, following) VALUES (" + follower + ", " + following + ")", function(error, queryResult) {
      
        if (error) {
          throw error;
        }
        
        return res.json({});
        
      });

    }
    
  },

  getPosts: function(req, res) {
    
    var login = req.param("login");
    
    Person.query("SELECT * FROM person.get_posts('" + login + "')", function(error, queryResult) {
      
      if (error) {
        throw error;
      }
      
      return res.json(queryResult.rows);
      
    });
    
  },

  getGroups: function(req, res) {
    
    var id = req.param("id");
    
    Person.query("SELECT * FROM person.get_groups(" + id + ")", function(error, queryResult) {
      
      if (error) {
        throw error;
      }
      
      return res.json(queryResult.rows);
      
    });
    
  },

  isFollowing: function(req, res) {
    
    var follower = req.param("follower");
    var following = req.param("following");
    
    Person.query("SELECT person.is_following(" + follower + ", " + following + ") AS result", function(error, queryResult) {
      
      if (error) {
        throw error;
      }
      
      return res.json(queryResult.rows[0].result);
      
    });
    
  },

  getSearchResults: function(req, res) {
    
    var filter = req.param("filter");
    
    Person.query("SELECT * FROM person.get_search_results('" + filter + "')", function(error, queryResult) {
      
      if (error) {
        throw error;
      }

      return res.json(queryResult.rows);
      
    });
    
  },

  getNotMemberSearchResults: function(req, res) {
    
    var group = req.param("group");
    var filter = req.param("filter");
    
    Person.query("SELECT * FROM person.get_not_member_search_results(" + group + ", '" + filter + "')", function(error, queryResult) {
      
      if (error) {
        throw error;
      }

      return res.json(queryResult.rows);
      
    });
    
  },

  importPerson: function(req, res) {
    
    var id = req.param("id");
    var display_name = req.param("display_name");
    var login = req.param("login");
    var password = req.param("password");
    var birth_date = req.param("birth_date");
    var description = req.param("description");

    Person.query("INSERT INTO person (id, display_name, login, password, birth_date, description) VALUES (" + id + ", '" + display_name + "', '" + login + "', '" + password + "', '" + birth_date + "', '" + description + "')", function(error, queryResult) {
      
      return res.json({});

    });

  }
  
};
