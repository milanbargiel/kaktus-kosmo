/* Publications
–––––––––––––––––––––––––––––––––––––––––––––––––– */

/* Code runs only on server */
import { Meteor } from 'meteor/meteor';
import Projects from '../../api/projects/projects.js'; // Projects Collection
import Posts from '../../api/posts/posts.js'; // Posts Collection

/* Publish Collections to client */
Meteor.publish('projects', () => Projects.find({}));
Meteor.publish('posts', () => Posts.find({}));
