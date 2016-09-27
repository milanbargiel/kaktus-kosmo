import { Template } from 'meteor/templating';
// import template
import './filter.html';

Template.filter.onRendered(function () {
  this.autorun(() => {
    // Reactive data source indicating which filter (tags, people) has been selected
    const filterCategory = this.data.filterCategory.get();
    $('.horizontal-nav__link').removeClass('horizontal-nav__link--active');
    $(`.horizontal-nav__link[data-current-filter="${filterCategory}"]`).addClass('horizontal-nav__link--active');
  });
});

Template.filter.helpers({
  elementIsActive(elementName) {
    const selectedElement = Template.instance().data.selectedElement.get();
    if (elementName === selectedElement) {
      return 'tag-list__tag--active';
    }
    return '';
  },
});
