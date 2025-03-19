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

          const loopTypes = ['ForStatement', 'WhileStatement'];

          while (current) {
            if (!loopTypes.includes(current.type)) {
              current = current.parent;
  
              continue;
            }

            context.report({
              node,
              message: 'Avoid using appendChild inside a loop. Consider using createDocumentFragment instead.',
            });

            break;
          }
        }
      }
    };
  },
};
