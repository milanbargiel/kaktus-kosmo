import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

// import template
import './filter.html';

Template.filter.onCreated(function () {
  this.state = new ReactiveVar('tags');
});

Template.filter.helpers({
  filterData() {
    if (Template.instance().state.get() === 'tags') {
      return Template.instance().data.tags;
    }
    return Template.instance().data.authors;
  },
});

Template.filter.events({
  'click .horizontal-nav__link'(event, templateInstance) {
    // Remove active class from elements
    $('.horizontal-nav__link').removeClass('horizontal-nav__link--active');
    // Set active class to clicked element
    templateInstance.$(event.target).addClass('horizontal-nav__link--active');
    // Set newState to reactiveDict -> filterData updates
    const newState = templateInstance.$(event.target).data('current-filter');
    templateInstance.state.set(newState);
  },
});
