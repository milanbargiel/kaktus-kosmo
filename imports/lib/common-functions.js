/* Common functions
–––––––––––––––––––––––––––––––––––––––––––––––––– */
/* Are imported from where needed */

import { FlowRouter } from 'meteor/kadira:flow-router';
import urlify from 'urlify';

/* urlifier function is used to urlify project name */
/* Used in projects.insert method */
export const urlifier = urlify.create({
  addEToUmlauts: true,
  szToSs: true,
  spaces: '_',
  nonPrintable: '_',
  trim: true,
});

/* Generating a string with path to project for anchor tags */
/* Used in d3/universe.js and Universe_mobile_page */
export const pathForProject = (username, projectSlug) => {
  const routeName = 'planet'; // route '/:username/:projectSlug'
  /* Generate path */
  const path = FlowRouter.path(routeName, { username, projectSlug });
  return path;
};
