/* Projects Collection - Methods
–––––––––––––––––––––––––––––––––––––––––––––––––– */

/* Import SimpleSchema and ValidatedMethod */
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

/* Import Projects Collection */
import Projects from './projects.js';

export const insert = new ValidatedMethod({
  /* ValidatedMethod will use name to register method with Meteor */
  name: 'projects.insert',
  /* Check that passed values match Schema */
  validate: new SimpleSchema({
    author: { type: String },
  }).validator(),
  run({ author }) {
    Projects.insert({ author });
  },
});

export const remove = new ValidatedMethod({
  name: 'projects.remove',
  validate: new SimpleSchema({
    projectId: { type: String },
  }).validator(),
  run({ projectId }) {
    Projects.remove(projectId);
  },
});
