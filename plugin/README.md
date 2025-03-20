# ESLint Plugin

## Steps for creating a new rule
1. Create a new file in the `src/rules` directory with the name of the rule. Here you can write the rule.
2. Add the rule to the `index.js` file.
3. Create a new file with the same name in the `test/rules` directory. Here you can add valid and invalid examples for that rule.
4. Import the file in the `test/test.js` file.

## Running the tests
Run `node test/test` to run the tests.