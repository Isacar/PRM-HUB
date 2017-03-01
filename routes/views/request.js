var keystone = require('keystone');
var Request = keystone.list('Request');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.section = 'request';
	locals.requestRelevance = Request.fields.relevance.ops;
	locals.formData = req.body || {};
	locals.validationErrors = {};
	locals.requestSubmitted = false;

	// On POST requests, add the Enquiry item to the database
	view.on('post', { action: 'request' }, function (next) {

		var newRequest = new Request.model();
		var updater = newRequest.getUpdateHandler(req);

		updater.process(req.body, {
			flashErrors: true,
			fields: 'name, email, relevance, description',
			errorMessage: 'There was a problem submitting your request:',
		}, function (err) {
			if (err) {
				locals.validationErrors = err.errors;
			} else {
				locals.enquirySubmitted = true;
			}
			next();
		});
	});

	view.render('request');
};
