import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

const exists = new ValidatedMethod({
  name: 'users.exists',
  validate: new SimpleSchema({
    username: {
      type: String,
    },
  }).validator(),
  run({ username }) {
    return !!Meteor.users.findOne({ username });
  },
});

export default exists;
