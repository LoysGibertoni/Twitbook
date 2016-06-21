/**
 * Person.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  
  tableName: 'person',
  attributes: {
    
    id: {
      type: 'integer',
      columnName: 'id' 
    },

    login: {
      type: 'string',
      size: 20,
      columnName: 'login'
    },

    password: {
      type: 'string',
      size: 30,
      columnName: 'password'
    },

    displayName: {
      type: 'string',
      size: 30,
      columnName: 'display_name'
    },

    photo: {
      type: 'binary',
      columnName: 'photo'
    },

    description: {
      type: 'string',
      size: 128,
      columnName: 'description'
    },
    
    birthDate: {
      type: 'date',
      columnName: 'birth_date'
    }
    
  }
  
};
