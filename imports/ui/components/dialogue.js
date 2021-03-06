/* Dialogue component
–––––––––––––––––––––––––––––––––––––––––––––––––– */
/* Global overlay that renders modal forms */

import { Template } from 'meteor/templating';

/* import templates */
import './dialogue.html';
import './dialogues/project-create.js';
import './dialogues/project-share.js';
import './dialogues/project-rename.js';
import './dialogues/project-remove.js';
import './dialogues/note-remove.js';

Template.dialogue.helpers({
  activeDialogue() {
    return Template.instance().data.activeDialogue;
  },
});
