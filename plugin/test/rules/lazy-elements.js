'use strict';

const rule = require('../../src/rules/lazy-elements');
const ruleTester = require('../common').ruleTester;

ruleTester.run("lazy-elements", rule, {
    valid: [
        {
            code: "<img src='image.jpg' loading='lazy' />",
        },
        {
            code: "<iframe src='video.mp4' loading='lazy' />",
        }
    ],

    invalid: [
        {
            code: "<img src='image.jpg' />",
            errors: [{ message: "Images should have a loading attribute set to 'lazy'." }]
        },
        {
            code: "<iframe src='video.mp4' />",
            errors: [{ message: "Iframes should have a loading attribute set to 'lazy'." }]
        },
    ]
});