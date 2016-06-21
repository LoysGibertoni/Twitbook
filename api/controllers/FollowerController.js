/**
 * FollowerController
 *
 * @description :: Server-side logic for managing Followers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	
  importFollower: function(req, res) {
    
    var id = req.param("id");
    var follower = req.param("follower");
    var following = req.param("following");

    Person.query("INSERT INTO follower (id, follower, following) VALUES (" + id + ", " + follower + ", " + following + ")", function(error, queryResult) {
      
      return res.json({});

    });

  }

};

