/* Routes
–––––––––––––––––––––––––––––––––––––––––––––––––– */

import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { AccountsTemplates } from 'meteor/useraccounts:core';

/* Import to load these templates */
import '../../ui/layouts/app-body.js';
import '../../ui/pages/planet.js';
import '../../ui/pages/universe.js';
import '../../ui/pages/app-not-found.js';

/* Import to override accounts templates */
import '../../ui/accounts/accounts-templates.js';

/* Import useraccounts-configuration to define AccountsTemplates.configureRoute */
import '../both/useraccounts-configuration.js';

/* pathForProject is defined in template Universe with projectId */
FlowRouter.route('/projects/:projectId', {
  name: 'planet',
  action() {
    /* render(layout-template, { region: template }) */
    BlazeLayout.render('App_body', { main: 'Planet' });
  },
});

FlowRouter.route('/', {
  name: 'universe',
  /* Ensure that user is signed in */
  triggersEnter: [AccountsTemplates.ensureSignedIn],
  action() {
    BlazeLayout.render('App_body', { main: 'Universe' });
  },
});

/* the App_notFound template is used for unknown routes and private Projects */
FlowRouter.notFound = {
  name: 'notFound',
  action() {
    BlazeLayout.render('App_body', { main: 'App_notFound' });
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
