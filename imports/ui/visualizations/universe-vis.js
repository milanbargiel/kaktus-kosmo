import { Template } from 'meteor/templating';
import Projects from '../../api/projects/projects.js'; // Projects Collection

/* Import templates */
import './universe-vis.html';

/* Import d3js function Universe */
import Universe from './d3/universe.js';

Template.Universe_vis.onRendered(function () {
  /* Subscribe -> Callback */
  this.subscribe('projects', () => {
    const projects = Projects.find({}).fetch();
    const universe = new Universe('.visualization');
    universe.initialize(projects);

    /* Listen reactively for changes in Collection */
    /* Establish a live query that invokes callbacks when the result of the query changes */
    Projects.find().observe({
      added(newDocument) {
        universe.addNode(newDocument);
      },
      removed(oldDocument) {
        universe.removeNode(oldDocument._id);
      },
    });
  });
});
