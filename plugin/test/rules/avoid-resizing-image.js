const rule = require('../../src/rules/avoid-resizing-image');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
});

ruleTester.run('avoid-resizing-image', rule, {
  valid: [
    {
      code: '<img src="image.jpg" alt="test" />',
    },
    {
      code: '<img src="image.jpg" alt="test" className="my-image" />',
    },
  ],
  invalid: [
    {
      code: '<img src="image.jpg" width="100" height="100" alt="test" />',
      errors: [{
        message: 'Avoid resizing images in JSX. Use CSS classes or external styling instead.',
      }],
    },
    {
      code: '<img src="image.jpg" style={{ width: "100px", height: "100px" }} alt="test" />',
      errors: [{
        message: 'Avoid resizing images in JSX. Use CSS classes or external styling instead.',
      }],
    },
    {
      code: '<img src="image.jpg" width="100" alt="test" />',
      errors: [{
        message: 'Avoid resizing images in JSX. Use CSS classes or external styling instead.',
      }],
    },
  ],
}); 