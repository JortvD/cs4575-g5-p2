'use strict';

const rule = require('../../src/rules/respect-bf-cache');
const ruleTester = require('../common').ruleTester;

ruleTester.run('respect-bf-cache', rule, {
  valid: [
    {
      code: "window.addEventListener('pagehide', function() { console.log('test'); });",
    },
    {
      code: '<a href="https://example.com" target="_blank" rel="noopener noreferrer">Secure Link</a>',
    },
    {
      code: '<a href="https://example.com">No target="_blank"</a>',
    },
    {
      code: '<area shape="rect" coords="34,44,270,350" href="https://example.com" target="_blank" rel="noopener "/>',
    },
    {
      code: '<form rel="noreferrer" action="mypage.php"> </form>',
    },

  ],
  
  invalid: [
    // Using unload event listener
    {
      code: "window.addEventListener('unload', function() { console.log('test'); });",
      errors: [{ message: 'Avoid using events incompatible with the bfcache. Consider listening for the pagehide event instead.' }]
    },
    // Using beforeunload event listener
    {
      code: "window.addEventListener('beforeunload', function() { console.log('test'); });",
      errors: [{ message: 'Avoid using events incompatible with the bfcache. Consider listening for the pagehide event instead.' }]
    },
    // Using target="_blank" without rel="noopener" or "noreferrer"
    {
      code: '<a href="https://example.com" target="_blank">Missing rel </a>',
      errors: [{ message: 'Consider including rel="noopener" or "noreferrer" when using target="_blank", to be compatible with bfcache and prevent security risks.' }]
    },
    {
      code: '<area href="https://example.com" target="_blank" rel="nofollow">Missing rel </area>',
      errors: [{ message: 'Consider including rel="noopener" or "noreferrer" when using target="_blank", to be compatible with bfcache and prevent security risks.' }]
    }
  ]
});
