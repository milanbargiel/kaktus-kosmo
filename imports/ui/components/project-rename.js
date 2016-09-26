import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

// import template
import './project-rename.html';

Template.Project_rename.onRendered(function () {
  const templateInstance = this;
  $('.js-project-rename-form').validate({
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
      Meteor.call('projects.rename', { projectId: templateInstance.data.project._id, newName });
      Session.set('activeDialogue', false);
    },
  });
});
