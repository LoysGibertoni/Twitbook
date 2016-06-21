/**
 * Member.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
	
	tableName: 'member',
  attributes: {
		
    id: {
			type: 'integer',
			columnName: 'id'
		},

		person: {
			type: 'integer',
			columnName: 'person'
		},

		community: {
			type: 'integer',
			columnName: 'community'
		}
		
  }
	
};
