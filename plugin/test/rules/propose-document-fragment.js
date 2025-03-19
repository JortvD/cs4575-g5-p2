'use strict';

const rule = require('../../src/rules/propose-document-fragment');
const ruleTester = require('../common').ruleTester;

ruleTester.run("propose-document-fragment", rule, {
	valid: [
		{
			code: "document.appendChild(document.createElement('div'));",
		}
	],

	invalid: [
		{
			code: "while(true) { document.appendChild(document.createElement('div')); }",
			errors: [{ message: "Avoid using appendChild inside a loop. Consider using createDocumentFragment instead." }]
		},
	]
});