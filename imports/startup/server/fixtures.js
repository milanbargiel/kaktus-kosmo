/* Fixtures
–––––––––––––––––––––––––––––––––––––––––––––––––– */

import { Meteor } from 'meteor/meteor';

import { Accounts } from 'meteor/accounts-base'; // Import Accounts Collection
import Projects from '../../api/projects/projects.js'; // Import Projects Collection
import Posts from '../../api/posts/posts.js'; // Import Posts Collection

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
      name: 'Elephant Dreams',
      public: true,
      createdAt: new Date(),
    });

    Posts.insert({
      projectId: publicProject,
      author: Meteor.users.findOne(userOne).username,
      text: 'I had a dream about an green elephant. It asked me to travel on his back to India. When I accepted his offer he laughed at me and said that I am much to heavy. The elephant would rather go alone. #dream #elephant',
      tags: ['#dream', '#elephant'],
      createdAt: new Date(),
    });

    Posts.insert({
      projectId: publicProject,
      author: Meteor.users.findOne(userTwo).username,
      text: 'He told students to get their diplomas and shared his dream of escape. #freddiegray #dream',
      tags: ['#freddiegray', '#dream'],
      createdAt: new Date(),
    });

    Posts.insert({
      projectId: publicProject,
      author: Meteor.users.findOne(userThree).username,
      text: 'But they did not see any #trump Home mirrors or lotion dispensers',
      tags: ['#trump'],
      createdAt: new Date(),
    });

    Posts.insert({
      projectId: publicProject,
      author: Meteor.users.findOne(userOne).username,
      text: 'When Jobs returned, it was a dark time for Apple. It was forced to team up with its archrival Microsoft, and even took a $150 million stock investment from the company, which was then run by Bill Gates. #elephant #dream',
      tags: ['#elephant', '#dream'],
      createdAt: new Date(),
    });

    const privateProject = Projects.insert({
      userId: userOne,
      name: 'My Secret Planet',
      public: false,
      createdAt: new Date(),
    });

    Posts.insert({
      projectId: privateProject,
      author: Meteor.users.findOne(userOne).username,
      text: 'I tell you a secret this time I wont tell anybody else #secret',
      tags: ['#secret'],
      createdAt: new Date(),
    });

    Posts.insert({
      projectId: privateProject,
      author: Meteor.users.findOne(userOne).username,
      text: 'Nobody can sees that except the hackers #hackers',
      tags: ['#hackers'],
      createdAt: new Date(),
    });
  }
});
