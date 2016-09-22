import { Template } from 'meteor/templating';
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
  showCreateProject() {
    return Session.get('showCreateProject');
  },
});

Template.Universe_page.events({
  'click .js-createProject'() {
    Session.set('showCreateProject', true);
  },
});
