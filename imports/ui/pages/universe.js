import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Session } from 'meteor/session';

/* Import templates */
import './universe.html';
import '../components/project-forms.js';
import '../visualizations/universe-vis.js';


Template.Universe_page.onCreated(() => {
  /* Store temporary UI states in Session (globally) */
  Session.set({
    showCreateProject: false,
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
