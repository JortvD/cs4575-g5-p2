'use strict';

const rule = require('../../src/rules/repeated-expensive-identifiers');
const ruleTester = require('../common').ruleTester;

ruleTester.run("repeated-expensive-identifiers", rule, {
	valid: [
		{
			code: "document.body.getBoundingClientRect();",
		},
		{
			code: "function foo() { document.body.getBoundingClientRect(); }",
		},
		{
			code: "function foo() { document.body.getBoundingClientRect(); document.getBoundingClientRect(); }",
		}
	],
	invalid: [
		{
			code: "while(true) { document.body.getBoundingClientRect(); }",
			errors: [{ message: "Avoid calling expensive method \"getBoundingClientRect\" inside a loop. Consider caching the result outside the loop." }]
		},
		{
			code: "function foo() { document.body.getBoundingClientRect(); document.body.getBoundingClientRect(); }",
			errors: [
				{ message: "The method \"getBoundingClientRect\" is called multiple times within the same function. Consider caching the result to improve performance." },
				{ message: "The method \"getBoundingClientRect\" is called multiple times within the same function. Consider caching the result to improve performance." }
			]
		}
	]
});