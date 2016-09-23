/* Projects Collection - Methods
–––––––––––––––––––––––––––––––––––––––––––––––––– */
import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

// Import Projects Collection
import Projects from './projects.js';

export const insert = new ValidatedMethod({
  // ValidatedMethod will use name to register method with Meteor
  name: 'projects.insert',
  // pick(): Pull out schema key 'name' and build a new schema out of it
  validate: Projects.simpleSchema().pick('name').validator(),
  // run insertion with name attribute
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

export const rename = new ValidatedMethod({
  name: 'projects.rename',
  // validate aggainst fields defined in Projects.simpleSchema()
  validate: new SimpleSchema({
    projectId: Projects.simpleSchema().schema('_id'),
    newName: Projects.simpleSchema().schema('name'),
  }).validator(),
  run({ projectId, newName }) {
    // validation is missing here, does user have the rights to do so?
    Projects.update(projectId, { $set: { name: newName } });
  },
});

export const remove = new ValidatedMethod({
  name: 'projects.remove',
  validate: Projects.simpleSchema().pick('_id').validator(),
  run({ projectId }) {
    Projects.remove(projectId);
  },
});
