import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

// Import templates
import './project-forms.html';

/* createProject template
–––––––––––––––––––––––––––––––––––––––––––––––––– */
Template.createProject.onRendered(function () {
  const templateInstance = this;
  // client side validation with jquery validation
  $('.js-createProject-form').validate({
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
      Session.set('showCreateProject', false);
    },
  });
});

Template.createProject.events({
  'click .js-createProject-cancel'() {
    // Hide form, Sessions defined in Universe_page
    Session.set('showCreateProject', false);
  },
});

/* renameProject template
–––––––––––––––––––––––––––––––––––––––––––––––––– */
Template.renameProject.onRendered(function () {
  const templateInstance = this;
  $('.js-renameProject-form').validate({
    rules: {
      name: {
        required: true,
        maxlength: 32,
      },
    },
    submitHandler() {
      const newName = templateInstance.find('input[name="name"]').value;
      templateInstance.find('input[name="name"]').value = '';
      // projectId is passed to this templateInstance from parent template Universe_page
      Meteor.call('projects.rename', { projectId: templateInstance.data.data.projectId, newName });
      Session.set('showRenameProject', false);
    },
  });
});

Template.renameProject.events({
  'click .js-renameProject-cancel'() {
    Session.set('showRenameProject', false);
  },
});
