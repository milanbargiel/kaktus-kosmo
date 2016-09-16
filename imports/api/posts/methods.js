/* Posts Collection - Methods
–––––––––––––––––––––––––––––––––––––––––––––––––– */

/* Import SimpleSchema and ValidatedMethod */
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

/* Import Posts Collection */
import Posts from './posts';

export const insertPost = new ValidatedMethod({
  /* ValidatedMethod will use name to register method with Meteor */
  name: 'Posts.methods.insert',
  /* Check that passed values match Schema */
  validate: new SimpleSchema({
    text: { type: String },
  }).validator(),
  run({ text }) {
    Posts.insert(text);
  },
});

export const removePost = new ValidatedMethod({
  name: 'Posts.methods.remove',
  validate: new SimpleSchema({
    postId: { type: String },
  }).validator(),
  run({ postId }) {
    Posts.remove(postId);
  },
});
