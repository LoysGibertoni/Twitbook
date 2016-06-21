/**
 * Content.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
	
	tableName: 'content',
  attributes: {
		
    id: {
			type: 'integer',
			columnName: 'id' 
		},

		post: {
			type: 'integer',
			columnName: 'post'
		},
		
		postedAt: {
			type: 'datetime',
			columnName: 'posted_at'
		}
		
  }
	
};
