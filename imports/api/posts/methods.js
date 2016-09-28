/* Posts Collection - Methods
–––––––––––––––––––––––––––––––––––––––––––––––––– */
import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

import Posts from './posts.js'; // Import posts collection
import Projects from '../projects/projects.js'; // Import projects collection

export const insert = new ValidatedMethod({
  // ValidatedMethod will use name to register method with Meteor
  name: 'posts.insert',
  // pick(): Pull out schema key 'text' and build a new schema out of it
  validate: Posts.simpleSchema().pick(['projectId', 'text']).validator(),
  run({ projectId, text }) {
    const project = Projects.findOne(projectId);
    const user = Meteor.user();

    if (!project) {
      // end execution of insert. Meteor.Error could be displayed on client
      throw new Meteor.Error('posts.insert.accessDenied',
        'A post must belong to a project');
    }
    if (!user) {
      throw new Meteor.Error('posts.insert.notLoggedIn',
        'Must be logged in to insert a post');
    }

    // Extract hashtags from text
    // Reference: http://geekcoder.org/js-extract-hashtags-from-text/
    const regex = /(?:^|\s)(#[a-zA-Z\d]+)/gm;
    const matches = [];
    let match;

    while ((match = regex.exec(text))) {
      matches.push(match[1]);
    }

    const post = {
      projectId,
      author: user.username,
      text,
      tags: matches,
      createdAt: new Date(),
    };

    Posts.insert(post);
  },
});

export const remove = new ValidatedMethod({
  name: 'posts.remove',
  validate: new SimpleSchema({
    postId: Posts.simpleSchema().schema('_id'),
  }).validator(),
  run({ postId }) {
    const post = Posts.findOne(postId);
    const project = Projects.findOne(post.projectId);
    const user = Meteor.user();

    // if user is not owner of project or author of post
    // -> dont allow to remove this post
    if (user._id !== project.userId && user.username !== post.author) {
      throw new Meteor.Error('posts.remove.accessDenied',
        'Must be owner of project or author of post to delete it');
    }

    Posts.remove(postId);
  },
});
