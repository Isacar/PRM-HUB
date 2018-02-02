/**
 * This file contains the common middleware used by your routes.
 *
 * Extend or replace these functions as your application requires.
 *
 * This structure is not enforced, and just a starting point. If
 * you have more middleware you may want to group it as separate
 * modules in your project's /lib directory.
 */
var _ = require('lodash');


/**
	Initialises the standard view locals

	The included layout depends on the navLinks array to generate
	the navigation in the header, you may wish to change this array
	or replace it with your own templates / logic.
*/
exports.initLocals = function (req, res, next) {
	res.locals.navLinks = [
		//{ label: 'home', key: 'home', href: '/' },
		{ label: 'My requests', key: 'myRequests', href: '/myRequests' },
		{ label: 'New request', key: 'request', href: '/request' },

	];
	res.locals.user = req.user;
	//show assignments only for team members
	if (req.user && req.user.role == 'assignee') {
		res.locals.navLinks.push({ label: 'My assignments', key: 'assignments', href: '/assignments' });
	}
	//show admin panel if admin
	if (req.user && req.user.isAdmin) {
		res.locals.navLinks.push({ label: 'Admin', key: 'admin', href: '/keystone' });
	}
	// show team button if part of any team
	/*if (req.user.team) { //crash cuz at first it does not belong to a team
		res.locals.navLinks.push({ label: 'Team', key: 'teamBoard', href: '/teamBoard' });
	}*/
	next();
};


/**
	Fetches and clears the flashMessages before a view is rendered
*/
exports.flashMessages = function (req, res, next) {
	var flashMessages = {
		info: req.flash('info'),
		success: req.flash('success'),
		warning: req.flash('warning'),
		error: req.flash('error'),
	};
	res.locals.messages = _.some(flashMessages, function (msgs) { return msgs.length; }) ? flashMessages : false;
	next();
};


/**
	Prevents people from accessing protected pages when they're not signed in
 */
exports.requireUser = function (req, res, next) {
	if (!req.user) {
		req.flash('error', 'Please sign in to access this page.');
		res.redirect('/keystone/signin');
	} else {
		//res.redirect('/');
		next();
	}
};
