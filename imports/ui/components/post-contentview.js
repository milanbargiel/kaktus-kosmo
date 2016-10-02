import { FlowRouter } from 'meteor/kadira:flow-router';
// import template
import './post-contentview.html';

Template.Post_contentView.onRendered(function () {
  // Surround hashtags with span elements
  const $dom = this.$('.thought__text');
  $dom.html($dom.text().replace(/(?:^|\s)(?:#)([a-zA-Z\d]+)/gm, '<span class="thought__tag">$&</span>'));
});

Template.Post_contentView.helpers({
  date(date) {
    // moment js is globally declared so does not have to be imported
    return moment(date).format('L');
  },
});

Template.Post_contentView.events({
  'click .thought__tag'(event, templateInstance) {
    // trim value with underscorestring library (globally defined)
    const tag = s.clean(templateInstance.$(event.target).text());
    FlowRouter.setQueryParams({ tags: tag });
  },
});
