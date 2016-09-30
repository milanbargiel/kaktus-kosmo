import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

// import template
import './project-rename.html';

Template.Project_rename.onRendered(() => {
  $('.js-project-rename-form').validate({
    rules: {
      name: {
        required: true,
        maxlength: 32,
      },
    },
  });
});

Template.Project_rename.events({
  'submit .js-project-rename-form'(event, templateInstance) {
    event.preventDefault();
    const newName = templateInstance.find('input[name="name"]').value;
    templateInstance.find('input[name="name"]').value = '';
    // projectId is passed to this templateInstance from parent template Universe_page
    Meteor.call('projects.rename', { projectId: templateInstance.data.project._id, newName });
  },
});
