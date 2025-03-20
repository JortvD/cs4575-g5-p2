'use strict';

const rule = require('../../src/rules/intersection-observer');
const ruleTester = require('../common').ruleTester;

ruleTester.run("intersection-observer", rule, {
    valid: [
        {
            code: "window.addEventListener('click', function() { console.log('clicking'); });",
        }
    ],

    invalid: [
        {
            code: "window.addEventListener('scroll', function() { console.log('scrolling'); });",
            errors: [{ message: "Avoid using scroll events. Consider using IntersectionObserver instead." }]
        },
    ]
});