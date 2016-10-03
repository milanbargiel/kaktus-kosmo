/* Fixtures
–––––––––––––––––––––––––––––––––––––––––––––––––– */
/* If database is empty fill with seed data */

import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { urlifier } from '../../lib/common-functions.js';

/* Import Projects and Posts Collection */
import Projects from '../../api/projects/projects.js';
import Posts from '../../api/posts/posts.js';

/* Code inside of Meteor.startup runs after all app files have loaded */
Meteor.startup(() => {
  if (Meteor.users.find().count() === 0) {
    const userOne = Accounts.createUser({
      username: 'kaktus',
      password: 'kaktus',
    });

    const userTwo = Accounts.createUser({
      username: 'Viktor',
      password: 'kaktus',
    });

    const userThree = Accounts.createUser({
      username: 'Peter Scranitsch',
      password: 'kaktus',
    });

    const publicProject = Projects.insert({
      userId: userOne,
      author: Meteor.users.findOne(userOne).username,
      name: 'Elephant Dreams',
      slug: urlifier('Elephant Dreams'),
      public: true,
      createdAt: new Date(),
    });

    Posts.insert({
      userId: Meteor.users.findOne(userOne)._id,
      author: Meteor.users.findOne(userOne).username,
      projectId: publicProject,
      text: 'I had a dream about an green elephant. It asked me to travel on his back to India. When I accepted his offer he laughed at me and said that I am much to heavy. The elephant would rather go alone.<span class="thought__tag"> #dream</span><span class="thought__tag"> #elephant</span>',
      tags: ['#dream', '#elephant'],
      createdAt: new Date(),
    });

    Posts.insert({
      userId: Meteor.users.findOne(userTwo)._id,
      author: Meteor.users.findOne(userTwo).username,
      projectId: publicProject,
      text: 'He told students to get their diplomas and shared his dream of escape.<span class="thought__tag"> #freddiegray</span><span class="thought__tag"> #dream</span>',
      tags: ['#freddiegray', '#dream'],
      createdAt: new Date(),
    });

    Posts.insert({
      userId: Meteor.users.findOne(userThree)._id,
      author: Meteor.users.findOne(userThree).username,
      projectId: publicProject,
      text: 'But they did not see any<span class="thought__tag"> #trump</span> Home mirrors or lotion dispensers',
      tags: ['#trump'],
      createdAt: new Date(),
    });

    Posts.insert({
      userId: Meteor.users.findOne(userOne)._id,
      author: Meteor.users.findOne(userOne).username,
      projectId: publicProject,
      text: 'When Jobs returned, it was a dark time for Apple. It was forced to team up with its archrival Microsoft, and even took a $150 million stock investment from the company, which was then run by Bill Gates.<span class="thought__tag"> #elephant</span><span class="thought__tag"> #dream</span>',
      tags: ['#elephant', '#dream'],
      createdAt: new Date(),
    });

    const privateProject = Projects.insert({
      userId: userOne,
      author: Meteor.users.findOne(userOne).username,
      name: 'My Secret Planet',
      slug: urlifier('My Secret Planet'),
      public: false,
      createdAt: new Date(),
    });

    Posts.insert({
      userId: Meteor.users.findOne(userOne)._id,
      author: Meteor.users.findOne(userOne).username,
      projectId: privateProject,
      text: 'I tell you a secret this time I wont tell anybody else<span class="thought__tag"> #secret</span>',
      tags: ['#secret'],
      createdAt: new Date(),
    });

    Posts.insert({
      userId: Meteor.users.findOne(userOne)._id,
      author: Meteor.users.findOne(userOne).username,
      projectId: privateProject,
      text: 'Nobody can sees that except the hackers<span class="thought__tag"> #hackers</span>',
      tags: ['#hackers'],
      createdAt: new Date(),
    });
  }
});
