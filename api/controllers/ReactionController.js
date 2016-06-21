module.exports = {

	like: function(req, res) {

    var person = req.param("person");
    var content = req.param("content");

    Reaction.query("SELECT Reaction.Toggle_Like(" + person + ", " + content + ") AS result", function(error, queryResult) {

      if (error) {
        throw error;
      }

      return res.json(queryResult.rows[0].result);

    });

  },

  unlike: function(req, res) {

    var person = req.param("person");
    var content = req.param("content");

    Reaction.query("SELECT Reaction.Toggle_Unlike(" + person + ", " + content + ") AS result", function(error, queryResult) {

      if (error) {
        throw error;
      }

      return res.json(queryResult.rows[0].result);

    });

  }

};
