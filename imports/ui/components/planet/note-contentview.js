/* Note_contentView component
–––––––––––––––––––––––––––––––––––––––––––––––––– */
/* Renders fields of selected d3 node (text, author, createdAt) */

import { FlowRouter } from 'meteor/kadira:flow-router';

import './note-contentview.html';

Template.Note_contentView.helpers({
  date(date) {
    /* format date with global moment package */
    return moment(date).format('L');
  },
});

Template.Note_contentView.events({
  /* Click on tag in content view to push vis state into URL (tag selected) */
  'click .thought__tag'(event, templateInstance) {
    /* trim value with underscorestring library (globally defined) */
    const tag = s.clean(templateInstance.$(event.target).text());
    FlowRouter.setQueryParams({ tags: tag });
  },
});
