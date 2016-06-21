/**
 * CommunityContent.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  
  tableName: 'community_content',
  attributes: {
    
    id: {
      type: 'integer',
      columnName: 'id'
    },
    
    community: {
      type: 'integer',
      columnName: 'community'
    }
    
  }
  
};
