/* Configuration of useraccounts package
–––––––––––––––––––––––––––––––––––––––––––––––––– */
/* Configured for both client and server to work properly */

import { AccountsTemplates } from 'meteor/useraccounts:core';

AccountsTemplates.configure({
  defaultTemplate: 'Auth_page',
  defaultLayout: 'App_body',
  defaultContentRegion: 'main',
  defaultLayoutRegions: {
    navigation: 'Nav_auth',
  },
  /* Appearance */
  showLabels: false,
  hideSignInLink: true,
  hideSignUpLink: true,
  /* Client Side validation */
  overrideLoginErrors: false,
  continuousValidation: true,
  negativeFeedback: true,
  negativeValidation: true,
  texts: {
    title: {
      signIn: '',
      signUp: '',
    },
    button: {
      signIn: 'SIGN IN',
      signUp: 'SIGN UP',
    },
  },
});

/* Use username and password for login and signup */
const pwd = AccountsTemplates.removeField('password');
AccountsTemplates.removeField('email');
AccountsTemplates.addFields([
  {
    _id: 'username',
    type: 'text',
    required: true,
    minLength: 5,
    /* function that validates on client and server if username has already been taken */
    func(username) {
      if (Meteor.isClient) {
        Meteor.call('users.usernameExists', { username }, (err, usernameExists) => {
          if (!usernameExists) {
            this.setSuccess();
          } else {
            this.setError('Username is already taken.');
          }
          this.setValidating(false);
        });
        return;
      }
      /* Server */
      return Meteor.call('users.usernameExists', { username });
    },
  },
  pwd,
]);
