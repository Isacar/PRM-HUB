var async = require('async'),
keystone = require('keystone');

var Request = keystone.list('Request');

/**
 * List Posts
 */
exports.list = function(req, res) {
	Request.model.find()
	.populate('client')
	.populate('assignee')
	//.populate('assignee')
	.exec(function(err, items) {

		if (err) return res.apiError('database error', err);

		res.apiResponse({
			requests: items
		});

	});
}
