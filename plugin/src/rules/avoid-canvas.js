'use strict';

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Warn against using canvas elements due to power consumption concerns',
      recommended: true,
    },
    schema: [] // No options
  },
  create(context) {
    return {
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

    
    };
  }
};
