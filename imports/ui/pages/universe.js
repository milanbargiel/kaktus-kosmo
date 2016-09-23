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
  // Set projectData to data of project referenced from click event
  this.projectData.save = (event) => {
    this.projectData.set({
      projectId: event.currentTarget.__data__._id,
      projectName: event.currentTarget.__data__.name,
    });
  };
  // Store temporary UI states in Session (globally)
  Session.set({
    showCreateProject: false,
    showRenameProject: false,
    showRemoveProject: false,
  });
});

Template.Universe_page.helpers({
  showCreateProject() {
    return Session.get('showCreateProject');
  },
  showRenameProject() {
    return Session.get('showRenameProject');
  },
  showRemoveProject() {
    return Session.get('showRemoveProject');
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
  // .js-createProject-cancel is defined in components/project-forms.html
  'click .js-createProject-cancel'() {
    Session.set('showCreateProject', false);
  },

  // .js-renameProject is defined in d3/universe.js
  'click .js-renameProject'(event, templateInstance) {
    // event holds properties of Project
    templateInstance.projectData.save(event);
    Session.set('showRenameProject', true);
  },
  // .js-renameProject-cancel is defined in components/project-forms.html
  'click .js-renameProject-cancel'() {
    Session.set('showRenameProject', false);
  },

  // .js-removeProject is defined in d3/universe.js
  'click .js-removeProject'(event, templateInstance) {
    templateInstance.projectData.save(event);
    Session.set('showRemoveProject', true);
  },
  // .js-removeProject-cancel is defined in components/project-forms.html
  'click .js-removeProject-cancel'() {
    Session.set('showRemoveProject', false);
  },
});
