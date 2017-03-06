var keystone = require('keystone');
var Request = keystone.list('Request');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.section = 'myRequests';
	locals.hasRequests = false;
	view.on('init', function (next) {
		//query db with logged in user data
		Request.model.find()
		.where('creator', req.user._id)
		.exec(function(err, requests){
			//if (requests) {
				locals.hasRequests = true;
				locals.requests = requests;
				next();
		});
	});

	view.render('myRequests');
};
