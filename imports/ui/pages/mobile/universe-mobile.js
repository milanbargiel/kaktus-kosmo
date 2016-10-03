import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { pathForProject } from '../../../lib/common-functions.js';

// Import Projects Collection
import Projects from '../../../api/projects/projects.js';

// import templates
import './universe-mobile.html';
import '../../components/navigations/nav-mobile.js';

Template.Universe_mobile_page.onCreated(function () {
  this.showCreateProject = new ReactiveVar(false);
  this.subscribe('projects', () => {
    if (Projects.find().count() === 0) {
      // When there are not projects show project create form
      this.showCreateProject.set(true);
    }
  });
});

Template.Universe_mobile_page.helpers({
  'showCreateProject'() {
    return Template.instance().showCreateProject.get();
  },
  'projects'() {
    return Projects.find();
  },
  'pathForProject'(username, projectSlug) {
    return pathForProject(username, projectSlug);
  },
});

Template.Universe_mobile_page.events({
  // Project_create form
  'click .js-dialogue'(event, templateInstance) {
    templateInstance.showCreateProject.set(true);
  },
  'click .js-dialogue-cancel, submit .js-project-create-form'(event, templateInstance) {
    templateInstance.showCreateProject.set(false);
  },
});
