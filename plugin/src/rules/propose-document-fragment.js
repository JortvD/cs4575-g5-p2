'use strict';

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Propose using createDocumentFragment instead of adding children multiple times',
      category: 'Test',
      recommended: true,
    },
    schema: [] // No options
  },
  create(context) {
    return {
      CallExpression(node) {
        if (node.callee.property && node.callee.property.name === 'appendChild') {
          let current = node;

          while (current) {
            if (current.type === 'ForStatement' || current.type === 'WhileStatement') {
              context.report({
                node,
                message: 'Avoid using appendChild inside a loop. Consider using createDocumentFragment instead.',
              });
              break;
            }
            current = current.parent;
          }
        }
      }
    };
  },
};
