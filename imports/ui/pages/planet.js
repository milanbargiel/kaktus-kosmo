import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { ReactiveVar } from 'meteor/reactive-var';
// import { ReactiveDict } from 'meteor/reactive-dict';
import Projects from '../../api/projects/projects.js'; // Posts Collection
import Posts from '../../api/posts/posts.js'; // Posts Collection

// Import templates
import './planet.html';
import '../components/nav-main.js';
import '../components/dialogue.js';
import '../components/filter.js';
import '../components/post-contentview.js';
import '../components/post-create.js';

// Import d3js function Planet
import Planet from '../d3/planet.js';

Template.Planet_page.onCreated(function () {
  // Store temporary UI states in of forms in Session (globally).
  // A global var is used because the submit handler in the form template
  // needs to have access to it in order to hide submitted form.
  Session.set({
    activeDialogue: false,
  });
  this.showCreatePost = new ReactiveVar(false);

  // Filter
  // Selected filter option (tags or people)
  this.filterCategory = new ReactiveVar('tags');
  this.selectedFilter = new ReactiveVar();

  // helper function to generate one dimensional distinct array
  this.distinct = (array, field) => {
    const arr = _.flatten(_.pluck(array, field));
    return _.uniq(arr, false);
  };

  // Interaction with d3 force simulation
  // Selected post id is set when:
  // -> thought query param changes (click event) or
  // -> on hover event
  // It is used for templates Post_contentView and Post_remove
  this.postId = new ReactiveVar();
  // State of vis is pushed into URL
  // When URL contains a valid post id means that a node is selected
  // Therefore all hover events on other nodes are ignored
  this.urlContainsPostId = new ReactiveVar();

  // Subscribe to posts.inProject publication based on FlowRouter params
  // username and projectSlut (unique combination)
  const author = FlowRouter.getParam('username');
  const slug = FlowRouter.getParam('projectSlug');
  // this.subscribe instead of Meteor.subscribe -> enables {{Template.subscriptionsReady}}
  this.subscribe('posts.inProject', { author, slug }, () => {
    // When project does not exists or is private
    if (Projects.find().count() === 0) {
      FlowRouter.go('/notfound');
    }

    const planet = new Planet('.visualization');

    // Listen reactively for changes in Collection
    // Establish a live query that invokes callbacks when the result of the query changes
    Posts.find().observe({
      added(newDocument) {
        planet.addNode(newDocument);
      },
      removed(oldDocument) {
        planet.removeNode(oldDocument._id);
        FlowRouter.setQueryParams({ thought: null });
      },
    });

    // Listen for changes in query param 'thought' -> update vis
    this.autorun(() => {
      const postId = FlowRouter.getQueryParam('thought');
      // if post id is undefined query param 'thought' is undefined
      if (postId) {
        const post = Posts.findOne(postId);
        // if post does not exists (wrong url)
        if (!post) {
          return;
        }
        planet.selectNode(post._id);
        this.postId.set(post._id);
        this.urlContainsPostId.set(true);
      } else {
        planet.clearSelection();
        this.postId.set('');
        this.urlContainsPostId.set(false);
      }
    });

    // Listen for changes in query param 'tags' and 'people' -> update vis
    this.autorun(() => {
      const selectedTag = FlowRouter.getQueryParam('tags');
      const selectedAuthor = FlowRouter.getQueryParam('people');
      if (!selectedTag && !selectedAuthor) {
        this.selectedFilter.set(null);
        planet.clearSelection();
        return;
      }
      const posts = Posts.find().fetch();
      let ids = [];
      if (selectedTag) {
        // return array of ids which include tag from url
        ids = _.pluck(posts.filter(post => post.tags.includes(selectedTag)), '_id');
        this.filterCategory.set('tags');
        this.selectedFilter.set(selectedTag);
      }
      if (selectedAuthor) {
        ids = _.pluck(posts.filter(post => post.author === selectedAuthor), '_id');
        this.filterCategory.set('people');
        this.selectedFilter.set(selectedAuthor);
      }
      planet.selectNodes(ids);
    });
  });
});

