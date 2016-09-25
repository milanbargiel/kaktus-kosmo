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
    console.log(event.currentTarget.__data__.public);
    this.projectData.set({
      projectId: event.currentTarget.__data__._id,
      projectName: event.currentTarget.__data__.name,
      public: event.currentTarget.__data__.public,
    });
  };
  // Store temporary UI states in Session (globally)
  Session.set({
    showCreateProject: false,
    showShareProject: false,
    showRenameProject: false,
    showRemoveProject: false,
  });
});

Template.Universe_page.helpers({
  showCreateProject() {
    return Session.get('showCreateProject');
  },
  showShareProject() {
    return Session.get('showShareProject');
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
      public: Template.instance().projectData.get('public'),
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

  'click .js-shareProject'(event, templateInstance) {
    // save project data to template instance
    templateInstance.projectData.save(event);
    Session.set('showShareProject', true);
  },
  // .js-createProject is defined in d3/universe.js
  'click .js-shareProject-cancel'() {
    Session.set('showShareProject', false);
  },

  'click .js-renameProject'(event, templateInstance) {
    // event holds properties of Project
    templateInstance.projectData.save(event);
    Session.set('showRenameProject', true);
  },
  'click .js-renameProject-cancel'() {
    Session.set('showRenameProject', false);
  },

  'click .js-removeProject'(event, templateInstance) {
    templateInstance.projectData.save(event);
    Session.set('showRemoveProject', true);
  },
  'click .js-removeProject-cancel'() {
    Session.set('showRemoveProject', false);
  },
});
