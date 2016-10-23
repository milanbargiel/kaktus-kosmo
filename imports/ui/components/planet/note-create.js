/* Note_create
–––––––––––––––––––––––––––––––––––––––––––––––––– */

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import './note-create.html';

Template.Note_create.onRendered(() => {
  /* client side validation with themeteorchef:jquery-validation */
  $('.js-note-create-form').validate({
    rules: {
      text: {
        required: true,
        maxlength: 512,
      },
    },
  });
});

Template.Note_create.events({
  'submit .js-note-create-form'(event, templateInstance) {
    event.preventDefault();
    /* Retrieve value */
    const text = templateInstance.find('textarea[name="text"]').value;
    /* Clear input field */
    templateInstance.find('textarea[name="text"]').value = '';
    /* Insert document into collection */
    Meteor.call('notes.insert', { projectId: templateInstance.data.projectId, text });
  },
});
