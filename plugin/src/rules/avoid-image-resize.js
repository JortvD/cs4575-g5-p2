'use strict';

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Avoid resizing images in the browser as it can impact performance',
      recommended: true,
    },
    schema: [] // No options
  },
  create(context) {
    return {
      // Check img tags with explicit width/height attributes
      JSXOpeningElement(node) {
        if (node.name.name === 'img' || node.name.name === 'Image') {
          let hasWidth = false;
          let hasHeight = false;
          let hasSrcSet = false;
          let hasResponsiveProps = false;
          
          node.attributes.forEach(attr => {
            if (!attr.name) return;
            
            const attrName = attr.name.name;
            
            // Check for width/height attributes
            if (attrName === 'width' || attrName === 'height') {
              if (attrName === 'width') hasWidth = true;
              if (attrName === 'height') hasHeight = true;
            }
            
            // Check if the image is using responsive techniques
            if (attrName === 'srcSet' || attrName === 'srcset' || 
                attrName === 'sizes' || attrName === 'loading' ||
                attrName === 'max-width' || attrName === 'maxWidth') {
              hasResponsiveProps = true;
            }
            
            // Check if using srcSet which is a proper way to handle different sizes
            if (attrName === 'srcSet' || attrName === 'srcset') {
              hasSrcSet = true;
            }
            
            // Check for inline styles that might resize the image
            if (attrName === 'style' && 
                attr.value && 
                attr.value.expression && 
                attr.value.expression.type === 'ObjectExpression') {
              
              attr.value.expression.properties.forEach(prop => {
                if ((prop.key.name === 'width' || prop.key.name === 'height') &&
                    (prop.value.type === 'Literal' || 
                     (prop.value.type === 'TemplateLiteral' && prop.value.expressions.length === 0))) {
                  
                  if (prop.key.name === 'width') hasWidth = true;
                  if (prop.key.name === 'height') hasHeight = true;
                }
              });
            }
          });
          
          // If both width and height are specified and no responsive techniques are used
          if (hasWidth && hasHeight && !hasSrcSet && !hasResponsiveProps) {
            context.report({
              node,
              message: 'Avoid resizing images in the browser. Use properly sized images or responsive image techniques like srcSet and sizes.'
            });
          }
        }
      },
      
      // Check HTML img elements created via DOM methods
      CallExpression(node) {
        // Check document.createElement('img')
        if (
          node.callee.type === 'MemberExpression' &&
          node.callee.object.name === 'document' &&
          node.callee.property.name === 'createElement' &&
          node.arguments.length > 0 &&
          node.arguments[0].type === 'Literal' &&
          node.arguments[0].value === 'img'
        ) {
          // Mark this node for potential later analysis
          // This is a simple approach; a complete solution would track the element
          // and check if width/height are set later
          context.report({
            node,
            message: 'Ensure images created with document.createElement are properly sized to avoid browser resizing.'
          });
        }
      },
      
      // Check style properties that might be applied to images
      Property(node) {
        if ((node.key.name === 'width' || node.key.name === 'height') &&
            node.parent && 
            node.parent.type === 'ObjectExpression') {
          
          // Check if this property is in an object that's likely styling an image
          const objectExpr = node.parent;
          const parent = objectExpr.parent;
          
          if (parent && 
              ((parent.type === 'VariableDeclarator' && parent.id.name && parent.id.name.toLowerCase().includes('image')) ||
               (parent.type === 'Property' && parent.key.name && parent.key.name.toLowerCase().includes('image')))) {
            
            context.report({
              node,
              message: 'Consider using properly sized images instead of resizing them with CSS properties.'
            });
          }
        }
      }
    };
  }
};
