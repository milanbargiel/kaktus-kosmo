// moment js is globally declared so does not have to be imported
// import template
import './post-content.html';

Template.Post_content.helpers({
  date(date) {
    return moment(date).format('L');
  },
});
