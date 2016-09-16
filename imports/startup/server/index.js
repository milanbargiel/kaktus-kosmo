/* Import server startup through a single index entry point */

/* If database is empty load seed data */
import './fixtures.js';

/* Register methods on the server */
import './methods.js';

/* Publish Collections to the client */
import './publications.js';
