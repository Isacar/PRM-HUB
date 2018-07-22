var keystone = require('keystone');
var Request = keystone.list('Request');
var request = require("request");
exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'home';

// *THIS IS NO LONGER USED **/
	view.on('init', function (next) {
		//query db with requests from logged in user team
		console.log('init TRELLO');

		//var options = { method: 'GET', url: 'https://api.trello.com/1/members/iracine/boards/?fields=all,url&key=1d6342088d9a143a39fade05099e8f58&token=afad56f4d0e7e4fe775abeb610359f0e7a7061e465441820dba064b64cd73e5e' };
		//var options = { method: 'GET', url: 'https://api.trello.com/1/boards/5b4614c7ef558089bd14d2d2/lists/?fields=all,url&key=1d6342088d9a143a39fade05099e8f58&token=afad56f4d0e7e4fe775abeb610359f0e7a7061e465441820dba064b64cd73e5e' };
		//var options = { method: 'GET', url: 'https://api.trello.com/1/lists/5b4628438c095ee92010c1bd/cards/?fields=all,url&key=1d6342088d9a143a39fade05099e8f58&token=afad56f4d0e7e4fe775abeb610359f0e7a7061e465441820dba064b64cd73e5e' };
		var options = { method: 'POST',
		  url: 'https://api.trello.com/1/cards',
		  qs:
		   { name: 'Request by request app test',
		     idList: '5b4628438c095ee92010c1bd',
			desc: 'please fill this output',
		     keepFromSource: 'all',
		     key: '1d6342088d9a143a39fade05099e8f58',
		     token: 'afad56f4d0e7e4fe775abeb610359f0e7a7061e465441820dba064b64cd73e5e'
			}
		};

		request(options, function (error, response, body) {
		  if (error) throw new Error(error);
		  console.log(body);
		})
		next();
	});

	// Render the view
	view.render('trello');
};
