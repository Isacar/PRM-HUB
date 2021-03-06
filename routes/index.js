/**
 * This file is where you define your application routes and controllers.
 *
 * Start by including the middleware you want to run for every request;
 * you can attach middleware to the pre('routes') and pre('render') events.
 *
 * For simplicity, the default setup for route controllers is for each to be
 * in its own file, and we import all the files in the /routes/views directory.
 *
 * Each of these files is a route controller, and is responsible for all the
 * processing that needs to happen for the route (e.g. loading data, handling
 * form submissions, rendering the view template, etc).
 *
 * Bind each route pattern your application should respond to in the function
 * that is exported from this module, following the examples below.
 *
 * See the Express application routing documentation for more information:
 * http://expressjs.com/api.html#app.VERB
 */

var keystone = require('keystone');
var middleware = require('./middleware');
var importRoutes = keystone.importer(__dirname);

// Common Middleware
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);
keystone.pre('render', middleware.requireUser);


// Import Route Controllers
var routes = {
	views: importRoutes('./views'),
	api: importRoutes('./api')
};

// Setup Route Bindings
exports = module.exports = function (app) {
	// Views
	//app.get('/', routes.views.myRequests);
	app.all('/', routes.views.landing);
	app.all('/request', routes.views.request);
	app.all('/myRequests', routes.views.myRequests);
	app.all('/assignments', routes.views.assignments);
	app.all('/assignment/:id', routes.views.assignment);
	app.all('/teamBoard', routes.views.teamBoard);
	app.all('/sqlWiki', routes.views.sqlWiki);
	app.all('/stats/:viz', routes.views.stats);
	app.all('/stats', routes.views.stats);
	app.all('/schedule', routes.views.schedule);
	app.all('/resources', routes.views.resources);
	app.all('/resources/:target', routes.views.resources);




	app.get('/api/requests/list', keystone.middleware.api, routes.api.requests.list);

	// NOTE: To protect a route so that only admins can see it, use the requireUser middleware:
	// app.get('/protected', middleware.requireUser, routes.views.protected);

};
