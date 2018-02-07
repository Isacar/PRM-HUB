var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * User Model
 * ==========
 */
var User = new keystone.List('User');

User.add({
	name: { type: Types.Name, required: true, index: true },
	email: { type: Types.Email, initial: true, required: true, index: true },
	password: { type: Types.Password, initial: true, required: true },
	role: { type: Types.Select, options: 'client, assignee',  initial: true},
	department: { type: Types.Select,
		options: 'CRC, pricing strategy, revenue management,',  initial: true },
	team: { type: Types.Relationship, ref: 'Team', initial: true, required: false },
}, 'Permissions', {
	isAdmin: { type: Boolean, label: 'Can access Keystone', index: true },
});

// Provide access to Keystone
User.schema.virtual('canAccessKeystone').get(function () {
	return this.isAdmin;
});


/**
 * Registration
 */
User.defaultColumns = 'name, role, team, isAdmin';
User.register();
