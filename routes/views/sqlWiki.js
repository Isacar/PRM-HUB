
var keystone = require('keystone');
var Query = keystone.list('Query');
var loadLanguages = require('prismjs/components/');
var Prism = require('prismjs');
var _ = require('lodash');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'sqlWiki';

// *THIS IS NO LONGER USED **/
	view.on('init', function (next) {



			next();
	});


	view.on('post', { action: 'search' }, function (next) {
		loadLanguages(['sql']);
		Query.model.find({tags : req.body.search_input.toLowerCase()}) // TODO prevent injection?? **
		.exec(function(err, queries){
			if (queries) {
				//console.log(queries);
				locals.hasQueries = true;

				_.forEach(queries, function(query, key, obj){
					//console.log(query);
					query.sql = Prism.highlight(query.sql, Prism.languages.sql, 'sql');
				});
				locals.queries = queries;
			}
			//console.log(queries);
			next();
		});
	});


	// Render the view
	view.render('sqlWiki');
};
