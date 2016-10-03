/* Planet_page
–––––––––––––––––––––––––––––––––––––––––––––––––– */
/* Smart component:
 * -> Subscribe to data
 * -> Fetch data from those subscriptions
 * -> Pass data to reusable child components to render it.
*/

import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { ReactiveVar } from 'meteor/reactive-var';

/* Import collections */
import Projects from '../../../api/projects/projects.js';
import Posts from '../../../api/posts/posts.js';

/* Import templates */
import './planet.html';
import '../../components/navigations/nav-main.js';
import '../../components/dialogue.js';
import '../../components/planet/filter.js';
import '../../components/planet/post-contentview.js';
import '../../components/planet/post-create.js';

/* Import d3js function Planet */
import Planet from '../../d3/planet.js';

Template.Planet_page.onCreated(function () {
  /* Thought selection
  –––––––––––––––––––––––––––––––––––––––––––––––––– */
  /* State of vis is pushed into URL (thought query param)
   * Selected post id is set when:
   * -> thought query param changes (click event) or
   * -> on hover event
   * It is used for templates Post_contentView and Post_remove
  */
  this.postId = new ReactiveVar();
  /* When URL contains a valid post id means that a node is selected */
  /* Therefore all hover events on other nodes are ignored */
  this.urlContainsPostId = new ReactiveVar();

  /* Filter selection
  –––––––––––––––––––––––––––––––––––––––––––––––––– */
  /* State of vis is pushed into URL (tags and people query params)
   * filterCategory is set on
   * -> explicitly on click event
   * -> implicitly on page load with specified query param people or tags
  */
  this.filterCategory = new ReactiveVar('tags');
  /* selectedFilter is set on */
  /* -> query param changes (click event) */
  this.selectedFilter = new ReactiveVar();

  /* helper function to generate one dimensional distinct array */
  this.distinct = (array, field) => {
    const arr = _.flatten(_.pluck(array, field));
    return _.uniq(arr, false);
  };

  /* Forms
  –––––––––––––––––––––––––––––––––––––––––––––––––– */
  /* dialogues (remove post, share project) */
  this.activeDialogue = new ReactiveVar(false);
  /* create post form */
  this.showCreatePost = new ReactiveVar(false);

  /* Subscription
  –––––––––––––––––––––––––––––––––––––––––––––––––– */
  /* Subscribe to posts.inProject publication based on FlowRouter params */
  /* username and projectSlut (unique combination) */
  const author = FlowRouter.getParam('username');
  const slug = FlowRouter.getParam('projectSlug');
  /* this.subscribe instead of Meteor.subscribe -> enables {{Template.subscriptionsReady}} */
  this.subscribe('posts.inProject', { author, slug }, () => {
    /* When project does not exists or is private */
    if (Projects.find().count() === 0) {
      FlowRouter.go('/notfound');
    }

    /* D3 force simulation
    –––––––––––––––––––––––––––––––––––––––––––––––––– */
    const planet = new Planet('.visualization');

    /* Listen reactively for changes in Collection */
    /* Establish a live query that invokes callbacks when the result of the query changes */
    Posts.find().observe({
      added(newDocument) {
        planet.addNode(newDocument);
      },
      removed(oldDocument) {
        planet.removeNode(oldDocument._id);
        FlowRouter.setQueryParams({ thought: null });
      },
    });

    /* Thought selection Listener
    –––––––––––––––––––––––––––––––––––––––––––––––––– */
    /* Listen for changes in query param 'thought' -> update vis */
    this.autorun(() => {
      const postId = FlowRouter.getQueryParam('thought');
      /* if post id is undefined query param 'thought' is undefined */
      if (postId) {
        const post = Posts.findOne(postId);
        /* if post does not exists (wrong url) */
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

    /* Filter selection Listener
    –––––––––––––––––––––––––––––––––––––––––––––––––– */
    /* Listen for changes in query param 'tags' and 'people' -> update vis */
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
        /* return array of ids which include tag from url */
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

/* Helpers
–––––––––––––––––––––––––––––––––––––––––––––––––– */

Template.Planet_page.helpers({
  contentViewArgs() {
    /* postId is dynamically set by hover and click event through route listener */
    const postId = Template.instance().postId.get();
    const post = Posts.findOne(postId);
    const userId = Meteor.userId();
    const project = Projects.findOne();
    return {
      post,
      /* if project belongs to user or he is owner of post he is allowed to remove post */
      userAllowedToRemovePost: () => {
        if (project.belongsTo(userId) || post.belongsTo(userId)) {
          return true;
        }
        return false;
      },
    };
  },

  /* on change of reactive param filterCategory filterArgs is triggered */
  filterArgs() {
    const ti = Template.instance();
    const project = Projects.findOne();
    const posts = Posts.find().fetch(); // fetch returns array
    const elements = () => {
      if (ti.filterCategory.get() === 'tags') {
        /* generate one dimensional distinct array */
        return ti.distinct(posts, 'tags');
      }
      return ti.distinct(posts, 'author');
    };

    return {
      elements,
      selectedElement: ti.selectedFilter,
      filterCategory: ti.filterCategory,
      userOwnsProject: project.belongsTo(Meteor.userId()),
    };
  },

  dialogueArgs() {
    const instance = Template.instance();
    const postId = instance.postId.get();
    const project = Projects.findOne();
    return {
      /* name of dialogue or false */
      activeDialogue: instance.activeDialogue.get(),
      /* postId for Post_remove */
      postId,
      /* project document for Project_share */
      project,
    };
  },
  showCreatePost() {
    return Template.instance().showCreatePost.get();
  },
  getProjectId() {
    return { projectId: Projects.findOne()._id };
  },

  /* Header of visualization */
  getProjectName() {
    return Projects.findOne().name;
  },
});

/* Events
–––––––––––––––––––––––––––––––––––––––––––––––––– */
Template.Planet_page.events({

  /* D3 force simulation interactions
  –––––––––––––––––––––––––––––––––––––––––––––––––– */
  'click .node'(event, templateInstance) {
    /* Post_create form is open -> close it */
    templateInstance.showCreatePost.set(false);
    /* Save state of visualization -> push postId into the url as query parameter */
    const postId = event.currentTarget.__data__._id;
    /* Clear selected filter from url */
    FlowRouter.setQueryParams({ tags: null, people: null });
    FlowRouter.setQueryParams({ thought: postId });
  },
  'click .planet'() {
    /* Clean UI state in URL -> update contentView */
    FlowRouter.setQueryParams({ thought: null });
    FlowRouter.setQueryParams({ tags: null });
    FlowRouter.setQueryParams({ people: null });
  },
  'mouseover .node'(event, templateInstance) {
    /* visual hover state is defined in css */
    /* if url contains state of vis do not update contentView */
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

  /* Filter component interactions
  –––––––––––––––––––––––––––––––––––––––––––––––––– */
  'click .horizontal-nav__link'(event, templateInstance) {
    const selectedCategory = templateInstance.$(event.target).data('filter-category');
    /* higlight selected filter menu */
    templateInstance.filterCategory.set(selectedCategory);
  },
  'click .tag-list__tag'(event, templateInstance) {
    /* Save state of visualization:
     * -> push selected filter element into url as named query parameter (tags, people)
     * -> update vis on path change
    */
    const filterCategory = templateInstance.filterCategory.get();
    const selectedFilter = templateInstance.$(event.target).text();
    /* if element is already selected -> clear selection */
    if (selectedFilter === templateInstance.selectedFilter.get()) {
      FlowRouter.setQueryParams({ thought: null, tags: null, people: null });
      return;
    }
    FlowRouter.setQueryParams({ thought: null, tags: null, people: null });
    FlowRouter.setQueryParams({ [filterCategory]: selectedFilter });
  },

  /* Dialogue (remove post, share project) interactions
  –––––––––––––––––––––––––––––––––––––––––––––––––– */
  'click .js-dialogue'(event, templateInstance) {
    const dialogueTemplate = templateInstance.$(event.target).data('dialogue-template');
    templateInstance.activeDialogue.set(dialogueTemplate);
  },
  /* on cancel and on submit */
  'click .js-dialogue-cancel, submit .js-dialogue-form'(event, templateInstance) {
    event.preventDefault();
    /* Hide form */
    templateInstance.activeDialogue.set(false);
  },

  /* Post_create form interactions
  –––––––––––––––––––––––––––––––––––––––––––––––––– */
  'click .js-post-create'(event, templateInstance) {
    /* Clean UI state in URL -> update contentView */
    FlowRouter.setQueryParams({ thought: null });
    templateInstance.showCreatePost.set(true);
  },
  'click .js-post-create-cancel, submit .js-post-create-form'(event, templateInstance) {
    event.preventDefault();
    /* Hide form */
    templateInstance.showCreatePost.set(false);
  },
});
