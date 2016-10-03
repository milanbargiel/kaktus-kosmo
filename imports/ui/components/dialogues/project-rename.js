/* Project_rename
–––––––––––––––––––––––––––––––––––––––––––––––––– */

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import './project-rename.html';

Template.Project_rename.onRendered(() => {
  /* client side validation with themeteorchef:jquery-validation */
  $('.js-project-rename-form').validate({
    rules: {
      name: {
        required: true,
        maxlength: 32,
      },
    },
  });
});

Template.Project_rename.events({
  'submit .js-project-rename-form'(event, templateInstance) {
    event.preventDefault();
    /* Retrieve value */
    const newName = templateInstance.find('input[name="name"]').value;
    /* Clear input field */
    templateInstance.find('input[name="name"]').value = '';
    /* Insert document into collection */
    Meteor.call('projects.rename', { projectId: templateInstance.data.project._id, newName });
  },
});
