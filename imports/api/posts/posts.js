/* Posts Collection
–––––––––––––––––––––––––––––––––––––––––––––––––– */

import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

/* Tool to export Collections to window -> Makes debugging in Browser possible */
import { exportClient } from 'export-client';

/* ES6 defaut export */
const Posts = new Mongo.Collection('posts');
export default Posts;

/* Validation Schema definition */
Posts.schema = new SimpleSchema({
  _id: {
    type: String,
     /* Regular Expression must be matched */
    regEx: SimpleSchema.RegEx.Id,
  },
  projectId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  userId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  author: {
    type: String,
  },
  text: {
    type: String,
    max: 512,
  },
  tags: {
    type: [String],
  },
  createdAt: {
    type: Date,
  },
});

Posts.attachSchema(Posts.schema);

/* dburles:collection-helpers */
Posts.helpers({
  belongsTo(userId) {
    /* if userId of post is equal to userId param */
    return this.userId === userId;
  },
});

/* When in development attach variable to window object (debugging) */
if (Meteor.isDevelopment) {
  exportClient({ Posts });
}
