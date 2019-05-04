var keystone = require('keystone');
var Types = keystone.Field.Types;
/**
 * Resources Model
 * ==========
 */
var Resource = new keystone.List('Resource');

Resource.add({
	name: { type: Types.Text, required: true, index: true },
	owner: { type: Types.Relationship, ref: 'User', required: false, initial:false},
	url: { type: Types.Url, required: false},
	description: { type: Types.Text, required: false},
	tags: { type: Types.TextArray , caseSensitive: false, mode: 'contains', presence: 'some', value: ''},
	metrics: { type: Types.TextArray , caseSensitive: false, mode: 'contains', presence: 'some', value: ''}
});

Resource.schema.pre('save', function(next) {
	this.tags = this.tags.map(v => v.toLowerCase());
	next();
});
/**
 * Registration
 **/
Resource.defaultColumns = 'name';
Resource.register();
