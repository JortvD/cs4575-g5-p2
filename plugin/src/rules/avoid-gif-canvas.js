'use strict';

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Warn against using GIF images and canvas elements due to performance concerns',
      recommended: true,
    },
    schema: [] // No options
  },
  create(context) {
    return {
      // Check for string literals containing .gif
      Literal(node) {
        if (typeof node.value === 'string' && node.value.toLowerCase().endsWith('.gif')) {
          context.report({
            node,
            message: 'Avoid using GIF images as they can be performance intensive. Consider using optimized formats like WebP or short videos instead.'
          });
        }
      },

      // Check for canvas element creation in DOM methods
      CallExpression(node) {
        // Check document.createElement('canvas')
        if (
          node.callee.type === 'MemberExpression' &&
          node.callee.object.name === 'document' &&
          node.callee.property.name === 'createElement' &&
          node.arguments.length > 0 &&
          node.arguments[0].type === 'Literal' &&
          node.arguments[0].value === 'canvas'
        ) {
          context.report({
            node,
            message: 'Avoid using canvas elements for complex rendering as they can be CPU intensive. Consider using more efficient alternatives.'
          });
        }

        // Check for getContext('2d') or getContext('webgl')
        if (
          node.callee.type === 'MemberExpression' &&
          node.callee.property.name === 'getContext' &&
          node.arguments.length > 0
        ) {
          context.report({
            node,
            message: 'Canvas rendering contexts can cause performance issues. Use with caution and consider alternatives.'
          });
        }
      },

      // Check for JSX canvas elements
      JSXOpeningElement(node) {
        if (node.name.name === 'canvas') {
          context.report({
            node,
            message: 'Avoid using canvas elements for complex rendering as they can be CPU intensive. Consider using more efficient alternatives.'
          });
        }
      },

      // Check for canvas identifier
      Identifier(node) {
        if (node.name === 'canvas' || node.name === 'Canvas') {
          const parent = node.parent;
          
          // Skip reporting in specific cases that are handled by other rules
          
          // 1. Skip if it's part of document.createElement('canvas')
          if (
            parent.type === 'VariableDeclarator' && 
            parent.id === node && 
            parent.init && 
            parent.init.type === 'CallExpression' &&
            parent.init.callee.type === 'MemberExpression' &&
            parent.init.callee.object.name === 'document' &&
            parent.init.callee.property.name === 'createElement'
          ) {
            return;
          }
          
          // 2. Skip if it's the object in a getContext call
          if (
            parent.type === 'MemberExpression' && 
            parent.object === node &&
            parent.property.name === 'getContext' &&
            parent.parent &&
            parent.parent.type === 'CallExpression' &&
            parent.parent.callee === parent
          ) {
            return;
          }
          
          // 3. Skip if it's a property name like data.canvas = 'A painting'
          if (
            parent.type === 'MemberExpression' && 
            parent.property === node
          ) {
            return;
          }
          
          // Report all other canvas identifiers, especially variable declarations
          // like: const canvas = getDrawingArea();
          context.report({
            node,
            message: 'Avoid using canvas for rendering as it can be performance intensive.'
          });
        }
      }
    };
  }
};
