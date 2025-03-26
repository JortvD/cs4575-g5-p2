'use strict';

const STANDARD_FONTS = [
  'Arial', 'Helvetica', 'Times New Roman', 'Times', 'Courier New', 'Courier',
  'Verdana', 'Georgia', 'Palatino', 'Garamond', 'Bookman', 'Tahoma',
  'Trebuchet MS', 'Arial Black', 'Impact', 'sans-serif', 'serif', 'monospace'
];

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Encourage the use of standard web-safe fonts for better performance',
      recommended: true,
    },
    schema: [] // No options
  },
  create(context) {
    return {
      // Check CSS font-family in style attributes
      JSXAttribute(node) {
        if (
          node.name.name === 'style' &&
          node.value && 
          node.value.type === 'Literal' && 
          typeof node.value.value === 'string'
        ) {
          const styleValue = node.value.value;
          if (styleValue.includes('font-family')) {
            const nonStandardFont = checkForNonStandardFonts(styleValue);
            if (nonStandardFont) {
              context.report({
                node,
                message: `Consider using standard web-safe fonts instead of "${nonStandardFont}" for better performance and consistent rendering.`
              });
            }
          }
        }
      },
      
      // Check string literals that might contain font names
      Literal(node) {
        if (typeof node.value === 'string') {
          // Look for CSS-like patterns in strings
          if (node.value.includes('font-family') || node.value.includes('font:')) {
            const nonStandardFont = checkForNonStandardFonts(node.value);
            if (nonStandardFont) {
              context.report({
                node,
                message: `Consider using standard web-safe fonts instead of "${nonStandardFont}" for better performance and consistent rendering.`
              });
            }
          }
        }
      },
      
      // Check object expressions that might be setting CSS styles
      Property(node) {
        if (
          node.key && 
          (node.key.name === 'fontFamily' || node.key.value === 'fontFamily' || 
           node.key.name === 'font' || node.key.value === 'font')
        ) {
          if (node.value.type === 'Literal' && typeof node.value.value === 'string') {
            const nonStandardFont = checkForNonStandardFonts(node.value.value);
            if (nonStandardFont) {
              context.report({
                node,
                message: `Consider using standard web-safe fonts instead of "${nonStandardFont}" for better performance and consistent rendering.`
              });
            }
          }
        }
      }
    };
  }
};

// Helper function to check for non-standard fonts
function checkForNonStandardFonts(text) {
  // Extract font names from the text
  const fontFamilyMatch = text.match(/font-family\s*:\s*([^;]+)/i);
  const fontMatch = text.match(/font\s*:\s*([^;]+)/i);
  
  let fontDeclaration = '';
  if (fontFamilyMatch && fontFamilyMatch[1]) {
    fontDeclaration = fontFamilyMatch[1];
  } else if (fontMatch && fontMatch[1]) {
    // Extract just the font-family part from a full font declaration
    fontDeclaration = fontMatch[1];
  } else {
    // Might be a direct font name
    fontDeclaration = text;
  }
  
  // Split fonts and clean up
  const fontNames = fontDeclaration
    .split(',')
    .map(font => font.trim().replace(/["']/g, ''));
  
  // Check if any font is non-standard
  for (const fontName of fontNames) {
    // Skip CSS variables and system font keywords
    if (fontName.startsWith('var(') || fontName === 'inherit' || 
        fontName === 'initial' || fontName === 'unset' || fontName === 'system-ui') {
      continue;
    }
    
    // Check if it's not in our standard fonts list
    if (!STANDARD_FONTS.some(standardFont => 
      fontName.toLowerCase() === standardFont.toLowerCase())) {
      return fontName;
    }
  }
  
  return null;
}
