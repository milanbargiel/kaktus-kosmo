import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { ReactiveVar } from 'meteor/reactive-var';
// import { ReactiveDict } from 'meteor/reactive-dict';
import Projects from '../../api/projects/projects.js'; // Posts Collection
import Posts from '../../api/posts/posts.js'; // Posts Collection

// Import templates
import './planet.html';
import '../components/nav-main.js';
import '../components/dialogue.js';
import '../components/filter.js';
import '../components/post-contentview.js';
import '../components/post-create.js';

// Import d3js function Planet
import Planet from '../d3/planet.js';

Template.Planet_page.onCreated(function () {
  // Store temporary UI states in of forms in Session (globally).
  // A global var is used because the submit handler in the form template
  // needs to have access to it in order to hide submitted form.
  Session.set({
    showCreatePost: false,
    activeDialogue: false,
  });

  // Filter
  // Selected filter option (tags or people)
  this.filterCategory = new ReactiveVar('tags');
  this.selectedFilterElement = new ReactiveVar(null);

  // helper function to generate one dimensional distinct array
  this.distinct = (array, field) => {
    const arr = _.flatten(_.pluck(array, field));
    return _.uniq(arr, false);
  };

  // Interaction with d3 force simulation
  // Selected post id is set when:
  // -> thought query param changes (click event) or
  // -> on hover event
  // It is used for templates Post_contentView and Post_remove
  this.postId = new ReactiveVar();
  // State of vis is pushed into URL
  // When URL contains a valid post id means that a node is selected
  // Therefore all hover events on other nodes are ignored
  this.urlContainsPostId = new ReactiveVar();

  this.projectId = FlowRouter.getParam('projectId');
  // Subscribe to posts.inProject publication based on projectId FlowRouter param
  // this.subscribe instead of Meteor.subscribe -> enables {{Template.subscriptionsReady}}
  this.subscribe('posts.inProject', this.projectId, () => {
    // When project does not exists or is private
    if (Projects.find().count() === 0) {
      FlowRouter.go('/notfound');
    }
    this.fish = 'fisch';
    const planet = new Planet('.visualization');

    // Listen reactively for changes in Collection
    // Establish a live query that invokes callbacks when the result of the query changes
    Posts.find().observe({
      added(newDocument) {
        planet.addNode(newDocument);
      },
      removed(oldDocument) {
        planet.removeNode(oldDocument._id);
        FlowRouter.setQueryParams({ thought: null });
      },
    });

    // Listen for changes in query param 'thought', tags' and 'people' -> update vis
    this.autorun(() => {
      FlowRouter.watchPathChange();
      const currentParams = FlowRouter.current().queryParams;
      // if UI state is pushed into URL currentParams object is not empty
      if (Object.keys(currentParams).length !== 0 && currentParams.constructor === Object) {
        // if currentParams has property thought
        if ({}.hasOwnProperty.call(currentParams, 'thought')) {
          const post = Posts.findOne(currentParams.thought);
          // if post does not exists (wrong url)
          if (!post) {
            return;
          }
          planet.selectNode(post._id);
          this.postId.set(post._id);
          this.urlContainsPostId.set(true);
        } else {
          planet.clearSelection();
          this.postId.set('');
          this.urlContainsPostId.set(false);
        }
        if ({}.hasOwnProperty.call(currentParams, 'tags')) {
          const posts = Posts.find().fetch();
          // return array of ids which include tag from url
          const ids = _.pluck(posts.filter(post => post.tags.includes(currentParams.tags)), '_id');
          planet.selectNodes(ids);
          this.filterCategory.set('tags');
          this.selectedFilterElement.set(currentParams.tags);
        }
        if ({}.hasOwnProperty.call(currentParams, 'people')) {
          const posts = Posts.find().fetch();
          const ids = _.pluck(posts.filter(post => post.author === currentParams.people), '_id');
          planet.selectNodes(ids);
          this.filterCategory.set('people');
          this.selectedFilterElement.set(currentParams.people);
        }
      }
      console.log(this.fish);
    });
  });
});

Template.Planet_page.helpers({
  postArgs() {
    // pass document to Post_remove and Post_contentView
    const postId = Template.instance().postId.get();
    const post = Posts.findOne(postId);
    return post;
  },
  // projectArgs are static because Template.instance().projectId is static
  projectArgs() {
    // pass fields of document to vis header and Post_create
    const projectId = Template.instance().projectId;
    const project = Projects.findOne(projectId);
    return project;
  },
  filterArgs() {
    const ti = Template.instance();
    const posts = Posts.find().fetch(); // fetch returns array
    if (ti.filterCategory.get() === 'tags') {
      return {
        // generate one dimensional distinct array
        elements: ti.distinct(posts, 'tags'),
        selectedElement: ti.selectedFilterElement,
        filterCategory: ti.filterCategory,
      };
    }
    return {
      elements: ti.distinct(posts, 'author'),
      selectedElement: ti.selectedFilterElement,
      filterCategory: ti.filterCategory,
    };
  },
  showCreatePost() {
    return Session.get('showCreatePost');
  },
});

Template.Planet_page.events({
  // Interactions with d3 force simulation
  'click .node'(event) {
    // Post_create form is open -> close it
    Session.set('showCreatePost', false);
    // Save state of visualization -> push postId into the url as query parameter
    const postId = event.currentTarget.__data__._id;
    FlowRouter.setQueryParams({ tags: null, people: null });
    FlowRouter.setQueryParams({ thought: postId });
  },
  'click .planet'() {
    // Clean UI state in URL -> update contentView
    FlowRouter.setQueryParams({ thought: null });
    FlowRouter.setQueryParams({ tags: null });
    FlowRouter.setQueryParams({ people: null });
  },
  'mouseover .node'(event, templateInstance) {
    // visual hover state is defined in css
    // if url contains state of vis do not update contentView
    if (!templateInstance.urlContainsPostId.get()) {
      const postId = event.currentTarget.__data__._id;
      templateInstance.postId.set(postId);
    }
  },
  'mouseout .node'(event, templateInstance) {
    if (!templateInstance.urlContainsPostId.get()) {
      templateInstance.postId.set('');
    }
  },

  // Interactions with Forms
  'click .js-post-create'() {
    // Clean UI state in URL -> update contentView
    FlowRouter.setQueryParams({ thought: null });
    Session.set('showCreatePost', true);
  },
  'click .js-post-create-cancel'() {
    Session.set('showCreatePost', false);
  },
  // Remove post
  'click .js-dialogue'(event, templateInstance) {
    const dialogueTemplate = templateInstance.$(event.target).data('dialogue-template');
    Session.set('activeDialogue', dialogueTemplate);
  },
  'click .js-dialogue-cancel'() {
    // Hide form
    Session.set('activeDialogue', false);
  },

  // Interactions with Filter
  'click .horizontal-nav__link'(event, templateInstance) {
    // Set selected filter to current filter -> update filter data
    const selectedFilter = templateInstance.$(event.target).data('current-filter');
    templateInstance.filterCategory.set(selectedFilter);
  },
  'click .tag-list__tag'(event, templateInstance) {
    // Save state of visualization:
    // -> push filter name into the url as named query parameter (tags, people)
    const filterCategory = templateInstance.filterCategory.get();
    const filterName = templateInstance.$(event.target).text();
    FlowRouter.setQueryParams({ thought: null, tags: null, people: null });
    FlowRouter.setQueryParams({ [filterCategory]: filterName }); // ES6 computedPropertyName feature
  },
});
