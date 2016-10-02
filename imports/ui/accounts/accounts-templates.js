import { Template } from 'meteor/templating';

/* import templates */
import './accounts-templates.html';
import '../components/navigations/nav-auth.js';

// We identified the templates that need to be overridden by looking at the available templates
// here: https://github.com/meteor-useraccounts/unstyled/tree/master/lib
Template['override-atPwdFormBtn'].replaces('atPwdFormBtn');
Template['override-atTextInput'].replaces('atTextInput');
Template['override-atError'].replaces('atError');
