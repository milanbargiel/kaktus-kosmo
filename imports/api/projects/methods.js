/* Projects Collection - Methods
–––––––––––––––––––––––––––––––––––––––––––––––––– */

import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { urlifier } from '../../lib/common-functions.js';

/* Import Projects Collection */
import Projects from './projects.js';

export const insert = new ValidatedMethod({
  /* ValidatedMethod will use name to register method with Meteor */
  name: 'projects.insert',
  /* pick(): Pull out schema key 'name' and build a new schema out of it */
  validate: Projects.simpleSchema().pick('name').validator(),
  /* object ({ name }) is transfer paramer from method call */
  run({ name }) {
    const user = Meteor.user();

    const project = {
      userId: user._id,
      author: user.username,
      name,
      /* urlify project name */
      slug: urlifier(name),
      public: false,
      createdAt: new Date(),
    };

    Projects.insert(project);
  },
});

export const rename = new ValidatedMethod({
  name: 'projects.rename',
  /* validate aggainst fields defined in Projects.simpleSchema() */
  validate: new SimpleSchema({
    projectId: Projects.simpleSchema().schema('_id'),
    newName: Projects.simpleSchema().schema('name'),
  }).validator(),
  run({ projectId, newName }) {
    if (!Meteor.userId()) {
      throw new Meteor.Error('projects.rename.notLoggedIn',
        'Must be logged in.');
    }

    const project = Projects.findOne(projectId);

    /* belongsTo is a collection helper function defined in projects.js */
    if (!project.belongsTo(Meteor.userId())) {
      throw new Meteor.Error('projects.rename.accessDenied',
        'You don\'t have permission to rename this project.');
    }

    Projects.update(projectId, { $set: { name: newName } });
  },
});

export const remove = new ValidatedMethod({
  name: 'projects.remove',
  validate: new SimpleSchema({
    projectId: Projects.simpleSchema().schema('_id'),
  }).validator(),
  run({ projectId }) {
    if (!Meteor.userId()) {
      throw new Meteor.Error('projects.remove.notLoggedIn',
        'Must be logged in.');
    }

    const project = Projects.findOne(projectId);

    if (!project.belongsTo(Meteor.userId())) {
      throw new Meteor.Error('projects.remove.accessDenied',
        'You don\'t have permission to remove this project.');
    }

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

    if (!project.belongsTo(Meteor.userId())) {
      throw new Meteor.Error('projects.makePublic.accessDenied',
        'You don\'t have permission to edit this project.');
    }

    Projects.update(projectId, { $set: { public: bool } });
  },
});
