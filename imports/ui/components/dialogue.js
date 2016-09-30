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

Template.dialogue.events({
  'submit form'() {
    // Close dialogue on successfull submit
    Session.set('activeDialogue', false);
  },
  'click .js-dialogue-cancel'(event) {
    event.preventDefault();
    // Hide form
    Session.set('activeDialogue', false);
  },
});
