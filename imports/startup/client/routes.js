/* Routes
–––––––––––––––––––––––––––––––––––––––––––––––––– */

import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

/* Import to load these templates */
import '../../ui/layouts/app-body.js';
import '../../ui/pages/universe.js';

FlowRouter.route('/', {
  action() {
    /* render(layout-template, { region: template }) */
    BlazeLayout.render('App_body', { main: 'Universe' });
  },
});
