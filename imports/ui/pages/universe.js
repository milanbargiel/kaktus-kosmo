import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Session } from 'meteor/session';
import Projects from '../../api/projects/projects.js'; // Projects Collection

/* Import templates */
import './universe.html';
import '../components/project-forms.js';

/* Import d3js function Universe */
import Universe from '../d3/universe.js';

/* Subscribe to Projects Collection */
Template.Universe_page.onCreated(() => {
  /* Store temporary UI states in Session (globally) */
  Session.set({
    showCreateProject: false,
  });
});

Template.Universe_page.onRendered(function () {
  /* Subscribe -> Callback */
  this.subscribe('projects', () => {
    const projects = Projects.find({}).fetch();
    const universe = new Universe('.visualization');
    universe.initialize(projects);

    /* Listen reactively for changes in Collection */
    /* Establish a live query that invokes callbacks when the result of the query changes */
    Projects.find().observe({
      added(newDocument) {
        universe.addNode(newDocument);
      },
      removed(oldDocument) {
        universe.removeNode(oldDocument._id);
      },
    });
  });
});

Template.Universe_page.helpers({
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
