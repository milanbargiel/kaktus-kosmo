import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

/* Import templates */
import './project-forms.html';

Template.createProject.onRendered(function () {
  const templateInstance = this;
  $('.js-createProject-form').validate({
    rules: {
      name: {
        required: true,
        maxlength: 32,
      },
    },
    submitHandler() {
      /* Retrieve value */
      const name = templateInstance.find('input[name="name"]').value;
      /* Clear input field */
      templateInstance.find('input[name="name"]').value = '';
      /* Insert document into collection */
      Meteor.call('projects.insert', { name });
      /* Hide form */
      Session.set('showCreateProject', false);
    },
  });
});

Template.createProject.events({
  'click .js-createProject-cancel'() {
    /* Sessions defined in Universe_page */
    Session.set('showCreateProject', false);
  },
});
