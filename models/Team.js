var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * User Model
 * ==========
 */
var Team = new keystone.List('Team');

Team.add({
	name: { type: String, required: true, index: true }
});


/**
 * Registration
 */
Team.defaultColumns = 'name';
Team.register();
