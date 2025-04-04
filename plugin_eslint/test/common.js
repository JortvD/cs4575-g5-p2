const RuleTester = require('eslint').RuleTester;

function CustomRuleTester(options) {
	const ruleTester = new RuleTester(options);

	const $run = ruleTester.run.bind(ruleTester);
	ruleTester.run = function (name, rule, tests) {
		console.log(`Running test suite ${name}. There are:`);
		console.log(`- ${tests.valid.length} valid tests`);
		console.log(`- ${tests.invalid.length} invalid tests`);
		try {
			$run(name, rule, tests);
		}
		catch (error) {
			console.error(`Error running test suite ${name}: ${error}`);
		}
	}

	return ruleTester;
}

module.exports = {
	ruleTester: new CustomRuleTester({
		parserOptions: { ecmaVersion: "latest", sourceType: 'module', ecmaFeatures: { jsx: true } },
	}),
}