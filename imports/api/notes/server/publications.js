/* Notes Publications
–––––––––––––––––––––––––––––––––––––––––––––––––– */
/* Publish Note Collection to client */
/* Code runs only on server */

import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

/* Import Projects and Notes collections */
import Projects from '../../projects/projects.js';
import Notes from '../notes.js';

/* Publish notes containing projectId */
Meteor.publishComposite('notes.inProject', function (object) {
  /* Check if parameters are of type String */
  new SimpleSchema({
    author: { type: String },
    slug: { type: String },
  }).validate(object);

  const proj = Projects.findOne(object);

  if (!proj) {
    /* Declare that no data is being published */
    return this.ready();
  }

  /* If current user is not owner of private project */
  if (!proj.belongsTo(this.userId) && proj.isPrivate()) {
    return this.ready();
  }

  /* Return two cursors - relational data */
  return {
    find() {
      /* return cursor of top level document */
      return Projects.find({ _id: proj._id });
    },

    children: [
      {
        /* return a cursor of second tier documents */
        find(project) {
          return Notes.find({ projectId: project._id });
        },
      },
    ],
  };
});
