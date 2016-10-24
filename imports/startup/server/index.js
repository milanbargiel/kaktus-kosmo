/* Startup client index
–––––––––––––––––––––––––––––––––––––––––––––––––– */
/* Import server startup through a single index entry point */
/* Files inside of startup folder are imported first */
/* They do necessary configuration for packages and import the rest of apps code */

/* If database is empty load seed data */
import './fixtures.js';

/* Register methods and publications on the server */
import './register-api.js';
