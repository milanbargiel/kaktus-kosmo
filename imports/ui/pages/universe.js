import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Session } from 'meteor/session';
import { ReactiveVar } from 'meteor/reactive-var';
import Projects from '../../api/projects/projects.js'; // Projects Collection

/* Import templates */
import './universe.html';
import '../components/project-forms.js';

/* Import d3js function Universe */
import Universe from '../d3/universe.js';

/* Subscribe to Projects Collection */
Template.Universe_page.onCreated(function () {
  this.rendered = new ReactiveVar(false); // this refers to Template instance
  this.subscribe('projects');
  /* Store temporary UI states in Session (globally) */
  Session.set({
    showCreateProject: false,
  });
});

Template.Universe_page.onRendered(function () {
  /* When all DOM elements are rendered set reactive var to true -> initVis() */
  this.rendered.set(true);
});

Template.Universe_page.helpers({
  initVis() {
    const projects = Projects.find({}).fetch();
    /* When subscription is ready and DOM is rendered */
    if (projects.length && Template.instance().rendered) {
      const universe = new Universe('.visualization');
      universe.initialize(projects);
      return true;
    }
    return false;
  },
  pathForProject() {
    const project = this; // this references Document
    const params = { projectId: project._id };
    const routeName = 'planet'; // route '/projects/:projectId'
    /* Generate path */
    const path = FlowRouter.path(routeName, params);

    return path;
  },
  showCreateProject() {
    return Session.get('showCreateProject');
  },
});

Template.Universe_page.events({
  'click .js-createProject'() {
    Session.set('showCreateProject', true);
  },
});
