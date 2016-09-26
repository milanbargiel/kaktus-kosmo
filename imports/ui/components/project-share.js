import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

// import template
import './project-share.html';

Template.Project_share.onCreated(function () {
  const project = this.data.project;
  // reactive var store temporary form state
  this.public = new ReactiveVar(project.public);
});

Template.Project_share.helpers({
  isPrivate() {
    return !Template.instance().public.get();
  },
  isPublic() {
    return Template.instance().public.get();
  },
  urlForProject() {
    const routeName = 'planet'; // route '/projects/:projectId'
    // this.project is project document passed to template from Universe_page
    const projectId = this.project._id;
    // Generate url
    const url = FlowRouter.url(routeName, { projectId });
    return url;
  },
});

Template.Project_share.events({
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
    Session.set('activeDialogue', false);
  },
});
