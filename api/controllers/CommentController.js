module.exports = {
	
  getComments: function(req, res) {
    
    var content = req.param("content");

    Comment.query("SELECT * FROM reaction.get_comments(" + content + ")", function(error, queryResult) {
      
      if (error) {
        throw error;
      }

      return res.json(queryResult.rows);

    });

  },

  newComment: function(req, res) {
    
    var person = req.param("person");
    var content = req.param("content");
    var description = req.param("description");
    
    Comment.query("SELECT reaction.new_comment("+ person + ", " + content + ", '" + description + "')", function(error, queryResult) {
      
      if (error) {
        throw error;
      }

      return res.json({});

    });

  }

};

