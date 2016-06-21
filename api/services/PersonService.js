module.exports = {
  
  getDataById: function(id, callback) {
    
    Person.query("SELECT login, display_name, photo, description, birth_date FROM person WHERE id = '" + id + "'", function(error, queryResult) {
      
      if (error) {
        throw error;
      }
      
      callback(queryResult.rows[0]);
      
    });

  },

  getDataByLogin: function(login, callback) {
    
    Person.query("SELECT id, display_name, photo, description, birth_date FROM person WHERE login = '" + login + "'", function(error, queryResult) {
      
      if (error) {
        throw error;
      }
      
      callback(queryResult.rows[0]);
      
    });

  }
  
};
