import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

// import template
import './post-forms.html';

/* createPost template
–––––––––––––––––––––––––––––––––––––––––––––––––– */
Template.createPost.onRendered(function () {
  const templateInstance = this;
  // client side validation with jquery validation
  $('.js-createPost-form').validate({
    rules: {
      text: {
        required: true,
        maxlength: 512,
      },
    },
    submitHandler() {
      // Retrieve value
      const text = templateInstance.find('textarea[name="text"]').value;
      // Clear input field
      templateInstance.find('textarea[name="text"]').value = '';
      // Insert document into collection
      Meteor.call('posts.insert', { projectId: templateInstance.data.projectId, text });
      // Hide form
      Session.set('showCreatePost', false);
    },
  });
});

/* removePost template
–––––––––––––––––––––––––––––––––––––––––––––––––– */
Template.removePost.events({
  'submit .js-removePost-form'(event, templateInstance) {
    event.preventDefault();
    Meteor.call('posts.remove', { postId: templateInstance.data.data._id });
    Session.set('showRemovePost', false);
    Session.set('showContent', false);
  },
});
