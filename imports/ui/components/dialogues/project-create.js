/* Project_create
–––––––––––––––––––––––––––––––––––––––––––––––––– */

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import './project-create.html';

Template.Project_create.onRendered(() => {
  /* client side validation with themeteorchef:jquery-validation */
  $('.js-project-create-form').validate({
    rules: {
      name: {
        required: true,
        maxlength: 32,
      },
    },
  });
});

Template.Project_create.events({
  'submit .js-project-create-form'(event, templateInstance) {
    event.preventDefault();
    /* Retrieve value */
    const name = templateInstance.find('input[name="name"]').value;
    /* Clear input field */
    templateInstance.find('input[name="name"]').value = '';
    /* Insert document into collection */
    Meteor.call('projects.insert', { name });
  },
});
