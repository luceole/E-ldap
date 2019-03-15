'use strict';
// Set default node environment to production
process.env.NODE_ENV = process.env.NODE_ENV || 'production';
var mongoose = require('mongoose');
var config = require('./config/local.env');
var ldap = require('ldapjs');
var parseFilter = require('ldapjs').parseFilter;
var User =  require('./api/user/user.model.js');
var Group =  require('./api/group/group.model.js');

// Connect to database

// Connect to MongoDB
mongoose.connect(config.mongo.uri, config.mongo.options);
console.log(config.mongo.uri)
mongoose.connection.on('error', function(err) {
  console.error(`MongoDB connection error: ${err}`);
  process.exit(-1);
});



var SUFFIX='dc=eole';
var ldapUsers = {};
var query=User.find({isactif: true}).populate('memberOf', 'name') //  Fonction de lecture des  actifs


function authorize(req, res, next) {
//console.log(req.connection.ldap.bindDN.toString())
//console.log(req.dn.toString());
 if (req.connection.ldap.bindDN.toString() =="" || req.connection.ldap.bindDN.equals('cn=anonymous') )
    return next(new ldap.InsufficientAccessRightsError());
  return next();
}

function toLdap(u) {
  var memberof=[]
  for( var i = 0; i< u.memberOf.length; i++)
  {
   memberof[i]= u.memberOf[i].name;
  }
var r={
dn: 'cn='+u.uid.toLowerCase()+','+SUFFIX,
attributes: {
cn: u.uid.toLowerCase(),
uid: u.uid,
uuid: u.uid.toLowerCase(),
name: u.name ,
surname: u.surname,
structure: u.structure,
mail: u.email,
mailValid:u.mailValid,
role:u.role,
memberof: memberof,
adminof: u.adminOf.toString(),
objectclass: 'eoleUser',
createtimestamp: Date.now() - 10,
}
};
return(r);
}

var server = ldap.createServer();

server.listen(config.port, function() {
console.log("Ldap Server Started %s", server.url)
});

// LDAPBIND
server.bind(SUFFIX, function(req, res, next) {
var dn=req.dn.toString();
var uid=dn.split(",")[0].split("=")[1];

User.findOne({uid: uid}, function(err,u) {
//  console.log(u)
  if (err) console.log("****"+err);
  if (!u)    return next(new ldap.NoSuchObjectError(dn));
  if (!u.authenticate( req.credentials)) {
  console.log("BIND  %s Not Ok",u["uid"]) ;
  return next(new ldap.InvalidCredentialsError());
  }
  console.log("BIND  %s Ok",u["uid"] );
  res.end();
  return next();
});
});
// LDAPSEARCH
server.search(SUFFIX, authorize,   function(req, res, next) {
  var dn = req.dn.toString();
// console.log("dn:"+dn)
 var filter=parseFilter(req.filter.toString());
//  console.log(req.filter)
  query.exec(function(err,users) {
  var user = {};
  if (err) console.log(err);
        for( var i = 0; i< users.length; i++)
        {
         user= toLdap(users[i]);
         if (filter.matches(user.attributes))
         res.send(user);
        }
   res.end();
   return next();
   });
}); // Fin Search
