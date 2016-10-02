import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';
import { FlowRouter } from 'meteor/kadira:flow-router';

// import template
import './nav-mobile.html';

Template.Nav_mobile.onCreated(function () {
  this.showMenu = new ReactiveVar(false);
});

Template.Nav_mobile.helpers({
  showMenu() {
    return Template.instance().showMenu.get();
  },
});

Template.Nav_mobile.events({
  'click .js-show-menu'(event, templateInstance) {
    templateInstance.showMenu.set(!templateInstance.showMenu.get());
  },
  'click .js-logout'() {
    Meteor.logout(() => {
      FlowRouter.go('/login');
    });
  },
});
