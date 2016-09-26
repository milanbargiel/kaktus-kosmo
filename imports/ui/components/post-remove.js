import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

// import template
import './post-remove.html';

Template.Post_remove.events({
  'submit .js-post-remove-form'(event, templateInstance) {
    event.preventDefault();
    Meteor.call('posts.remove', { postId: templateInstance.data.post._id });
    Session.set('activeDialogue', false);
  },
});
