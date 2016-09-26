import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { ReactiveVar } from 'meteor/reactive-var';

// Import templates
import './universe.html';
import '../components/nav-main.js';
import '../components/dialogue.js';

// Import d3js Universe function
import Universe from '../d3/universe.js';

// Import Projects Collection
import Projects from '../../api/projects/projects.js';

Template.Universe_page.onCreated(function () {
  // Selected project id
  this.projectId = new ReactiveVar();
  // Save state of UI (dialogues) globally in Session
  Session.set('activeDialogue', false);
  Tracker.autorun(() => {
    // Whenever dialogue is hidden set referenced projectId to null
    if (Session.get('activeDialogue') === false) {
      this.projectId.set(null);
    }
  });
});

Template.Universe_page.onRendered(function () {
  this.subscribe('projects', () => {
    const universe = new Universe('.visualization');

    // Listen reactively for changes in Collection
    // Establish a live query that invokes callbacks when the result of the query changes
    Projects.find().observe({
      added(newDocument) {
        universe.addNode(newDocument);
      },
      changed(newDocument) {
        universe.renameNode(newDocument._id, newDocument.name);
      },
      removed(oldDocument) {
        universe.removeNode(oldDocument._id);
      },
    });
  });
});

Template.Universe_page.helpers({
  projectArgs() {
    // pass document to dialogues
    const projectId = Template.instance().projectId.get();
    const project = Projects.findOne(projectId);
    return project;
  },
});

Template.Universe_page.events({
  'click .js-dialogue'(event, templateInstance) {
    // __data__ property only exists on a d3 element
    if (typeof event !== 'undefined' && event.currentTarget && event.currentTarget.__data__) {
      const projectId = event.currentTarget.__data__._id;
      templateInstance.projectId.set(projectId);
    }
    const dialogueTemplate = templateInstance.$(event.target).data('dialogue-template');
    Session.set('activeDialogue', dialogueTemplate);
  },
  'click .js-dialogue-cancel'() {
    // Hide form
    Session.set('activeDialogue', false);
  },
});
