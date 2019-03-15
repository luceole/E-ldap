'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//const crypto = require('crypto');

var GroupSchema = new Schema({
  name: {
    type: String,
    unique: true
  },
  info: String,
  note: String,
  active: Boolean,
  groupPadID: String,
  digest: String,
  type: Number // 0 Ouvert, 5 Modéré, 10 Fermé
  // owner: {
  //   type: Schema.Types.ObjectId,
  //   ref: 'User',
  //   required: true
  //
  // },
  // adminby: [{
  //   type: Schema.Types.ObjectId,
  //   ref: 'User'
  // }],
  // participants: [{
  //   type: Schema.Types.ObjectId,
  //   ref: 'User'
  // }],
  // demandes: [{
  //   type: Schema.Types.ObjectId,
  //   ref: 'User'
  // }],
  // events: [EventSchema]
}, {
  usePushEach: true
});
module.exports =  mongoose.model('Group', GroupSchema);
