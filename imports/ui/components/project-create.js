import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

// import template
import './project-create.html';

Template.Project_create.onRendered(function () {
  const templateInstance = this;
  // client side validation with jquery validation
  $('.js-project-create-form').validate({
    rules: {
      name: {
        required: true,
        maxlength: 32,
      },
    },
    submitHandler() {
      // Retrieve value
      const name = templateInstance.find('input[name="name"]').value;
      // Clear input field
      templateInstance.find('input[name="name"]').value = '';
      // Insert document into collection
      Meteor.call('projects.insert', { name });
      // Hide form
      Session.set('activeDialogue', false);
    },
  });
});
