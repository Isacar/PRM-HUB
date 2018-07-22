var keystone = require('keystone');
var Request = keystone.list('Request');
var Team = keystone.list('Team');
var request = require("request");

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.section = 'request';
	locals.requestPriorities = Request.fields.priority.ops;
	locals.requestTypes = Request.fields.type.ops;
	//locals.requestFormats = Request.fields.format.ops;
	locals.requestFrequencies = Request.fields.frequency.ops;
	//locals.requestTeams = Request.fields.team.ops;

	locals.formData = req.body || {};
	locals.validationErrors = {};
	locals.requestSubmitted = false;

	// On POST requests, add the request item to the database
	view.on('post', { action: 'request' }, function (next) {
		var newRequest = new Request.model();
		var updater = newRequest.getUpdateHandler(req);

		updater.process(req.body, {
			flashErrors: true,
			fields: 'name, client, priority, type, team, frequency, description, benefit',
			errorMessage: 'There was a problem submitting your request:',
		}, function (err) {
			if (err) {
				locals.validationErrors = err.errors;
				//console.log(err.errors);
			} else {
				locals.requestSubmitted = true;
				//set up Trello API call
				var options = { method: 'POST',
				  url: 'https://api.trello.com/1/cards',
				  qs:
				   { name: updater.req.body.name,
				     idList: '5b4628438c095ee92010c1bd',
					desc: updater.req.body.description,
				     keepFromSource: 'all',
				     key: '1d6342088d9a143a39fade05099e8f58',
				     token: 'afad56f4d0e7e4fe775abeb610359f0e7a7061e465441820dba064b64cd73e5e'
					}
				};
				//perform call
				request(options, function (error, response, body) {
				  if (error) throw new Error(error);
			  })
			}
			next();
		});
	});

	view.on('init', function (next) {
		//query db with logged in user data
		Team.model.find()
		.sort('-createdAt')
		.exec(function(err, teams){
			if (teams) {
				locals.teamsAvailable = true;
				locals.teams = teams;
			}
			//console.log(teams);
			next();
		});
	});


	//TODO find all available teams pre render *id

	view.render('request');
};
