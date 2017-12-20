'use strict';
/*eslint no-invalid-this:0*/
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');
const authTypes = ['github', 'twitter', 'facebook', 'google'];

var UserSchema = new Schema({
  uid: {
    required: true,
    type: String,
    unique: true
  },
  surname: String,
  name: String,
  email: {
    required: true,
    type: String,
    lowercase: true,
  },
  role: {
    type: String,
    default: 'user'
  },
  password: {
    type: String,
    required: true
  },
  provider: String,
  structure: String,
  isactif: Boolean,
  isdemande: Boolean,
  hashedPassword: String,
  pwdToken: String,
  urlToken: String,
  mailValid: Boolean,
  firstdate: Date,
  creationDate: {
    type: Date,
    'default': Date.now
  },
  authorPadID: String,
  memberOf: [{
    type: Schema.Types.ObjectId,
    ref: 'Group'
  }],
  adminOf: [{
    type: Schema.Types.ObjectId,
    ref: 'Group'
  }],
  salt: String,
  google: {},
  github: {},
});


/**
 * Methods
 */
UserSchema.methods = {
  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} password
   * @param {Function} callback
   * @return {Boolean}
   * @api public
   */
  authenticate(password, callback) {
    if (!callback) {
      return this.password === this.encryptPassword(password);
    }

    this.encryptPassword(password, (err, pwdGen) => {
      if (err) {
        return callback(err);
      }

      if (this.password === pwdGen) {
        return callback(null, true);
      } else {
        return callback(null, false);
      }
    });
  },

  /*
   * Encrypt password
   *
   * @param {String} password
   * @param {Function} callback
   * @return {String}
   * @api public
   */
  encryptPassword(password, callback) {
    if (!password || !this.salt) {
      if (!callback) {
        return null;
      } else {
        return callback('Missing password or salt');
      }
    }

    var defaultIterations = 10000;
    var defaultKeyLength = 64;
    var salt = new Buffer(this.salt, 'base64');

    if (!callback) {
      return crypto.pbkdf2Sync(password, salt, defaultIterations, defaultKeyLength)
        .toString('base64');
    }

    return crypto.pbkdf2(password, salt, defaultIterations, defaultKeyLength, (err, key) => {
      if (err) {
        return callback(err);
      } else {
        return callback(null, key.toString('base64'));
      }
    });
  }
};

module.exports = mongoose.model('User', UserSchema);

