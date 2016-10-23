/* Notes Collection - Methods
–––––––––––––––––––––––––––––––––––––––––––––––––– */

import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

/* Import Notes and Projects Collections */
import Notes from './notes.js';
import Projects from '../projects/projects.js';

export const insert = new ValidatedMethod({
  /* ValidatedMethod will use name to register method with Meteor */
  name: 'notes.insert',
  /* pick(): Pull out schema keys 'projectId' and 'text' and build a new schema out of it */
  validate: Notes.simpleSchema().pick(['projectId', 'text']).validator(),
  /* object ({ projectId, text }) is transfer paramer from method call */
  run({ projectId, text }) {
    const project = Projects.findOne(projectId);
    const user = Meteor.user();

    if (!project) {
      /* end execution of insert. Meteor.Error could be displayed on client */
      throw new Meteor.Error('notes.insert.accessDenied',
        'A note must belong to a project');
    }

    if (!user) {
      throw new Meteor.Error('notes.insert.notLoggedIn',
        'Must be logged in to insert a note');
    }

    /* Extract tags (#tag) from text */
    /* Reference: http://geekcoder.org/js-extract-hashtags-from-text/ */
    const regex = /(?:^|\s)(#[a-zA-Z\d]+)/gm;
    const matches = [];
    let match;

    while ((match = regex.exec(text))) {
      matches.push(match[1]);
    }

    const note = {
      projectId,
      userId: user._id,
      author: user.username,
      /* Insert classed span tags arround hashtags */
      text: text.replace(regex, '<span class="thought__tag">$&</span>'),
      tags: matches,
      createdAt: new Date(),
    };

    Notes.insert(note);
  },
});

export const remove = new ValidatedMethod({
  name: 'notes.remove',
  validate: new SimpleSchema({
    noteId: Notes.simpleSchema().schema('_id'),
  }).validator(),
  run({ noteId }) {
    const note = Notes.findOne(noteId);
    const project = Projects.findOne(note.projectId);
    const userId = Meteor.userId();

    /* if user is not author of note and project does not belongs to him */
    /* -> dont allow to remove this note */
    if (!note.belongsTo(userId) && !project.belongsTo(userId)) {
      throw new Meteor.Error('notes.remove.accessDenied',
        'Must be owner of project or author of note to delete it');
    }

    Notes.remove(noteId);
  },
});
