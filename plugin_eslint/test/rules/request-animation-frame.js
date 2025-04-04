'use strict';

const rule = require('../../src/rules/request-animation-frame');
const ruleTester = require('../common').ruleTester;

ruleTester.run('request-animation-frame', rule, {
  valid: [
    {
      code: `requestAnimationFrame(animate);
      function animate(timestamp) {
        const value = (timestamp - zero) / duration;
        if (value < 1) {
          element.style.opacity = value;
          requestAnimationFrame((t) => animate(t));
        } else element.style.opacity = 1;
      }`,
    },
    {
      code: `setInterval(() => {element.className === test;}, 1000);`,
    },
  ],
  
  invalid: [
    {
      code: "setInterval(() => {element.style.opacity = 1;}, 1000);",
      errors: [{ message: 'Avoid using setInterval for animations. Consider using requestAnimationFrame instead.' }]
    },
    {
      code: `setInterval(() => {
          position += 5;
          box.style.transform = \`translateX(\${position}px)\`;
        }, 16);`,
      errors: [{ message: 'Avoid using setInterval for animations. Consider using requestAnimationFrame instead.' }]
    }
  ]
});
