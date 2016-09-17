/* Posts Collection - Methods
–––––––––––––––––––––––––––––––––––––––––––––––––– */

/* Import SimpleSchema and ValidatedMethod */
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

import Posts from './posts.js'; // Import posts collection
import Projects from '../projects/projects.js'; // Import projects collection

export const insert = new ValidatedMethod({
  /* ValidatedMethod will use name to register method with Meteor */
  name: 'posts.insert',
  /* Check that passed values match Schema */
  validate: new SimpleSchema({
    projectId: { type: String },
    text: { type: String },
  }).validator(),
  run({ projectId, text }) {
    const project = Projects.findOne(projectId);

    /* Check wether defined project exists */
    if (!project) {
      throw new Meteor.Error('posts.insert.accessDenied',
        'A post must belong to a project');
    }

    const post = {
      projectId,
      text,
    };

    Posts.insert(post);
  },
});

export const remove = new ValidatedMethod({
  name: 'posts.remove',
  validate: new SimpleSchema({
    postId: { type: String },
  }).validator(),
  run({ postId }) {
    Posts.remove(postId);
  },
});
