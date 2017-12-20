'use strict';


module.exports = {
 mongo: {
    uri: process.env.MONGODB_URI
         || 'mongodb://localhost/e-users'
  },
port : process.env.PORT
       || 1389

};
