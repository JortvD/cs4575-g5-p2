const RuleTester = require('eslint').RuleTester;

module.exports = {
	ruleTester: new RuleTester({
		parserOptions: { ecmaVersion: "latest", sourceType: 'module' },
	}),
}