/* Fixtures
–––––––––––––––––––––––––––––––––––––––––––––––––– */

import { Meteor } from 'meteor/meteor';
import Posts from '../../api/posts/posts.js'; // Import Posts Collection

/* Code inside of Meteor.startup runs after all app files have loaded */
Meteor.startup(() => {
  if (Posts.find().count() === 0) {
    Posts.insert({
      text: 'Es war einmal ein großer Bauer',
    });
  }
});
