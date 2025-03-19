'use strict';

const rule = require('../../src/rules/test');
const ruleTester = require('../common').ruleTester;

ruleTester.run("test", rule, {
    valid: [
        {
            code: "const foo = true;",
        }
    ],

    invalid: [
        {
            code: "const test = true;",
            errors: [{ message: "Avoid naming variables 'test'." }]
        },
    ]
});