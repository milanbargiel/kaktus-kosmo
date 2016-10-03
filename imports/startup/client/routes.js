/* Routes
–––––––––––––––––––––––––––––––––––––––––––––––––– */
/* Set up all routes in the app */

import { Session } from 'meteor/session';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { AccountsTemplates } from 'meteor/useraccounts:core';

/* Import to load these templates */
import '../../ui/layouts/app-body.js';
import '../../ui/pages/desktop/planet.js';
import '../../ui/pages/desktop/universe.js';
import '../../ui/pages/mobile/planet-mobile.js';
import '../../ui/pages/mobile/universe-mobile.js';
import '../../ui/pages/app-not-found.js';
import '../../ui/components/navigations/nav-mobile.js';
import '../../ui/components/navigations/nav-main.js';
import '../../ui/components/navigations/nav-auth.js';

/* Import to override accounts templates */
import '../../ui/accounts/accounts-templates.js';

/* Import useraccounts-configuration to define AccountsTemplates.configureRoute */
import '../both/useraccounts-configuration.js';


/* Indicate wether we have a mobile viewport
 * FlowRouter routes.js is not reactive
 * -> Function to determine viewport will only be executed once on page load
*/
const mobile = () => $(window).width() < 450;
Session.set('mobile', mobile());

/* Every URL with appearance '/something/something' will invoke 'planet' route
 * In the subscription of Planet_page (Planet_mobile_page) the callback will inform us
 * if query params are valid. If not we are redirected to App_notFound.
*/
FlowRouter.route('/:username/:projectSlug', {
  name: 'planet',
  action() {
    if (Session.get('mobile')) {
      /* render(layout-template, { region: template }) */
      BlazeLayout.render('App_body', { navigation: 'Nav_mobile', main: 'Planet_mobile_page' });
    } else {
      BlazeLayout.render('App_body', { navigation: 'Nav_main', main: 'Planet_page' });
    }
  },
});

FlowRouter.route('/', {
  name: 'universe',
  /* Ensure that user is signed in */
  triggersEnter: [AccountsTemplates.ensureSignedIn],
  action() {
    if (Session.get('mobile')) {
      BlazeLayout.render('App_body', { navigation: 'Nav_mobile', main: 'Universe_mobile_page' });
    } else {
      BlazeLayout.render('App_body', { navigation: 'Nav_main', main: 'Universe_page' });
    }
  },
});

/* the App_notFound template is used for unknown routes and private Projects */
FlowRouter.notFound = {
  name: 'notFound',
  action() {
    if (Session.get('mobile')) {
      BlazeLayout.render('App_body', { navigation: 'Nav_mobile', main: 'App_notFound' });
    } else {
      BlazeLayout.render('App_body', { navigation: 'Nav_main', main: 'App_notFound' });
    }
  },
};

/* Configuration of useraccounts package routes */
AccountsTemplates.configureRoute('signIn', {
  name: 'auth', // 'auth' is a group name used in template helper 'isActiveRoute'
  path: '/login',
});

AccountsTemplates.configureRoute('signUp', {
  name: 'auth',
  path: '/join',
});
