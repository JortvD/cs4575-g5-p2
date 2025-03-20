'use strict';

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Suggest using IntersectionObserver instead of scroll events',
      recommended: true,
    },
    schema: [] // No options
  },
  create(context) {
    return {
      CallExpression(node) {
        if (node.callee.property && node.callee.property.name === 'addEventListener') {
          if (node.arguments[0].value === 'scroll') {
            context.report({
              node,
              message: 'Avoid using scroll events. Consider using IntersectionObserver instead.',
            });
          }
        }
      }
    };
  },
};
