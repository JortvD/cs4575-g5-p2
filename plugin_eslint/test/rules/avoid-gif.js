const rule = require('../../src/rules/avoid-gif');
const ruleTester = require('../common').ruleTester;

ruleTester.run('avoid-gif', rule, {
	valid: [
		{
			code: '<img src="image.png" alt="example" />',
			filename: 'test.js',
		},
		{
			code: 'import image from "./image.jpg";',
			filename: 'test.js',
		},
		{
			code: '<img src="image.jpeg" alt="example" />',
			filename: 'test.js',
		},
	],
	invalid: [
		{
			code: '<img src="image.gif" alt="example" />',
			filename: 'test.js',
			errors: [{ message: 'Avoid using GIF files. Consider using modern formats like WebP or MP4.' }],
		},
		{
			code: '<img src="image.GIF" alt="example" />',
			filename: 'test.js',
			errors: [{ message: 'Avoid using GIF files. Consider using modern formats like WebP or MP4.' }],
		},
		{
			code: 'import gifImage from "./image.gif";',
			filename: 'test.js',
			errors: [{ message: 'Avoid using GIF files. Consider using modern formats like WebP or MP4.' }],
		},
		{
			code: 'import gifImage from "./image.GIF";',
			filename: 'test.js',
			errors: [{ message: 'Avoid using GIF files. Consider using modern formats like WebP or MP4.' }],
		},
	],
});