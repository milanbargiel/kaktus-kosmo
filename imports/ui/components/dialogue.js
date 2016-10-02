import { Template } from 'meteor/templating';

// import templates
import './dialogue.html';
import './project-create.js';
import './project-share.js';
import './project-rename.js';
import './project-remove.js';
import './post-remove.js';

Template.dialogue.helpers({
  activeDialogue() {
    return Template.instance().data.activeDialogue;
  },
});
