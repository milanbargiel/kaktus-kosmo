import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import Projects from '../../api/projects/projects.js'; // Posts Collection
import Posts from '../../api/posts/posts.js'; // Posts Collection

// Import template
import './planet.html';

// Import d3js function Planet
import Planet from '../visualizations/d3/planet.js';

Template.Planet_page.onCreated(function () {
  const projectId = FlowRouter.getParam('projectId');

  // Subscribe to posts.inProject publication based on projectId FlowRouter param
  // this.subscribe instead of Meteor.subscribe -> enables {{Template.subscriptionsReady}}
  this.subscribe('posts.inProject', projectId, () => {
    // When project does not exists or is private
    if (Projects.find().count() === 0) {
      FlowRouter.go('/notfound');
    }
  });

  // Checks wether node was selected (indicator: id in queryparams of url)
  this.nodeIsSelected = (postId) => {
    if (FlowRouter.getQueryParam('thought') === postId) {
      return true;
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
      },
    });
  },
  getProjectName() {
    const project = Projects.findOne();
    return project.name;
  },
});

// Interactions with d3 force simulation
Template.Planet_page.events({
  'click .node'(event) {
    // Unselect all nodes visually
    $('.node').attr('class', 'node');
    // Visually select clicked one
    $(event.currentTarget).attr('class', 'node node--selected');
    // Save state of visualization -> push postId into the url as query parameter
    const postId = event.currentTarget.__data__._id;
    FlowRouter.setQueryParams({ thought: postId });
  },
  'click .planet'() {
    $('.node').attr('class', 'node');
    // Clear query parameters
    FlowRouter.setQueryParams({ thought: null });
  },
  'mouseover .node'(event, templateInstance) {
    // When a node is selected a hover does not change its class
    const postId = event.currentTarget.__data__._id;
    if (!templateInstance.nodeIsSelected(postId)) {
      $(event.currentTarget).attr('class', 'node node--hover');
    }
  },
  'mouseout .node'(event, templateInstance) {
    // When a node is selected a hover does not change its class
    const postId = event.currentTarget.__data__._id;
    if (!templateInstance.nodeIsSelected(postId)) {
      $(event.currentTarget).attr('class', 'node');
    }
  },
});
