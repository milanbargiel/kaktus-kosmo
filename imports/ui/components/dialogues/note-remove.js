/* Note_remove
–––––––––––––––––––––––––––––––––––––––––––––––––– */

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import './note-remove.html';

Template.Note_remove.events({
  'submit .js-note-remove-form'(event, templateInstance) {
    event.preventDefault();
    Meteor.call('notes.remove', { noteId: templateInstance.data.noteId });
  },
});
