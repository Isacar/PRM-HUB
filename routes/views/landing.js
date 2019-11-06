var keystone = require('keystone');
var Request = keystone.list('Request');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.section = 'landing';
	locals.hasRequests = false;

	//res.redirect('acehub.copaair.com');
	//view.render('index');

	res.writeHead(302, {
	  'Location': 'http://acehub.copaair.com'
	  //add other headers here...
	});
	res.end();
};
