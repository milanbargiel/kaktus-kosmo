/* Publications
–––––––––––––––––––––––––––––––––––––––––––––––––– */

/* Code runs only on server */
import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import Projects from '../../api/projects/projects.js'; // Projects Collection
import Posts from '../../api/posts/posts.js'; // Posts Collection

/* Publish Collections to client */
Meteor.publish('projects', () => Projects.find({}));

/* Publish posts containing projectId */
Meteor.publishComposite('posts.inProject', (projectId) => {
  /* Check if projectId is of type String */
  new SimpleSchema({
    projectId: { type: String },
  }).validate({ projectId });

  return {
    find() {
      /* return cursor of top level document */
      return Projects.find({ _id: projectId });
    },

    children: [
      {
        /* return a cursor of second tier documents */
        find(project) {
          return Posts.find({ projectId: project._id });
        },
      },
    ],
  };
});
