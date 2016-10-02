import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

// Import Projects Collection
import Projects from '../../../api/projects/projects.js';

// Import templates
import './universe.html';
import '../../components/navigations/nav-main.js';
import '../../components/dialogue.js';

// Import d3js Universe function
import Universe from '../../d3/universe.js';

Template.Universe_page.onCreated(function () {
  this.dialogue = new ReactiveDict();
  this.dialogue.set({
    // projectId instantiates with click event on d3 header element
    // references currently selected project
    projectId: '',
    // Save state of UI (dialogues)
    // Holds name of form to render
    // Perform operations (insert, update, remove) on projects collection
    activeDialogue: false,
  });

  this.autorun(() => {
    // Whenever dialogue is hidden set referenced projectId to null
    if (this.dialogue.get('activeDialogue') === false) {
      this.dialogue.set('projectId', '');
    }
  });
});

Template.Universe_page.onRendered(function () {
  // Subscribe to users projects
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
  dialogueArgs() {
    const instance = Template.instance();
    const projectId = instance.dialogue.get('projectId');
    const project = Projects.findOne(projectId);
    return {
      // name of form to render
      activeDialogue: instance.dialogue.get('activeDialogue'),
      // project document to perform operation on
      project,
    };
  },
});

Template.Universe_page.events({
  'click .js-dialogue'(event, templateInstance) {
    // Operations on existing project (visualised as d3 element)
    // __data__ property only exists on a d3 element
    if (typeof event !== 'undefined' && event.currentTarget && event.currentTarget.__data__) {
      // set projectId to id of d3 element
      const projectId = event.currentTarget.__data__._id;
      templateInstance.dialogue.set('projectId', projectId);
    }
    const dialogueTemplate = templateInstance.$(event.target).data('dialogue-template');
    templateInstance.dialogue.set('activeDialogue', dialogueTemplate);
  },
  // on cancel and on submit
  'click .js-dialogue-cancel, submit .js-dialogue-form'(event, templateInstance) {
    event.preventDefault();
    // Hide form
    templateInstance.dialogue.set('activeDialogue', false);
  },
});
