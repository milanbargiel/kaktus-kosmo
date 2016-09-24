import { Template } from 'meteor/templating';
import Posts from '../../api/posts/posts.js'; // Posts Collection

// Import templates
import './planet-vis.html';

// Import d3js function Planet
import Planet from './d3/planet.js';

Template.PLanet_vis.onRendered(function () {
  // Subscribe -> Callback
  this.subscribe('posts.inProject', () => {
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