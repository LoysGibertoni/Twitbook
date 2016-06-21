/**
 * Reaction.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
	
	tableName: 'reaction',
  attributes: {
		
    id: {
			type: 'integer',
			columnName: 'id' 
		},

		reacting: {
			type: 'integer',
			columnName: 'id'
		},

		content: {
			type: 'integer',
			columnName: 'content'
		},

		rating: {
			type: 'string',
			size: 1,
			columnName: 'rating'
		}

  }
	
};
