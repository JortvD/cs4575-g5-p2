'use strict';

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'This is a test rule',
      category: 'Test',
      recommended: false,
    },
    schema: [] // No options
  },
  create(context) {
    return {
      Identifier(node) {
        if (node.name === 'test') {
          context.report({
            node,
            message: "Avoid naming variables 'test'.",
          });
        }
      },
    };
  },
};
