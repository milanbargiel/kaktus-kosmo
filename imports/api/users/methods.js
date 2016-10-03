/* Meteor.users Collection - Methods
–––––––––––––––––––––––––––––––––––––––––––––––––– */

import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

/* usernames are unique in application, they are used as url query param
 * usernameExists tests if a specific username already has been taken.
 * Method is executed on server during sign up.
 * Method is called from startup/both/useraccounts-configuration.js
*/

const usernameExists = new ValidatedMethod({
  name: 'users.usernameExists',
  validate: new SimpleSchema({
    username: {
      type: String,
    },
  }).validator(),
  run({ username }) {
    return !!Meteor.users.findOne({ username });
  },
});

export default usernameExists;
