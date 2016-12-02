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

	/**
	 * User Settings. Prompts the user to fill the data.
	 * @returns {Promise.<TResult>}
	 */
	prompting: function() {
		return this.prompt(
			[
				{
					type: 'input',
					name: 'name',
					message: 'Project name',
					default: process.cwd().split(path.sep).pop()
				},
				{
					type: 'input',
					name: 'desc',
					message: 'description'
				},
				{
					type: 'input',
					name: 'author',
					message: 'author',
					validate: function(input) {
						if(input == "")
							return "Please provide an author.";

						let name = input.match(/^([^\(<]+)/),
							mail = input.match(/<([^>]+)>/);
						if(!name || !name[1].trim() || !mail || !mail[1].trim())
							return "Please provide a valid format (e.g. John Doe <mail@jd.com>)";

						return true;
					}
				},
				{
					type: 'input',
					name: 'license',
					message: 'license',
					default: 'Unlicense',
					validate: function(input) {
						let spdx = require('spdx-expression-validate');
						return spdx(input) ? true : 'Please enter a valid SPDX license format'
					}
				},
				{
					type: 'confirm',
					name: 'sasslinting',
					message: 'Do you want to add sass linting tasks?',
					default: true,
					store: true
				},
				{
					type: 'confirm',
					name: 'es6linting',
					message: 'Do you want to add es6 linting tasks?',
					default: true,
					store: true
				},
				{
					type: 'confirm',
					name: 'gitlabci',
					message: 'Do you want to add a GitLab CI config?',
					default: true,
					store: true
				},
				{
					type: 'confirm',
					name: 'editorconfig',
					message: 'Do you want to add an editorconfig?',
					default: true,
					store: true
				}
			]
		).then((props) => {
			this.props = props;
		});
	},

	/**
	 * Generates all files
	 */
	writing: function() {
		// Store properties in an extra variable
		let tp = this.props;
		// Extend the extra variable with lodash functions
		tp._ = _;
		// Add all helper functions of this generator to extra variable
		tp.s = {
			getAuthorName: this._getAuthorName,
			getAuthorMail: this._getAuthorMail,
			uppercc: this._uppercc
		};

		// package.json
		this.fs.copyTpl(
			this.templatePath('_package.json'),
			this.destinationPath('package.json'),
			tp
		);

		// bower.json & .bowerrc
		this.fs.copyTpl(
			this.templatePath('_bower.json'),
			this.destinationPath('bower.json'),
			tp
		);
		this.fs.copy(
			this.templatePath('static/_.bowerrc.ejs'),
			this.destinationPath('.bowerrc')
		);

		// gulpfile.js
		this.fs.copyTpl(
			this.templatePath('_gulpfile.js'),
			this.destinationPath('gulpfile.js'),
			tp
		);
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
