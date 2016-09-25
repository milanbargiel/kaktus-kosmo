import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { ReactiveVar } from 'meteor/reactive-var';
import { FlowRouter } from 'meteor/kadira:flow-router';

import Projects from '../../api/projects/projects.js'; // Subscription is in universe-vis template

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

/* shareProject template
–––––––––––––––––––––––––––––––––––––––––––––––––– */
Template.shareProject.onCreated(function () {
  const projectIsPublic = Projects.findOne(this.data.data.projectId).public;
  this.public = new ReactiveVar(projectIsPublic);
});

Template.shareProject.helpers({
  isPrivate() {
    return !Template.instance().public.get();
  },
  isPublic() {
    return Template.instance().public.get();
  },
  urlForProject() {
    const routeName = 'planet'; // route '/projects/:projectId'
    const projectId = Template.instance().data.data.projectId;
    /* Generate url */
    const url = FlowRouter.url(routeName, { projectId });
    return url;
  },
});

Template.shareProject.events({
  'change .js-shareProject-radio'(event, templateInstance) {
    const val = $(event.target).val();
    if (val === 'public') {
      templateInstance.public.set(true);
    } else {
      templateInstance.public.set(false);
    }
  },
  'submit .js-shareProject-form'(event, templateInstance) {
    event.preventDefault();
    const projectId = templateInstance.data.data.projectId;
    const bool = templateInstance.public.get();
    Meteor.call('projects.makePublic', { projectId, bool });
    Session.set('showShareProject', false);
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

/* deleteProject template
–––––––––––––––––––––––––––––––––––––––––––––––––– */
Template.removeProject.events({
  'submit .js-removeProject-form'(event, templateInstance) {
    event.preventDefault();
    Meteor.call('projects.remove', { projectId: templateInstance.data.data.projectId });
    Session.set('showRemoveProject', false);
  },
});

