var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Request Model
 * =============
 */

var Request = new keystone.List('Request', {
	nocreate: true,
	noedit: true,
});

Request.add({
	name: { type: Types.Name, required: true },
	email: { type: Types.Email, required: true },
	relevance: { type: Types.Select, options: [
		{ value: '1', label: 'urgent' },
		{ value: '2', label: 'medium priority' },
		{ value: '3', label: 'nice to have' },
		{ value: '4', label: 'low priority' },
	] },
	description: { type: Types.Markdown, required: true },
	createdAt: { type: Date, default: Date.now },
	closedAt: { type: Date, default: Date.now },
});

Request.schema.pre('save', function (next) {
	this.wasNew = this.isNew;
	next();
});

Request.schema.post('save', function () {
	if (this.wasNew) {
		//this.sendNotificationEmail();
		//breaks app
	}
});

Request.schema.methods.sendNotificationEmail = function (callback) {
	if (typeof callback !== 'function') {
		callback = function () {};
	}
	var request = this;
	keystone.list('User').model.find().where('isAdmin', true).exec(function (err, admins) {
		if (err) return callback(err);
		new keystone.Email({
			templateExt: 'hbs',
			templateEngine: require('express-handlebars'),
			templateName: 'enquiry-notification',
		}).send({
			to: admins,
			from: {
				name: 'requests',
				email: 'contact@requests.com',
			},
			subject: 'New request',
			request: request,
		}, callback);
	});
};

Request.defaultSort = '-createdAt';
Request.defaultColumns = 'name, email, relevance, createdAt';
Request.register();
