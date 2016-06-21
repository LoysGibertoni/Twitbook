/**
 * Comment.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
	
	tableName: 'comment',
  attributes: {
		
    id: {
			type: 'integer',
			columnName: 'id' 
		},

		commenter: {
			type: 'integer',
			columnName: 'commenter'
		},

		content: {
			type: 'integer',
			columnName: 'content'
		},
		
		description: {
			type: 'string',
			size: 255,
			columnName: 'description'
		},
		
		commentedAt: {
			type: 'datetime',
			columnName: 'commented_at'
		}
		
  }
	
};
