import { Template } from 'meteor/templating';
import Posts from '../api/posts/posts.js'; // Posts Collection
import Planet from './d3/planet.js'; // Planet function

import './body.html';

Template.body.onRendered(function () {
  /* Subscribe to posts -> callback when ready */
  this.subscribe('posts', () => {
    /* Return all documents from Cursor */
    const posts = Posts.find({}).fetch();

    const planet = new Planet('.visualization--planet');
    planet.initialize(posts);

    /* Listen for changes in Collection */
    /* Establish a live query that invokes callbacks when the result of the query changes */
    Posts.find().observe({
      added(newDocument) {
        planet.addNode(newDocument);
      },
      removed(oldDocument) {
        planet.removeNode(oldDocument._id);
      },
    });
  });
});
