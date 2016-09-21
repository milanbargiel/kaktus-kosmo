/* Projects Collection - Methods
–––––––––––––––––––––––––––––––––––––––––––––––––– */
import { Meteor } from 'meteor/meteor';

/* Import SimpleSchema and ValidatedMethod */
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

/* Import Projects Collection */
import Projects from './projects.js';

export const insert = new ValidatedMethod({
  /* ValidatedMethod will use name to register method with Meteor */
  name: 'projects.insert',
  /* pick(): Pull out schema key 'name' and build a new schema out of it */
  validate: Projects.simpleSchema().pick('name').validator(),
  /* run insertion with name attribute */
  run({ name }) {
    const project = {
      userId: Meteor.userId(),
      name,
      public: false,
      createdAt: new Date(),
    };

    Projects.insert(project);
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
