/**
 * Follower.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
	
	tableName: 'follower',
  attributes: {
		
    id: {
			type: 'integer',
			columnName: 'id' 
		},

		follower: {
			type: 'integer',
			columnName: 'follower'
		},
		
		following: {
			type: 'integer',
			columnName: 'following'
		}
		
  }
	
};
