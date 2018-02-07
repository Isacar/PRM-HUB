var keystone = require('keystone');
var Request = keystone.list('Request');
var User = keystone.list('User');
var _ = require('lodash');
var async = require('async');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.section = 'teamBoard';
	locals.hasRequests = false;
	//locals.assignees = [{'value':'00012', 'label':'isacar'},{'value':'00012', 'label':'isacar'}]
	//console.log(locals.assignees);

	/* figure out if the current logged in user has a team
	- if he has a team then display the team board, if not ... display something else

	*/

	//TODO when populate is selected in order to get name of assignee the then function doest execute at the expected time
	// - keep selected assignee
	// - fix mentioned ono step one
	view.on('init', function(next) {
		//query db with requests from logged in user team
		if (!req.user || req.user.role !== 'assignee' || req.user.team === null) { //TODO if not part of any team show myRequests
			res.redirect('/myRequests');
		} else {

			async.series([
					function(callback) {
						// do some stuff ...
						Request.model.find()
							//.where({ 'status':'open'})
							.where({
								'team': req.user.team,
								'status': 'open'
							})
							.populate('assignee')
							.sort('-createdAt')
							.exec(function(err, requests) {
								//TODO handle when user has no team

								if (requests) {
									locals.hasRequests = true;
									locals.requests = requests;
								}

								//console.log(requests);
								//next();
								callback(null, locals);
							});

					},
					function(callback) {
						// do some more stuff ...
						User.model.find()
							.where({
								'team': req.user.team
							}) //fellow team members
							.exec(function(err, users) {

								//TODO handle when Team has no team members
								//console.log('search assignees');
								if (users) {

									_.forEach(locals.requests, function(request, key, obj) {
										request.assignees = users;

										if (request.assignee !== null) {

											_.forEach(request.assignees, function(assignee, key, obj) {
												console.log(assignee);
												if ( request.assignee._id.equals(assignee._id)) {
													request.assigned = assignee.name.first;
												}
											});

										} else {
											request.assigned = 'select';
										}
										obj[key] = request;
									});
								}
								callback(null, locals);
							});


					}
				],
				// optional callback
				function(err, results) {
					// results is now equal to ['one', 'two']
					//console.log(results);
					next(err);
				});

		}
	});

	// On POST assign the request to an assignee
	view.on('post', {
		action: 'assign'
	}, function(next) {
		console.log('assign');
		console.log(req.body);
		Request.model.findOne({
				_id: req.body.request,
			})
			.exec(function(err, request) {
				if (err) {
					req.flash('error', 'There was an error. We are so sorry. Get in touch with Isacar.');
					return next();

					//return res.err(err);
				} else {
					request.assignee = req.body.assignee;
					//console.log(request.assignee);
					//return res.redirect('/teamBoard');
					request.save(function(err) {
						if (err) return res.err(err);
						req.flash('success', { title: 'The request has been assigned. You Rock!!'});
						//console.log(request);
						return res.redirect('/teamBoard');
					});
				}


			});

	});

	view.render('teamBoard');
};
