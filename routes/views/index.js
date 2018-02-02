var keystone = require('keystone');
var Request = keystone.list('Request');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'home';

// *THIS IS NO LONGER USED **/
	view.on('init', function (next) {
		//query db with requests from logged in user team
		console.log(locals);

				next();

		
	});

	// Render the view
	view.render('teamBoard');
};
