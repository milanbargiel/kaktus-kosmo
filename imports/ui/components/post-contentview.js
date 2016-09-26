// moment js is globally declared so does not have to be imported
// import template
import './post-contentview.html';

Template.Post_contentView.helpers({
  date(date) {
    return moment(date).format('L');
  },
});
