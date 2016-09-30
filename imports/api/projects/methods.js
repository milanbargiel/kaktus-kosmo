/* Projects Collection - Methods
–––––––––––––––––––––––––––––––––––––––––––––––––– */
import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { urlifier } from '../../lib/common-functions.js';

// Import Projects Collection
import Projects from './projects.js';

export const insert = new ValidatedMethod({
  // ValidatedMethod will use name to register method with Meteor
  name: 'projects.insert',
  // pick(): Pull out schema key 'name' and build a new schema out of it
  validate: Projects.simpleSchema().pick('name').validator(),
  // run insertion with name attribute
  run({ name }) {
    const user = Meteor.user();

    const project = {
      userId: user._id,
      author: user.username,
      name,
      slug: urlifier(name),
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
  validate: new SimpleSchema({
    projectId: Projects.simpleSchema().schema('_id'),
  }).validator(),
  run({ projectId }) {
    Projects.remove(projectId);
  },
});

export const makePublic = new ValidatedMethod({
  name: 'projects.makePublic',
  validate: new SimpleSchema({
    projectId: Projects.simpleSchema().schema('_id'),
    bool: Projects.simpleSchema().schema('public'),
  }).validator(),
  run({ projectId, bool }) {
    if (!Meteor.userId()) {
      throw new Meteor.Error('projects.makePublic.notLoggedIn',
        'Must be logged in.');
    }

    const project = Projects.findOne(projectId);

    // editableBy is a collection helper function defined in projects.js
    if (!project.editableBy(Meteor.userId())) {
      throw new Meteor.Error('projects.makePublic.accessDenied',
        'You don\'t have permission to edit this project.');
    }

    Projects.update(projectId, { $set: { public: bool } });
  },
});
