import { Template } from 'meteor/templating';
import Projects from '../../api/projects/projects.js'; // Projects Collection
import Posts from '../../api/posts/posts.js'; // Posts Collection

/* Import template */
import './universe.html';

/* Subscribe to Planets and Posts Collections */
Template.Universe.onCreated(function () {
  this.subscribe('projects');
  this.subscribe('posts');
});
