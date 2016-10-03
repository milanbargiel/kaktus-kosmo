/* Template customization
–––––––––––––––––––––––––––––––––––––––––––––––––– */
/* Customization of useraccounts package templates */

import { Template } from 'meteor/templating';

import './accounts-templates.html';

/* Identify templates that need to be overridden by looking at the available templates */
/* here: https://github.com/meteor-useraccounts/unstyled/tree/master/lib */
Template['override-atPwdFormBtn'].replaces('atPwdFormBtn');
Template['override-atTextInput'].replaces('atTextInput');
Template['override-atError'].replaces('atError');
