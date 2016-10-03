/* Startup client index
–––––––––––––––––––––––––––––––––––––––––––––––––– */
/* Import server startup through a single index entry point */
/* Files inside of startup folder are imported first */
/* They do necessary configuration for packages and import the rest of apps code */

/* If database is empty load seed data */
import './fixtures.js';

/* Register methods on the server */
import './methods.js';

/* Publish Collections to the client */
import './publications.js';
