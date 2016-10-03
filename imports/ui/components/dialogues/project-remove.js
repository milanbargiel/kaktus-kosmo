/* Project_remove
–––––––––––––––––––––––––––––––––––––––––––––––––– */

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import './project-remove.html';

Template.Project_remove.events({
  'submit .js-project-remove-form'(event, templateInstance) {
    event.preventDefault();
    /* Insert document into collection */
    Meteor.call('projects.remove', { projectId: templateInstance.data.project._id });
  },
});
