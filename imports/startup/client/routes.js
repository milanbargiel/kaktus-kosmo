/* Routes
–––––––––––––––––––––––––––––––––––––––––––––––––– */

import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { AccountsTemplates } from 'meteor/useraccounts:core';

/* Import to load these templates */
import '../../ui/layouts/app-body.js';
import '../../ui/navigations/nav-app.js';
import '../../ui/pages/planet.js';
import '../../ui/pages/universe.js';

/* Import to override accounts templates */
import '../../ui/accounts/accounts-templates.js';
import '../../ui/navigations/nav-login.js';

/* projectId is fetched in Template */
FlowRouter.route('/projects/:projectId', {
  name: 'Planet',
  action() {
    /* render(layout-template, { region: template }) */
    BlazeLayout.render('App_body', { main: 'Planet', navigation: 'Nav_app' });
  },
});

FlowRouter.route('/', {
  name: 'Universe',
  /* Ensure that user is signed in */
  triggersEnter: [AccountsTemplates.ensureSignedIn],
  action() {
    BlazeLayout.render('App_body', { main: 'Universe', navigation: 'Nav_app' });
  },
});