Template.Planet_page.helpers({
  postArgs() {
    // pass document to Post_remove and Post_contentView
    const postId = Template.instance().postId.get();
    const post = Posts.findOne(postId);
    return post;
  },
  // projectArgs are static because Template.instance().projectId is static
  projectArgs() {
    return Projects.findOne();
  },
  filterArgs() {
    const ti = Template.instance();
    const posts = Posts.find().fetch(); // fetch returns array
    if (ti.filterCategory.get() === 'tags') {
      return {
        // generate one dimensional distinct array
        elements: ti.distinct(posts, 'tags'),
        selectedElement: ti.selectedFilter,
        filterCategory: ti.filterCategory,
      };
    }
    return {
      elements: ti.distinct(posts, 'author'),
      selectedElement: ti.selectedFilter,
      filterCategory: ti.filterCategory,
    };
  },
  showCreatePost() {
    return Template.instance().showCreatePost.get();
  },
});

Template.Planet_page.events({
  // Interactions with d3 force simulation
  'click .node'(event, templateInstance) {
    // Post_create form is open -> close it
    templateInstance.showCreatePost.set(false);
    // Save state of visualization -> push postId into the url as query parameter
    const postId = event.currentTarget.__data__._id;
    // Clear selected filter from url
    FlowRouter.setQueryParams({ tags: null, people: null });
    FlowRouter.setQueryParams({ thought: postId });
  },
  'click .planet'() {
    // Clean UI state in URL -> update contentView
    FlowRouter.setQueryParams({ thought: null });
    FlowRouter.setQueryParams({ tags: null });
    FlowRouter.setQueryParams({ people: null });
  },
  'mouseover .node'(event, templateInstance) {
    // visual hover state is defined in css
    // if url contains state of vis do not update contentView
    if (!templateInstance.urlContainsPostId.get()) {
      const postId = event.currentTarget.__data__._id;
      templateInstance.postId.set(postId);
    }
  },
  'mouseout .node'(event, templateInstance) {
    if (!templateInstance.urlContainsPostId.get()) {
      templateInstance.postId.set('');
    }
  },

  // Interactions with Forms
  'click .js-post-create'(event, templateInstance) {
    // Clean UI state in URL -> update contentView
    FlowRouter.setQueryParams({ thought: null });
    templateInstance.showCreatePost.set(true);
  },
  'click .js-post-create-cancel'(event, templateInstance) {
    event.preventDefault();
    // Hide form
    templateInstance.showCreatePost.set(false);
  },
  'submit .js-post-create-form'(event, templateInstance) {
    templateInstance.showCreatePost.set(false);
  },
  // Remove post
  'click .js-dialogue'(event, templateInstance) {
    const dialogueTemplate = templateInstance.$(event.target).data('dialogue-template');
    Session.set('activeDialogue', dialogueTemplate);
  },
  'click .js-dialogue-cancel'() {
    // Hide form
    Session.set('activeDialogue', false);
  },

  // Interactions with Filter
  'click .horizontal-nav__link'(event, templateInstance) {
    const selectedCategory = templateInstance.$(event.target).data('filter-category');
    // higlight selected filter menu
    templateInstance.filterCategory.set(selectedCategory);
  },
  'click .tag-list__tag'(event, templateInstance) {
    // Save state of visualization:
    // -> push selected filter element into url as named query parameter (tags, people)
    // -> update vis on path change
    const filterCategory = templateInstance.filterCategory.get();
    const selectedFilter = templateInstance.$(event.target).text();
    FlowRouter.setQueryParams({ thought: null, tags: null, people: null });
    FlowRouter.setQueryParams({ [filterCategory]: selectedFilter });
  },
});
