
var keystone = require('keystone');
var Email = require('keystone-email');
var hbs = require('handlebars');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;
	//var templateLocals['layout'] = false;
	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'resources';

	view.on('init', function (next) {
		//query db with logged in user data
		//console.log(req.params.viz);
		// TODO  check if parameter is null so a defualt view needs to be shown

		if (req.params.target == 'tableau') {
			locals.targetViz = 'https://i2trekviz.somoscopa.com/t/CopaVizHub/views/TableauStarterKit-EverythingYouNeedToKnow/Main?iframeSizedToWindow=true&:embed=y&:showAppBanner=false&:display_count=no&:showVizHome=no';

		}else if (req.params.target == 'sql') {
			locals.targetViz = 'https://i2trekviz.somoscopa.com/t/CopaVizHub/views/SQLStarterKit-EverythingYouNeedToKnow/Main?iframeSizedToWindow=true&:embed=y&:showAppBanner=false&:display_count=no&:showVizHome=no';

		}else {
			locals.targetViz = 'https://i2trekviz.somoscopa.com/t/CopaVizHub/views/AlteryxStarterKit-EverythingYouNeedToKnow/Main?iframeSizedToWindow=true&:embed=y&:showAppBanner=false&:display_count=no&:showVizHome=no';

		}
		next();
	});


	// Render the view
	view.render('resources');
};
