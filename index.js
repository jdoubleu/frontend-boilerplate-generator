/**
 * Main Generator
 *
 * Bootstraps a project based on theme-boilerplate
 */

const generators = require('yeoman-generator');
const _ = require('lodash');
const os = require('os');
const path = require('path');

module.exports = generators.Base.extend({

	/**
	 * Constructor
	 *
	 * Initializes this generator
	 */
	constructor: function() {
		// Calling the super constructor is important so our generator is correctly set up
		generators.Base.apply(this, arguments);
	},

	/*
	 * ---------------------- Helper functions ----------------------
	 */

	/**
	 * Converts a string to UpperCamelCase (aka. PascalCase)
	 * @return String
	 */
	_uppercc: function(string) {
		return _.upperFirst(_.camelCase(string));
	},

	/**
	 * Returns the name of an author string
	 *
	 * @param author author string (e.g. John Doe <jd@example.com>)
	 * @returns String
	 * @private
	 */
	_getAuthorName(author) {
		let name = author.match(/^([^\(<]+)/);
		return (name && name[1]) ? name[1].trim() : "";
	},

	/**
	 * Returns the email of an author string
	 *
	 * @param author author string (e.g. John Doe <jd@example.com>)
	 * @returns String
	 * @private
	 */
	_getAuthorMail(author) {
		let mail = author.match(/<([^>]+)>/);
		return (mail && mail[1]) ? mail[1].trim() : "";
	}
});
