'use strict';

const rule = require('../../src/rules/avoid-canvas');
const ruleTester = require('../common').ruleTester;

ruleTester.run('avoid-canvas', rule, {
  valid: [
    // Valid image formats
    "const img = 'image.png';",
    "const path = 'assets/background.jpg';",
    "const image = 'https://example.com/image.webp';",
    
    // Non-canvas elements
    "document.createElement('div');",
    "const element = document.createElement('img');",
    
    // Other contexts not related to canvas
    "user.getContext();",
    "data.canvas = 'A painting';", 
  ],
  
  invalid: [
    // Canvas element creation tests
    {
      code: "const canvas = document.createElement('canvas');",
      errors: [{ message: 'Avoid using canvas elements for complex rendering as they can be CPU intensive. Consider using more efficient alternatives.' }]
    },
    
    // Canvas context tests
    {
      code: "const ctx = canvas.getContext('2d');",
      errors: [{ message: 'Canvas rendering contexts can cause performance issues. Use with caution and consider alternatives.' }]
    },
    {
      code: "const gl = canvasElement.getContext('webgl');",
      errors: [{ message: 'Canvas rendering contexts can cause performance issues. Use with caution and consider alternatives.' }]
    },
    
    // JSX canvas tests
    {
      code: "<canvas width='500' height='500'></canvas>",
      errors: [{ message: 'Avoid using canvas elements for complex rendering as they can be CPU intensive. Consider using more efficient alternatives.' }]
    },
    
  ]
});
