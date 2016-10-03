/* Project_share
–––––––––––––––––––––––––––––––––––––––––––––––––– */

import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { ReactiveVar } from 'meteor/reactive-var';

import './project-share.html';

Template.Project_share.onCreated(function () {
  /* instance.data holds values received from parent smart component */
  const project = this.data.project;
  /* reactive var store temporary form state */
  /* initial value is projects current public field (true or false) */
  this.public = new ReactiveVar(project.public);
});

Template.Project_share.helpers({
  isPrivate() {
    return !Template.instance().public.get();
  },
  isPublic() {
    return Template.instance().public.get();
  },
  /* Show URL to share when isPublic returns true */
  urlForProject() {
    const instance = Template.instance();
    const username = instance.data.project.author;
    const projectSlug = instance.data.project.slug;
    const routeName = 'planet'; // route '/:username/:projectSlug'
    /* Generate url */
    const url = FlowRouter.url(routeName, { username, projectSlug });
    return url;
  },
});

Template.Project_share.events({
  /* On change of selected radiobutton change state of form */
  'change .js-project-share-radio'(event, templateInstance) {
    const val = templateInstance.$(event.target).val();
    if (val === 'public') {
      templateInstance.public.set(true);
    } else {
      templateInstance.public.set(false);
    }
  },
  'submit .js-project-share-form'(event, templateInstance) {
    event.preventDefault();
    const projectId = templateInstance.data.project._id;
    const bool = templateInstance.public.get();
    Meteor.call('projects.makePublic', { projectId, bool });
  },
});
