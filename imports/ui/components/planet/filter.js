import { Template } from 'meteor/templating';
// import template
import './filter.html';

Template.filter.helpers({
  categoryIs(category) {
    return this.filterCategory.get() === category;
  },
  elementIsSelected(elementName) {
    const selectedElement = Template.instance().data.selectedElement.get();
    if (elementName === selectedElement) {
      return 'tag-list__tag--active';
    }
    return '';
  },
  noContributors() {
    return !(this.elements().length > 1);
  },
});
