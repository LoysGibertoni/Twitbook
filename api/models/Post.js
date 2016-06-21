/**
 * Post.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
	
	tableName: 'post',
  attributes: {
		
    id: {
			type: 'integer',
			columnName: 'id'
		},

		title: {
			type: 'string',
			size: 16,
			columnName: 'title'
		},

		content: {
			type: 'string',
			size: 255,
			columnName: 'content'
		},

		author: {
			type: 'integer',
			columnName: 'author'
		}
		
  }
	
};
