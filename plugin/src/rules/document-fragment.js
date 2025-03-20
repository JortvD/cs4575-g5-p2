'use strict';

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Suggest using createDocumentFragment instead of adding children multiple times',
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
          let isInsideLoop = false;

          while (current) {
            if (!loopTypes.includes(current.type)) {
              current = current.parent;
              continue;
            }

            isInsideLoop = true;
            break;
          }

          if (!isInsideLoop) {
            return;
          }

          context.report({
            node,
            message: 'Avoid using appendChild inside a loop. Consider using createDocumentFragment instead.',
          });
        }
      }
    };
  },
};
