/* Planet_page
–––––––––––––––––––––––––––––––––––––––––––––––––– */
/* Smart component:
 * -> Subscribe to data
 * -> Fetch data from those subscriptions
 * -> Pass data to reusable child components to render it.
*/

import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { ReactiveVar } from 'meteor/reactive-var';

/* Import collections */
import Projects from '../../../api/projects/projects.js';
import Notes from '../../../api/notes/notes.js';

/* Import templates */
import './planet.html';
import '../../components/navigations/nav-main.js';
import '../../components/dialogue.js';
import '../../components/planet/filter.js';
import '../../components/planet/note-contentview.js';
import '../../components/planet/note-create.js';

/* Import d3js function Planet */
import Planet from '../../d3/planet.js';

Template.Planet_page.onCreated(function () {
  /* Thought selection
  –––––––––––––––––––––––––––––––––––––––––––––––––– */
  /* State of vis is pushed into URL (thought query param)
   * Selected note id is set when:
   * -> thought query param changes (click event) or
   * -> on hover event
   * It is used for templates Note_contentView and Note_remove
  */
  this.noteId = new ReactiveVar();
  /* When URL contains a valid note id means that a node is selected */
  /* Therefore all hover events on other nodes are ignored */
  this.urlContainsNoteId = new ReactiveVar();

  /* Filter selection
  –––––––––––––––––––––––––––––––––––––––––––––––––– */
  /* State of vis is pushed into URL (tags and people query params)
   * filterCategory is set on
   * -> explicitly on click event
   * -> implicitly on page load with specified query param people or tags
  */
  this.filterCategory = new ReactiveVar('tags');
  /* selectedFilter is set on */
  /* -> query param changes (click event) */
  this.selectedFilter = new ReactiveVar();

  /* helper function to generate one dimensional distinct array */
  this.distinct = (array, field) => {
    const arr = _.flatten(_.pluck(array, field));
    return _.uniq(arr, false);
  };

  /* Forms
  –––––––––––––––––––––––––––––––––––––––––––––––––– */
  /* dialogues (remove note, share project) */
  this.activeDialogue = new ReactiveVar(false);
  /* create note form */
  this.showCreateNote = new ReactiveVar(false);

  /* Subscription
  –––––––––––––––––––––––––––––––––––––––––––––––––– */
  /* Subscribe to notes.inProject publication based on FlowRouter params */
  /* username and projectSlut (unique combination) */
  const author = FlowRouter.getParam('username');
  const slug = FlowRouter.getParam('projectSlug');
  /* this.subscribe instead of Meteor.subscribe -> enables {{Template.subscriptionsReady}} */
  this.subscribe('notes.inProject', { author, slug }, () => {
    /* When project does not exists or is private */
    if (Projects.find().count() === 0) {
      FlowRouter.go('/notfound');
    }

    /* D3 force simulation
    –––––––––––––––––––––––––––––––––––––––––––––––––– */
    const planet = new Planet('.visualization');

    /* Listen reactively for changes in Collection */
    /* Establish a live query that invokes callbacks when the result of the query changes */
    Notes.find().observe({
      added(newDocument) {
        planet.addNode(newDocument);
      },
      removed(oldDocument) {
        planet.removeNode(oldDocument._id);
        FlowRouter.setQueryParams({ thought: null });
      },
    });

    /* Thought selection Listener
    –––––––––––––––––––––––––––––––––––––––––––––––––– */
    /* Listen for changes in query param 'thought' -> update vis */
    this.autorun(() => {
      const noteId = FlowRouter.getQueryParam('thought');
      /* if note id is undefined query param 'thought' is undefined */
      if (noteId) {
        const note = Notes.findOne(noteId);
        /* if note does not exists (wrong url) */
        if (!note) {
          return;
        }
        planet.selectNode(note._id);
        this.noteId.set(note._id);
        this.urlContainsNoteId.set(true);
      } else {
        planet.clearSelection();
        this.noteId.set('');
        this.urlContainsNoteId.set(false);
      }
    });

    /* Filter selection Listener
    –––––––––––––––––––––––––––––––––––––––––––––––––– */
    /* Listen for changes in query param 'tags' and 'people' -> update vis */
    this.autorun(() => {
      const selectedTag = FlowRouter.getQueryParam('tags');
      const selectedAuthor = FlowRouter.getQueryParam('people');
      if (!selectedTag && !selectedAuthor && !this.urlContainsNoteId.get()) {
        this.selectedFilter.set(null);
        planet.clearSelection();
        return;
      }
      const notes = Notes.find().fetch();
      let ids = [];
      if (selectedTag) {
        /* return array of ids which include tag from url */
        ids = _.pluck(notes.filter(note => note.tags.includes(selectedTag)), '_id');
        this.filterCategory.set('tags');
        this.selectedFilter.set(selectedTag);
      }
      if (selectedAuthor) {
        ids = _.pluck(notes.filter(note => note.author === selectedAuthor), '_id');
        this.filterCategory.set('people');
        this.selectedFilter.set(selectedAuthor);
      }
      planet.selectNodes(ids);
    });
  });
});

/* Helpers
–––––––––––––––––––––––––––––––––––––––––––––––––– */

