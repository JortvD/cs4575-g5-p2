'use strict';

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Detect potential energy hotspots in React code',
      category: 'Performance',
      recommended: false
    },
    schema: [] // No options
  },
  create(context) {
    return {
      // Example: Flag inline arrow functions in JSX for onClick as potential hotspots.
      JSXAttribute(node) {
        if (
          node.name &&
          node.name.name === 'onClick' &&
          node.value &&
          node.value.expression &&
          node.value.expression.type === 'ArrowFunctionExpression'
        ) {
          context.report({
            node,
            message:
              'Potential energy hotspot: Inline arrow functions in JSX (onClick) can affect performance. Consider defining the function outside the render method.'
          });
        }
      }

      // Additional visitor methods can be added here to check for other energy hotspots.
    };
  }
};
