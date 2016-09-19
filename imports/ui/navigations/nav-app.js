import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';

/* Import template */
import './nav-app.html';

Template.Nav_app.events({
  'click .js-logout'() {
    Meteor.logout(() => {
      FlowRouter.go('/login');
    });
  },
});
