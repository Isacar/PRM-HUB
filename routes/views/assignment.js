var keystone = require('keystone');
var Request = keystone.list('Request');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.filters = {
		assignment: req.params.id,
	};
	locals.section = 'assignment';
	// Load the current assignment
		view.on('init', function (next) {

			var q = Request.model.findOne({
				_id: locals.filters.assignment,
			}).populate('creator');

			q.exec(function (err, result) {
				locals.assignment = result;
				next(err);
			});

		});

	view.render('assignment');
};
