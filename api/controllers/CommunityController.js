/**
 * CommunityController
 *
 * @description :: Server-side logic for managing Communities
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	
  groupView: function(req, res) {
    
    var group = req.param("group");
    
    return res.view("group", {
      group: group,
      logged: req.session.person.id
    });
    
  },

  createGroupView: function(req, res) {

    return res.view("createGroup", {
      logged: req.session.person.id
    });
    
  },

  editGroupView: function(req, res) {
    
    var group = req.param("group");

    return res.view("editGroup", {
      group: group,
      logged: req.session.person.id
    });
    
  },

  addMembersView: function(req, res) {
    
    var group = req.param("group");
    var search = req.param("search");

    return res.view("addMembers", {
      search: search,
      group: group,
      logged: req.session.person.id
    });
    
  },

  addMembersEmptySearchView: function(req, res) {
    
    var group = req.param("group");

    return res.view("addMembers", {
      search: '',
      group: group,
      logged: req.session.person.id
    });
    
  },

  create: function(req, res) {

    var name = req.param("name");

    Community.query("SELECT community.new_community(" + req.session.person.id + ", '" + name + "')", function(error, queryResult) {
      
      if(error) {
        throw error;
      }

      return res.redirect("/home");
    
    });

  },

  delete: function(req, res) {

    var group = req.param("group");

    Community.query("DELETE FROM community WHERE id = " + group, function(error, queryResult) {
    
      return res.json({});

    });

  },

  getDataById: function(req, res) {
    
    var id = req.param("id");
    
    Community.query("SELECT owner, name FROM community WHERE id = '" + id + "'", function(error, queryResult) {
      
      if (error) {
        throw error;
      }
      
      return res.json(queryResult.rows[0]);
      
    });

  },

  getGroupMembers: function(req, res) {
    
    var id = req.param("id");

    Community.query("SELECT P.id AS id, P.display_name AS display_name, P.login AS login FROM member M JOIN person P ON P.id = M.person WHERE M.community = '" + id + "'", function(error, queryResult) {
      
      if (error) {
        throw error;
      }
      
      return res.json(queryResult.rows);
      
    });

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

  removeMember: function(req, res) {

    var group = req.param("group");
    var person = req.param("person");

    Person.query("DELETE FROM member WHERE person = " + person + " AND community = " + group, function(error, queryResult) {
      
      if (error) {
        throw error;
      }
      
      return res.json({});
      
    });

  },
  
  addMember: function(req, res) {

    var group = req.param("group");
    var person = req.param("person");

    Person.query("INSERT INTO member (person, community) VALUES (" + person + ", " + group + ")", function(error, queryResult) {
      
      if (error) {
        throw error;
      }
      
      return res.json({});
      
    });

  },

  /*getSearchResults: function(req, res) {
    
    var search = req.param("search");

    Person.query("SELECT id, display_name, login FROM person WHERE (display_name IS NOT NULL AND upper(display_name) LIKE upper('%" + search + "%')) OR upper(login) LIKE upper('%" + search + "%')", function(error, queryResult) {
      
      if (error) {
        throw error;
      }
      
      return res.json(queryResult.rows);
      
    });
  
  },*/

  getSearchResults: function(req, res) {
    
    var person = req.param("person");
    var filter = req.param("filter");
    
    Community.query("SELECT * FROM community.get_search_results(" + person + ", '" + filter + "')", function(error, queryResult) {
      
      if (error) {
        throw error;
      }

      return res.json(queryResult.rows);
      
    });
    
  }

};

