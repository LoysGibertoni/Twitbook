/**
 * Community.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
	
	tableName: 'community',
  attributes: {
		
    id: {
			type: 'integer',
			columnName: 'id'
		},

		owner: {
			type: 'integer',
			columnName: 'owner'
		},

		name: {
			type: 'string',
			size: 16,
			columnName: 'name'
		}
		
  }
	
};
