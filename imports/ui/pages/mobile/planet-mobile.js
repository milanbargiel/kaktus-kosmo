import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

// import template
import './planet-mobile.html';
import '../../components/planet/post-create.js';

// Import Projects Collection
import Projects from '../../../api/projects/projects.js';

Template.Planet_mobile_page.onCreated(function () {
  const author = FlowRouter.getParam('username');
  const slug = FlowRouter.getParam('projectSlug');
  this.subscribe('projects.current', { author, slug }, () => {
    // When project does not exists or is private
    if (Projects.find().count() === 0) {
      FlowRouter.go('/notfound');
    }
  });
});

Template.Planet_mobile_page.helpers({
  'projectName'() {
    return Projects.findOne().name;
  },
  'projectId'() {
    return Projects.findOne()._id;
  },
});

Template.Planet_mobile_page.events({
  'submit .js-post-create-form'(event, templateInstance) {
    // When a project was submitted sucessfully
    templateInstance.$('.success').css('display', 'block');
    templateInstance.$('.success').fadeOut(1000, () => {
      FlowRouter.go('/');
    });
  },
});