Template.Planet_page.helpers({
  contentViewArgs() {
    /* noteId is dynamically set by hover and click event through route listener */
    const noteId = Template.instance().noteId.get();
    const note = Notes.findOne(noteId);
    const userId = Meteor.userId();
    const project = Projects.findOne();
    return {
      note,
      /* if project belongs to user or he is owner of note he is allowed to remove note */
      userAllowedToRemoveNote: () => {
        if (project.belongsTo(userId) || note.belongsTo(userId)) {
          return true;
        }
        return false;
      },
    };
  },

  /* on change of reactive param filterCategory filterArgs is triggered */
  filterArgs() {
    const ti = Template.instance();
    const project = Projects.findOne();
    const notes = Notes.find().fetch(); // fetch returns array
    const elements = () => {
      if (ti.filterCategory.get() === 'tags') {
        /* generate one dimensional distinct array */
        return ti.distinct(notes, 'tags');
      }
      return ti.distinct(notes, 'author');
    };

    return {
      elements,
      selectedElement: ti.selectedFilter,
      filterCategory: ti.filterCategory,
      userOwnsProject: project.belongsTo(Meteor.userId()),
    };
  },

  dialogueArgs() {
    const instance = Template.instance();
    const noteId = instance.noteId.get();
    const project = Projects.findOne();
    return {
      /* name of dialogue or false */
      activeDialogue: instance.activeDialogue.get(),
      /* noteId for Note_remove */
      noteId,
      /* project document for Project_share */
      project,
    };
  },
  showCreateNote() {
    return Template.instance().showCreateNote.get();
  },
  getProjectId() {
    return { projectId: Projects.findOne()._id };
  },

  /* Header of visualization */
  getProjectName() {
    return Projects.findOne().name;
  },
});

/* Events
–––––––––––––––––––––––––––––––––––––––––––––––––– */
Template.Planet_page.events({

  /* D3 force simulation interactions
  –––––––––––––––––––––––––––––––––––––––––––––––––– */
  'click .node'(event, templateInstance) {
    /* Note_create form is open -> close it */
    templateInstance.showCreateNote.set(false);
    /* Save state of visualization -> push noteId into the url as query parameter */
    const noteId = event.currentTarget.__data__._id;
    /* Clear selected filter from url */
    FlowRouter.setQueryParams({ tags: null, people: null });
    FlowRouter.setQueryParams({ thought: noteId });
  },
  'click .planet'() {
    /* Clean UI state in URL -> update contentView */
    FlowRouter.setQueryParams({ thought: null });
    FlowRouter.setQueryParams({ tags: null });
    FlowRouter.setQueryParams({ people: null });
  },
  'mouseover .node'(event, templateInstance) {
    /* visual hover state is defined in css */
    /* if url contains state of vis or insert thought form is open do not update contentView */
    if (!templateInstance.urlContainsNoteId.get() && !templateInstance.showCreateNote.get()) {
      const noteId = event.currentTarget.__data__._id;
      templateInstance.noteId.set(noteId);
    }
  },
  'mouseout .node'(event, templateInstance) {
    if (!templateInstance.urlContainsNoteId.get()) {
      templateInstance.noteId.set('');
    }
  },

  /* Filter component interactions
  –––––––––––––––––––––––––––––––––––––––––––––––––– */
  'click .horizontal-nav__link'(event, templateInstance) {
    const selectedCategory = templateInstance.$(event.target).data('filter-category');
    /* higlight selected filter menu */
    templateInstance.filterCategory.set(selectedCategory);
  },
  'click .tag-list__tag'(event, templateInstance) {
    /* Save state of visualization:
     * -> push selected filter element into url as named query parameter (tags, people)
     * -> update vis on path change
    */
    const filterCategory = templateInstance.filterCategory.get();
    const selectedFilter = templateInstance.$(event.target).text();
    /* if element is already selected -> clear selection */
    if (selectedFilter === templateInstance.selectedFilter.get()) {
      FlowRouter.setQueryParams({ thought: null, tags: null, people: null });
      return;
    }
    FlowRouter.setQueryParams({ thought: null, tags: null, people: null });
    FlowRouter.setQueryParams({ [filterCategory]: selectedFilter });
  },

  /* Dialogue (remove note, share project) interactions
  –––––––––––––––––––––––––––––––––––––––––––––––––– */
  'click .js-dialogue'(event, templateInstance) {
    const dialogueTemplate = templateInstance.$(event.target).data('dialogue-template');
    templateInstance.activeDialogue.set(dialogueTemplate);
  },
  /* on cancel and on submit */
  'click .js-dialogue-cancel, submit .js-dialogue-form'(event, templateInstance) {
    event.preventDefault();
    /* Hide form */
    templateInstance.activeDialogue.set(false);
  },

  /* Note_create form interactions
  –––––––––––––––––––––––––––––––––––––––––––––––––– */
  'click .js-note-create'(event, templateInstance) {
    /* Clean UI state in URL -> update contentView */
    FlowRouter.setQueryParams({ thought: null });
    templateInstance.showCreateNote.set(true);
  },
  'click .js-note-create-cancel, submit .js-note-create-form'(event, templateInstance) {
    event.preventDefault();
    /* Hide form */
    templateInstance.showCreateNote.set(false);
  },
});
