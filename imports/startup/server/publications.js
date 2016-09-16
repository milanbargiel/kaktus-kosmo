/* Publications
–––––––––––––––––––––––––––––––––––––––––––––––––– */

/* Code runs only on server */
import { Meteor } from 'meteor/meteor';
import Posts from '../../api/posts/posts.js'; // Import Posts Collection

/* Publish Collection to client */
Meteor.publish('posts', () => Posts.find({}));
