
var keystone = require('keystone');


exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'stats';

	view.on('init', function (next) {
		//query db with logged in user data
		console.log(req.params.viz);
		// TODO  check if parameter is null so a defualt view needs to be shown
		locals.targetViz = 'https://i2trekviz.somoscopa.com/t/CopaVizHub/views/PRMFLOWNOVERVIEW/PRMFLOWNOVERVIEW?iframeSizedToWindow=true&:embed=y&:showAppBanner=false&:display_count=no&:showVizHome=no';
		//locals.targetViz = 'https://i2trekviz.somoscopa.com/t/CopaVizHub/views/TableauStarterKid/Main?iframeSizedToWindow=true&:embed=y&:showAppBanner=false&:display_count=no&:showVizHome=no';

		next();
	});


	// Render the view
	view.render('stats');
};
