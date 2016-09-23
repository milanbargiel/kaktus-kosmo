import { Template } from 'meteor/templating';
import Projects from '../../api/projects/projects.js'; // Projects Collection

// Import templates
import './universe-vis.html';

// Import d3js function Universe
import Universe from './d3/universe.js';

Template.Universe_vis.onRendered(function () {
  // Subscribe -> Callback
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
