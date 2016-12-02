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
});
