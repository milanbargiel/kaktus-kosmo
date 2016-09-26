import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

// import templates
import './dialogue.html';
import './project-create.js';
import './project-share.js';
import './project-rename.js';
import './project-remove.js';
import './post-remove.js';

Template.dialogue.helpers({
  activeDialogue() {
    return Session.get('activeDialogue');
  },
});
