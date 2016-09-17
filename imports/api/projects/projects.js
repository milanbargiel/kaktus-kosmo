/* Projects Collection
–––––––––––––––––––––––––––––––––––––––––––––––––– */

import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

/* Tool to export Collections to window -> Makes debugging in Browser possible */
import { exportClient } from 'export-client';

const Projects = new Mongo.Collection('projects');
export default Projects;

/* When in development attach variable to window object (debugging) */
if (Meteor.isDevelopment) {
  exportClient({ Projects });
}
