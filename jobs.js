
import { Meteor } from 'meteor/meteor';

import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Mongo } from 'meteor/mongo';

const Jobs = new Mongo.Collection('jobs');

// Deny all client-side updates since we will be
// using methods to manage this collection
Jobs.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});


var schema = new SimpleSchema({
  eventName: {type: String},
  lastOccurence: {type: Date, optional: true},
  errText: {type: String, optional: true},
  createdAt: {
    type: Date,
    optional: true,
    autoValue: function() {
      if (this.isInsert) return new Date();
      if (this.isUpsert) return {$setOnInsert: new Date()};
      this.unset();
    },
  },
  updatedAt: {
    type: Date,
    optional: true,
    autoValue: function() {
      if (this.isUpdate) return new Date();
    },
    denyInsert: true,
  },
});


Jobs.attachSchema(schema);


export default Jobs;
