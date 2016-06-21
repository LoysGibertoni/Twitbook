module.exports = {

  getContent: function(req, res) {
    
    var login = req.param("login");
    
    Content.query("SELECT * FROM person.get_posts('" + login + "')", function(error, queryResult) {
      
      if (error) {
        throw error;
      }
      
      return res.json(queryResult.rows);
      
    });
    
  },

  getFollowingContent: function(req, res) {
    
    var person = req.param("person");
    var filter = req.param("filter");
    
    Content.query("SELECT * FROM person.get_following_posts(" + person + ", '" + filter + "')", function(error, queryResult) {
      
      if (error) {
        throw error;
      }
      
      return res.json(queryResult.rows);
      
    });
    
  },

  getGroupContent: function(req, res) {
    
    var group = req.param("group");
    
    Content.query("SELECT * FROM community.get_posts(" + group + ")", function(error, queryResult) {
      
      if (error) {
        throw error;
      }
      
      return res.json(queryResult.rows);
      
    });
    
  },

  newPersonContent: function(req, res) {
    
    var id = req.param("id");
    var title = req.param("title");
    var content = req.param("content");

    Content.query("SELECT post.person_new_post(" + id + ", '" + title + "', '" + content + "')", function(error, queryResult) {
      
      if (error) {
        throw error;
      }

      return res.json({});

    });

  },

  newGroupContent: function(req, res) {
    
    var id = req.param("id");
    var person = req.param("person");
    var title = req.param("title");
    var content = req.param("content");

    Content.query("SELECT post.group_new_post(" + id + ", " + person + ", '" + title + "', '" + content + "') AS id", function(error, queryResult) {
      
      if (error) {
        throw error;
      }

      return res.json(queryResult.rows[0].id);

    });

  },

  repostPersonContent: function(req, res) {
    
    var person = req.param("person");
    var content = req.param("content");

    Content.query("SELECT post.person_repost(" + person + ", " + content + ") AS id", function(error, queryResult) {

      if (error) {
        throw error;
      }

      return res.json(queryResult.rows[0].id);

    });

  },

  repostGroupContent: function(req, res) {
    
    var group = req.param("group");
    var content = req.param("content");

    Content.query("SELECT post.group_repost(" + group + ", " + content + ") AS id", function(error, queryResult) {

      if (error) {
        throw error;
      }

      return res.json(queryResult.rows[0].id);

    });

  },
	
  removeContent: function(req, res) {
    
    var id = req.param("id");

    Content.query("SELECT post.person_delete(" + id + ")", function(error, queryResult) {

      if (error) {
        throw error;
      }
      
      return res.json({});

    });

  },

  updateContent: function(req, res) {
    
    var id = req.param("id");
    var content = req.param("content");
    var title = req.param("title");

    Content.query("SELECT post.person_update(" + id + ", " + (title != null ? ("'" + title + "'") : "null") + ", " + (content != null ? ("'" + content + "'") : "null")+ ")", function(error, queryResult) {

      if (error) {
        throw error;
      }

      return res.json({});

    });

  }

};
