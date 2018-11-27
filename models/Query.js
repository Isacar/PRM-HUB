var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * User Model
 * ==========
 */
var Query = new keystone.List('Query');

Query.add({
	name: { type: Types.Text, required: true, index: true },
	owner: { type: Types.Relationship, ref: 'User', required: true, initial:true},
	description: { type: Types.Text, required: false},
	aprox_exec_minutes: { type: Types.Number},
	sql: { type: Types.Code, height: 180, language: 'json'},
	tags: { type: Types.TextArray , caseSensitive: false, mode: 'contains', presence: 'some', value: ''}
});

Query.schema.pre('save', function(next) {
	this.tags = this.tags.map(v => v.toLowerCase());
	next();
});
/**
 * Registration
 */
Query.defaultColumns = 'name';
Query.register();
