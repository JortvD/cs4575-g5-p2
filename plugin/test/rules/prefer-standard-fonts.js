'use strict';

const rule = require('../../src/rules/prefer-standard-fonts');
const ruleTester = require('../common').ruleTester;

ruleTester.run('prefer-standard-fonts', rule, {
  valid: [
    // Standard fonts in style objects
    "const styles = { fontFamily: 'Arial, sans-serif' };",
    "const styles = { fontFamily: 'Helvetica, Arial, sans-serif' };",
    "element.style = { fontFamily: 'Georgia, serif' };",

    // Standard fonts in JSX
    "<div style={{ fontFamily: 'Verdana, sans-serif' }}></div>",
    "<Text style={{ fontFamily: 'monospace' }}>Code</Text>",

    // Importing standard fonts is fine – wrap the CSS in a variable assignment to avoid parsing errors.
    "const standardFontImport = \"@import url('https://fonts.googleapis.com/css2?family=Arial&display=swap');\";",

    // Variables are not checked (too complex)
    "const styles = { fontFamily: fontVariable };",
    "<div style={{ fontFamily: dynamicFont }}></div>"
  ],
  
  invalid: [
    // Non-standard fonts in style objects
    {
      code: "const styles = { fontFamily: 'Roboto, sans-serif' };",
      errors: [{ message: 'Consider using standard web-safe fonts instead of "Roboto" for better performance and consistent rendering.' }]
    },
    {
      code: "element.style = { fontFamily: 'Open Sans' };",
      errors: [{ message: 'Consider using standard web-safe fonts instead of "Open Sans" for better performance and consistent rendering.' }]
    },
    {
      code: "const theme = { typography: { fontFamily: 'Montserrat, sans-serif' } };",
      errors: [{ message: 'Consider using standard web-safe fonts instead of "Montserrat" for better performance and consistent rendering.' }]
    },
    
    // Non-standard fonts in JSX
    {
      code: "<div style={{ fontFamily: 'Lato, sans-serif' }}></div>",
      errors: [{ message: 'Consider using standard web-safe fonts instead of "Lato" for better performance and consistent rendering.' }]
    },
    
    // @font-face declarations
    {
      code: "const css = '@font-face { font-family: \"MyFont\"; src: url(\"myfont.woff\") }';",
      errors: [{ message: 'Consider using standard web-safe fonts instead of "MyFont" for better performance and consistent rendering.' }]
    },
    
  ]
});
