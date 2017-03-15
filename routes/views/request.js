var keystone = require('keystone');
var Request = keystone.list('Request');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.section = 'request';
	locals.requestPriorities = Request.fields.priority.ops;
	locals.requestTypes = Request.fields.type.ops;
	locals.requestFormats = Request.fields.format.ops;
	locals.requestFrequencies = Request.fields.frequency.ops;

	locals.formData = req.body || {};
	locals.validationErrors = {};
	locals.requestSubmitted = false;

	// On POST requests, add the request item to the database
	view.on('post', { action: 'request' }, function (next) {
		var newRequest = new Request.model();
		var updater = newRequest.getUpdateHandler(req);

		updater.process(req.body, {
			flashErrors: true,
			fields: 'name, client, priority, type, format, frequency, description, benefit',
			errorMessage: 'There was a problem submitting your request:',
		}, function (err) {
			if (err) {
				locals.validationErrors = err.errors;
				console.log(err.errors);
			} else {
				locals.requestSubmitted = true;
			}
			next();
		});
	});

	view.render('request');
};
