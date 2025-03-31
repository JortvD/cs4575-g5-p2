'use strict';

const { RuleTester } = require('eslint');
const rule = require('../../src/rules/avoid-gif-canvas');

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  }
});

ruleTester.run('avoid-gif-canvas', rule, {
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
    "data.canvas = 'A painting';", // Not actually using canvas for rendering
  ],
  
  invalid: [
    // GIF detection tests
    {
      code: "const img = 'animation.gif';",
      errors: [{ message: 'Avoid using GIF images as they can be performance intensive. Consider using optimized formats like WebP or short videos instead.' }]
    },
    {
      code: "const path = 'assets/loading.GIF';",
      errors: [{ message: 'Avoid using GIF images as they can be performance intensive. Consider using optimized formats like WebP or short videos instead.' }]
    },
    {
      code: "image.src = 'https://example.com/animation.gif';",
      errors: [{ message: 'Avoid using GIF images as they can be performance intensive. Consider using optimized formats like WebP or short videos instead.' }]
    },
    
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
    
    // Canvas identifier tests
    {
      code: "const canvas = getDrawingArea();",
      errors: [{ message: 'Avoid using canvas for rendering as it can be performance intensive.' }]
    },
    {
      code: "element.canvas = setupCanvas();",
      errors: [{ message: 'Avoid using canvas for rendering as it can be performance intensive.' }]
    }
  ]
});
