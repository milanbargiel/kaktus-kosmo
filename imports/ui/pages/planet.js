import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { ReactiveVar } from 'meteor/reactive-var';
// import { ReactiveDict } from 'meteor/reactive-dict';
import Projects from '../../api/projects/projects.js'; // Posts Collection
import Posts from '../../api/posts/posts.js'; // Posts Collection

// Import templates
import './planet.html';
import '../components/post-content.js';
import '../components/post-forms.js';

// Import d3js function Planet
import Planet from '../visualizations/d3/planet.js';

Template.Planet_page.onCreated(function () {
  // Store temporary UI states in Session (globally)
  Session.set({
    showContent: false,
    showCreatePost: false,
    showRemovePost: false,
  });

  // Store currently referenced post object in reactive var
  this.postObject = new ReactiveVar(null);

  // Subscribe to posts.inProject publication based on projectId FlowRouter param
  // this.subscribe instead of Meteor.subscribe -> enables {{Template.subscriptionsReady}}
  const projectId = FlowRouter.getParam('projectId');
  this.subscribe('posts.inProject', projectId, () => {
    // When project does not exists or is private
    if (Projects.find().count() === 0) {
      FlowRouter.go('/notfound');
    }

    Tracker.autorun(() => {
      FlowRouter.watchPathChange();
      const post = Posts.findOne(FlowRouter.getQueryParam('thought'));
      // if post does not exitss
      if (!post) {
        Session.set('showContent', false);
        return;
      }
      this.postObject.set(post);
      Session.set('showContent', true);
    });
  });

  // Checks wether node was selected (indicator: id in queryparams of url)
  this.nodeIsSelected = () => {
    const postId = FlowRouter.getQueryParam('thought');
    if (postId) {
      return postId;
    }
    return false;
  };
});

Template.Planet_page.helpers({
  initVis() {
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

    // const postId = Template.instance().nodeIsSelected();
    // if (postId) {
    //   planet.selectNode(postId);
    // }
  },
  getProjectName() {
    const project = Projects.findOne();
    return project.name;
  },
  getProjectId() {
    const project = Projects.findOne();
    return project._id;
  },
  getPostObject() {
    return Template.instance().postObject.get();
  },

  showContent() {
    return Session.get('showContent');
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
    // Save state of visualization -> push postId into the url as query parameter
    const postId = event.currentTarget.__data__._id;
    FlowRouter.setQueryParams({ thought: postId });
  },
  'click .planet'() {
    // Clear query parameters
    FlowRouter.setQueryParams({ thought: null });
  },
  'mouseover .node'(event, templateInstance) {
    if (!templateInstance.nodeIsSelected()) {
      const postId = event.currentTarget.__data__._id;
      const post = Posts.findOne(postId);
      templateInstance.postObject.set(post);
      Session.set('showContent', true);
    }
  },
  'mouseout .node'(event, templateInstance) {
    if (!templateInstance.nodeIsSelected()) {
      Session.set('showContent', false);
    }
  },

  // Interactions with post-forms
  'click .js-createPost'() {
    Session.set('showCreatePost', true);
  },
  'click .js-createPost-cancel'() {
    Session.set('showCreatePost', false);
  },
  'click .js-removePost'() {
    Session.set('showRemovePost', true);
  },
  'click .js-removePost-cancel'() {
    Session.set('showRemovePost', false);
  },
});
