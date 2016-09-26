import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

// import template
import './project-remove.html';

Template.Project_remove.events({
  'submit .js-project-remove-form'(event, templateInstance) {
    event.preventDefault();
    Meteor.call('projects.remove', { projectId: templateInstance.data.project._id });
    Session.set('activeDialogue', false);
  },
});
