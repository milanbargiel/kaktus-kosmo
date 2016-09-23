import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { ReactiveDict } from 'meteor/reactive-dict';

// Import templates
import './universe.html';
import '../components/project-forms.js';
import '../visualizations/universe-vis.js';


Template.Universe_page.onCreated(function () {
  // Store data of project in ReactiveDict on templateInstance -> pass it to project-form templates.
  // Data is needed there to perform rename, deletion on Projects Collection.
  this.projectData = new ReactiveDict();
  // Store temporary UI states in Session (globally)
  Session.set({
    showCreateProject: false,
    showRenameProject: false,
  });
});

Template.Universe_page.helpers({
  showCreateProject() {
    return Session.get('showCreateProject');
  },
  showRenameProject() {
    return Session.get('showRenameProject');
  },
  getProjectData() {
    return {
      projectId: Template.instance().projectData.get('projectId'),
      projectName: Template.instance().projectData.get('projectName'),
    };
  },
});

Template.Universe_page.events({
  'click .js-createProject'() {
    Session.set('showCreateProject', true);
  },

  // .js-renameProject is defined in d3/universe.js
  'click .js-renameProject'(event, templateInstance) {
    // Set reactive-dict to data reference from click event
    templateInstance.projectData.set({
      projectId: event.currentTarget.__data__._id,
      projectName: event.currentTarget.__data__.name,
    });
    Session.set('showRenameProject', true);
  },
});
