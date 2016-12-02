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
	 * Intialization function.
	 * Checks for dependencies, etc.
	 * Prints out some information.
	 */
	initializing: function() {
		this.log(
			'Thank you for using the frontend-boilerplate yeoman generator.\n'
			+ 'For more information checkout the generator\'s repository: https://gitlab.com/jdoubleu/frontend-boilerplate-generator'
			+ '\n'
			+ 'And the boilerplate: https://gitlab.com/jdoubleu/frontend-boilerplate'
			+ '\n'
		)
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
					name: 'version',
					message: 'version',
					default: '0.1.0',
					validate: (input) => {
						const semver = require('semver');

						if(!semver.valid(input))
							return "Please provide a valid version. This has to be valid against node-semver.";

						return true;
					}
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
					validate: (input) => {
						if(input == "")
							return "Please provide an author.";

						if(!this._getAuthorName(input) || !this._getAuthorMail(input))
							return "Please provide a valid format (e.g. John Doe <mail@jd.com>)";

						if(!this._getAuthorMail(input).includes('@'))
							return "Please provide a valid email";

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
			this.templatePath('static/_.bowerrc'),
			this.destinationPath('.bowerrc')
		);

		// gulpfile.js
		this.fs.copyTpl(
			this.templatePath('_gulpfile.js'),
			this.destinationPath('gulpfile.js'),
			tp
		);

		// .editorconfig
		if(tp.editorconfig)
			this.fs.copy(
				this.templatePath('static/_.editorconfig'),
				this.destinationPath('.editorconfig')
			);

		// .sass-lint.yml & .eslintrc
		if(tp.sasslinting)
			this.fs.copy(
				this.templatePath('static/_.sass-lint.yml'),
				this.destinationPath('.sass-lint.yml')
			);
		if(tp.es6linting)
			this.fs.copy(
				this.templatePath('static/_.eslintrc'),
				this.destinationPath('.eslintrc')
			);

		// .gitlab-ci.yml
		if(tp.gitlabci)
			this.fs.copyTpl(
				this.templatePath('_.gitlab-ci.yml.ejs'),
				this.destinationPath('.gitlab-ci.yml'),
				tp
			);

		// .gitignore
		this.fs.copy(
			this.templatePath('static/_.gitignore'),
			this.destinationPath('.gitignore')
		);

		// README.md
		this.fs.copyTpl(
			this.templatePath('_README.md.ejs'),
			this.destinationPath('README.md'),
			tp
		);

		// theme's dist folders
		this.fs.write('assets/dist/images/.gitkeep', '');
		this.fs.write('assets/dist/fonts/.gitkeep', '');
	},

	/**
	 * Installation function
	 */
	install: function() {
		// Install npm dependencies (this also compiles existing files on first run)
		this.npmInstall();
		// Install bower dependencies (this might be empty on first run)
		this.bowerInstall();
	},

	/**
	 * This function gets called last.
	 * Print out some information
	 */
	end: function() {
		this.log(
			'\n'
			+ 'Everything is up!\n'
			+ 'You can run `npm start` or `gulp default` to watch for styles or scripts file changes and auto-compiling'
			+ '\n\n'
			+ 'Happy coding!'
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
