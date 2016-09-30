import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

// import template
import './post-create.html';

Template.Post_create.onRendered(() => {
  // client side validation with jquery validation
  $('.js-post-create-form').validate({
    rules: {
      text: {
        required: true,
        maxlength: 512,
      },
    },
  });
});

Template.Post_create.events({
  'submit .js-post-create-form'(event, templateInstance) {
    // Retrieve value
    const text = templateInstance.find('textarea[name="text"]').value;
    // Clear input field
    templateInstance.find('textarea[name="text"]').value = '';
    // Insert document into collection
    Meteor.call('posts.insert', { projectId: templateInstance.data.projectId, text });
  },
});
