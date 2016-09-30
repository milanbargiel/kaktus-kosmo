/* Routes
–––––––––––––––––––––––––––––––––––––––––––––––––– */

import { Session } from 'meteor/session';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { AccountsTemplates } from 'meteor/useraccounts:core';

/* Import to load these templates */
import '../../ui/layouts/app-body.js';
import '../../ui/layouts/mobile-body.js';
import '../../ui/pages/planet.js';
import '../../ui/pages/planet-mobile.js';
import '../../ui/pages/universe.js';
import '../../ui/pages/universe-mobile.js';
import '../../ui/pages/app-not-found.js';

/* Import to override accounts templates */
import '../../ui/accounts/accounts-templates.js';

/* Import useraccounts-configuration to define AccountsTemplates.configureRoute */
import '../both/useraccounts-configuration.js';

// Indicate wether we have a mobile viewport
const mobile = () => $(window).width() < 450;
Session.set('mobile', mobile());

/* pathForProject is defined in template Universe with username and projectName */
FlowRouter.route('/:username/:projectSlug', {
  name: 'planet',
  action() {
    if (Session.get('mobile')) {
      /* render(layout-template, { region: template }) */
      BlazeLayout.render('Mobile_body', { main: 'Planet_mobile_page' });
    } else {
      BlazeLayout.render('App_body', { main: 'Planet_page' });
    }
  },
});

FlowRouter.route('/', {
  name: 'universe',
  /* Ensure that user is signed in */
  triggersEnter: [AccountsTemplates.ensureSignedIn],
  action() {
    if (Session.get('mobile')) {
      BlazeLayout.render('Mobile_body', { main: 'Universe_mobile_page' });
    } else {
      BlazeLayout.render('App_body', { main: 'Universe_page' });
    }
  },
});

/* the App_notFound template is used for unknown routes and private Projects */
FlowRouter.notFound = {
  name: 'notFound',
  action() {
    if (Session.get('mobile')) {
      BlazeLayout.render('Mobile_body', { main: 'App_notFound' });
    } else {
      BlazeLayout.render('App_body', { main: 'App_notFound' });
    }
  },
};

AccountsTemplates.configureRoute('signIn', {
  name: 'auth', // 'auth' is a group name used in template helper 'isActiveRoute'
  path: '/login',
});

AccountsTemplates.configureRoute('signUp', {
  name: 'auth',
  path: '/join',
});
