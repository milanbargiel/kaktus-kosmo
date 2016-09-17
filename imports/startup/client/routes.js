/* Routes
–––––––––––––––––––––––––––––––––––––––––––––––––– */

import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

/* Import to load these templates */
import '../../ui/layouts/app-body.js';
import '../../ui/pages/planet.js';
import '../../ui/pages/universe.js';

/* projectId is fetched in Template */
FlowRouter.route('/projects/:projectId', {
  name: 'Planet',
  action() {
    /* render(layout-template, { region: template }) */
    BlazeLayout.render('App_body', { main: 'Planet' });
  },
});

FlowRouter.route('/', {
  name: 'Universe',
  action() {
    /* render(layout-template, { region: template }) */
    BlazeLayout.render('App_body', { main: 'Universe' });
  },
});
