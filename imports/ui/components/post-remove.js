import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

// import template
import './post-remove.html';

Template.Post_remove.events({
  'submit .js-post-remove-form'(event, templateInstance) {
    event.preventDefault();
    Meteor.call('posts.remove', { postId: templateInstance.data.postId });
  },
});
