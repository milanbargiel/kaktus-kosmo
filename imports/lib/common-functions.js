import urlify from 'urlify';
import { FlowRouter } from 'meteor/kadira:flow-router';

// export a function bring a string in url format
export const urlifier = urlify.create({
  addEToUmlauts: true,
  szToSs: true,
  spaces: '_',
  nonPrintable: '_',
  trim: true,
});

/* Generating a string with path to project for anchor tags */
export const pathForProject = (username, projectSlug) => {
  const routeName = 'planet'; // route '/:username/:projectSlug'
  /* Generate path */
  const path = FlowRouter.path(routeName, { username, projectSlug });
  return path;
};
