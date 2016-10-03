/* Filter component
–––––––––––––––––––––––––––––––––––––––––––––––––– */
/* List tags and people */

import { Template } from 'meteor/templating';

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
  /* If there are no contributors only one author of posts is listed (owner of project) */
  noContributors() {
    return !(this.elements().length > 1);
  },
});
