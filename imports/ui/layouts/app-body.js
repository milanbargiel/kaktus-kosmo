import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';

/* Import template */
import './app-body.html';

Template.App_body.events({
  'click .js-logout'() {
    Meteor.logout(() => {
      FlowRouter.go('/login');
    });
  },
});
