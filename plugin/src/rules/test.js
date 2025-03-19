'use strict';

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'This is a test rule',
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
