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
		{ value: 'raw', label: 'raw data' },
		{ value: 'report', label: 'new report' },
		{ value: 'decision', label: 'decision report' },
		{ value: 'enhacement', label: 'report enhancement' },
		{ value: 'process', label: 'new process' },
		{ value: 'error', label: 'error detected' },
	], required: true, initial:true},
	format: { type: Types.Select, options: [
		{ value: 'xlsx', label: 'excel' },
		{ value: 'flat', label: 'flat file' },
		{ value: 'tb-view', label: 'tableau View' },
		{ value: 'tb-workbook', label: 'tableau workbook' },
		{ value: 'Access', label: 'access' },
		{ value: 'sql-query', label: 'sql query' },
		{ value: 'alteryx-wf', label: 'alteryx workflow' },
		{ value: 'shares-commands', label: 'shares command' },
		{ value: 'application', label: 'application' },

	], required: true, initial:true},
	frequency: { type: Types.Select, options:  'ad-hoc, daily, weekly, monthly, bi-monthly, other',
	required: true , initial:true },
	priority: { type: Types.Select, options: [
		{ value: '1', label: 'urgent' },
		{ value: '2', label: 'very important' },
		{ value: '3', label: 'important' },
		{ value: '4', label: 'nice to have' },
	], required: true , initial:true},
	description: { type: Types.Textarea, required: true, initial:true},
	benefit: { type: Types.Textarea, required: true, initial:true},
	createdAt: { type: Date, default: Date.now },
	closedAt: { type: Date, default: null },
//TODO auto populate field
	status: { type: Types.Select, options: 'open, in progress, closed', default: 'open'},
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
