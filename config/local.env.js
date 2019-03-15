'use strict';


module.exports = {
 mongo: {
    uri: process.env.MONGODB_URI
         || 'mongodb://localhost/e-users-dev',
    options: {
             useMongoClient: true
             }
  },
port : process.env.PORT
       || 1389

};
