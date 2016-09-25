/* Posts Collection
–––––––––––––––––––––––––––––––––––––––––––––––––– */

import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

/* Tool to export Collections to window -> Makes debugging in Browser possible */
import { exportClient } from 'export-client';

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
  author: {
    type: String,
  },
  text: {
    type: String,
    max: 512,
  },
  createdAt: {
    type: Date,
  },
});

Posts.attachSchema(Posts.schema);

/* When in development attach variable to window object (debugging) */
if (Meteor.isDevelopment) {
  exportClient({ Posts });
}
