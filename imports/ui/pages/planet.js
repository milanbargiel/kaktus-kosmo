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
  // Store temporary UI states in Session (globally)
  Session.set({
    showCreatePost: false,
    showRemovePost: false,
  });

  // Selected post id
  this.postId = new ReactiveVar();
  // Indicates wether state of ui is pushed into url
  this.urlContainsState = new ReactiveVar();

  this.projectId = FlowRouter.getParam('projectId');
  // Subscribe to posts.inProject publication based on projectId FlowRouter param
  // this.subscribe instead of Meteor.subscribe -> enables {{Template.subscriptionsReady}}
  this.subscribe('posts.inProject', this.projectId, () => {
    // When project does not exists or is private
    if (Projects.find().count() === 0) {
      FlowRouter.go('/notfound');
    }

    // Listen for changes in query param 'thought' -> update Post_contentView
    this.autorun(() => {
      FlowRouter.watchPathChange();
      const post = Posts.findOne(FlowRouter.getQueryParam('thought'));
      // if post does not exists
      if (!post) {
        this.postId.set('');
        this.urlContainsState.set(false);
        return;
      }
      this.postId.set(post._id);
      this.urlContainsState.set(true);
    });
  });

  // helper function to generate one dimensional distinct array
  this.distinct = (array, field) => {
    const arr = _.flatten(_.pluck(array, field));
    return _.uniq(arr, false);
  };
});

Template.Planet_page.onRendered(function () {
  this.autorun(() => {
    if (this.subscriptionsReady()) {
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
    }
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
    const instance = Template.instance();
    const posts = Posts.find().fetch(); // fetch returns array
    return {
      // generate one dimensional distinct array
      authors: Template.instance().distinct(posts, 'author'),
      tags: Template.instance().distinct(posts, 'tags'),
    };
  },
  showCreatePost() {
    return Session.get('showCreatePost');
  },
  showRemovePost() {
    return Session.get('showRemovePost');
  },
});

Template.Planet_page.events({
  // Interactions with d3 force simulation
  'click .node'(event) {
    // Post_create form is open -> close it
    Session.set('showCreatePost', false);
    // Save state of visualization -> push postId into the url as query parameter
    const postId = event.currentTarget.__data__._id;
    FlowRouter.setQueryParams({ thought: postId });
  },
  'click .planet'() {
    // Clean UI state in URL -> update contentView
    FlowRouter.setQueryParams({ thought: null });
  },
  'mouseover .node'(event, templateInstance) {
    // if url contains state of vis ignore hover events
    if (!templateInstance.urlContainsState.get()) {
      const postId = event.currentTarget.__data__._id;
      templateInstance.postId.set(postId);
    }
  },
  'mouseout .node'(event, templateInstance) {
    if (!templateInstance.urlContainsState.get()) {
      templateInstance.postId.set('');
    }
  },

  // Interactions with post-forms
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
});
