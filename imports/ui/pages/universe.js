import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import Projects from '../../api/projects/projects.js'; // Projects Collection

/* Import template */
import './universe.html';

/* Subscribe to Projects Collection */
Template.Universe.onCreated(function () {
  this.subscribe('projects');
});

Template.Universe.helpers({
  projects() {
    return Projects.find({});
  },
  pathForProject() {
    const project = this; // this references Document
    const params = { projectId: project._id };
    const routeName = 'planet'; // route '/projects/:projectId'
    /* Generate path */
    const path = FlowRouter.path(routeName, params);

    return path;
  },
});
