import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { ReactiveVar } from 'meteor/reactive-var';
import { pathForProject } from '../../../lib/common-functions.js';

// Import Projects Collection
import Projects from '../../../api/projects/projects.js';

// import template
import './universe-mobile.html';

Template.Universe_mobile_page.onCreated(function () {
  this.showCreateProject = new ReactiveVar(false);
  this.subscribe('projects', () => {
    if (Projects.find().count() === 0) {
      FlowRouter.go('/create');
    }
  });
});

Template.Universe_mobile_page.helpers({
  'showCreateProject'() {
    return Template.instance().showCreateProject.get();
  },
  'projects'() {
    return Projects.find();
  },
  'pathForProject'(username, projectSlug) {
    return pathForProject(username, projectSlug);
  },
});

Template.Universe_mobile_page.events({
  // Project_create form
  'click .js-dialogue'(event, templateInstance) {
    templateInstance.showCreateProject.set(true);
  },
  'click .js-dialogue-cancel'(event, templateInstance) {
    templateInstance.showCreateProject.set(false);
  },
  'submit .js-project-create-form'(event, templateInstance) {
    templateInstance.showCreateProject.set(false);
  },
});
