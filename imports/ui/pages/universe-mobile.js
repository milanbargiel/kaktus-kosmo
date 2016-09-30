import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { pathForProject } from '../../lib/common-functions.js';

// Import templates
import './universe-mobile.html';

// Import Projects Collection
import Projects from '../../api/projects/projects.js';

Template.Universe_mobile_page.onCreated(function () {
  this.subscribe('projects');
});

Template.Universe_mobile_page.helpers({
  'projects'() {
    return Projects.find();
  },
  'pathForProject'(username, projectSlug) {
    return pathForProject(username, projectSlug);
  },
  'redirectToCreate'() {
    FlowRouter.go('create');
  },
});
