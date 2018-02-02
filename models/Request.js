var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Request Model
 * =============
 */

var Request = new keystone.List('Request', {
	nocreate: false,
	noedit: false,
});

Request.add({
	name: { type: Types.Text, required: true },
	client: { type: Types.Relationship, ref: 'User', required: true, initial:true},
	assignee: { type: Types.Relationship, ref: 'User', filters: { role: 'assignee' }},
	type: { type: Types.Select, options: [
		{ value: 'raw', label: 'Raw Data' },
		{ value: 'report', label: 'New Report' },
		{ value: 'enhacement', label: 'Report Enhancement' },
		{ value: 'error', label: 'Error Detected' }
	], required: true, initial:true},
	// format: { type: Types.Select, options: [
	// 	{ value: 'flat', label: 'Flat File' },
	// 	{ value: 'tb-view', label: 'Tableau View' },
	// 	{ value: 'tb-workbook', label: 'Tableau Workbook' },
	// 	{ value: 'other', label: 'Other' }
	// ], required: true, initial:true},
	frequency: { type: Types.Select, options:  'ad-hoc, daily, weekly, monthly, bi-monthly, other',
	required: true , initial:true },
	priority: { type: Types.Select, options: [
		{ value: '1', label: 'Urgent' },
		{ value: '2', label: 'Very Important' },
		{ value: '3', label: 'Important' },
		{ value: '4', label: 'Nice to have' },
	], required: true , initial:true},
	description: { type: Types.Textarea, required: true, initial:true},
	benefit: { type: Types.Textarea, required: true, initial:true},
	createdAt: { type: Date, default: Date.now },
	closedAt: { type: Date, default: null },
//TODO auto populate field
	status: { type: Types.Select, options: 'open, in progress, closed', default: 'open'},

	//TODO how to set default Relationship value for field
	team: { type: Types.Relationship, ref: 'Team', required: true, initial:true}

});

Request.schema.pre('save', function (next) {
	this.wasNew = this.isNew;
	next();
});

Request.schema.post('save', function () {
	if (this.wasNew) {
		//this.sendNotificationEmail();
		//**breaks app
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
Request.defaultColumns = 'name, priority, client, assignee, status, createdAt';
Request.register();
