'use strict';

const rule = require('../../src/rules/avoid-image-resize');
const ruleTester = require('../common').ruleTester;

ruleTester.run('avoid-image-resize', rule, {
  valid: [
    // Images without explicit sizing
    "<img src='image.jpg' alt='description' />",
    
    // Images with responsive techniques
    "<img src='image.jpg' srcSet='image-1x.jpg 1x, image-2x.jpg 2x' alt='description' />",
    "<img src='image.jpg' sizes='(max-width: 600px) 480px, 800px' srcset='image-480.jpg 480w, image-800.jpg 800w' alt='description' />",
    
    // Images with responsive loading
    "<img src='image.jpg' loading='lazy' alt='description' />",
    
    // Images with only width or only height (aspect ratio preserved)
    "<img src='image.jpg' width='500' alt='description' />",
    "<img src='image.jpg' height='300' alt='description' />",
    
    // Non-img elements
    "<div width='500' height='300'></div>",
    
    // Styles not applied to images
    "const divStyle = { width: '100%', height: '200px' };"
  ],
  
  invalid: [
    // Images with both width and height explicitly set
    {
      code: "<img src='image.jpg' width='500' height='300' alt='description' />",
      errors: [{ message: 'Avoid resizing images in the browser. Use properly sized images or responsive image techniques like srcSet and sizes.' }]
    },
    
    // Images with style-based resizing
    {
      code: "<img src='image.jpg' style={{ width: '500px', height: '300px' }} alt='description' />",
      errors: [{ message: 'Avoid resizing images in the browser. Use properly sized images or responsive image techniques like srcSet and sizes.' }]
    },
    
    // Image creation with document.createElement
    {
      code: "const img = document.createElement('img');",
      errors: [{ message: 'Ensure images created with document.createElement are properly sized to avoid browser resizing.' }]
    },
  ]
});
