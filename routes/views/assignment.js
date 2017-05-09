var keystone = require('keystone');
var Request = keystone.list('Request');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.filters = {
		assignment: req.params.id,
	};
	locals.section = 'assignments';
	// Load the current assignment
		view.on('init', function (next) {

			var q = Request.model.findOne({
				_id: locals.filters.assignment,
			}).populate('client');

			q.exec(function (err, result) {
				locals.assignment = result;
				next(err);
			});

		});
	//change state to completed
	view.on('post', { action: 'completed' }, function (next) {
		var q = Request.model.findOne({
			_id: locals.filters.assignment,
		});
		q.exec(function (err, result) {
			result.status = 'closed';
			result.closedAt = Date.now();
			console.log(result);
			result.save(function (err) {
				if (err) return res.err(err);
				req.flash('success', 'Your assignment has been updated');
				//locals.assignment = result;
				res.redirect('/assignments');
				//next();
			});
		});
	});

	view.render('assignment');
};
