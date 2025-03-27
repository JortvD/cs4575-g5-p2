'use strict';

const rule = require('../../src/rules/multiple-console-log');
const ruleTester = require('../common').ruleTester;

ruleTester.run('multiple-console-log', rule, {
  valid: [
    {
      code: `console.log({test,foo,bar});`,
    },
    {
      code: `console.log('test');`,
    },
  ],
  
  invalid: [
    {
      code: `console.log(test);
      console.log(foo);
      console.log(bar);`,
      errors: [{ message: 'Avoid using multiple consecutive console.log() statements. Consider grouping them or removing unnecessary ones.' }]
    },
    {
      code: `console.log(test);
      console.log(bar);`,
      errors: [{ message: 'Avoid using multiple consecutive console.log() statements. Consider grouping them or removing unnecessary ones.' }]
    }
  ]
});
