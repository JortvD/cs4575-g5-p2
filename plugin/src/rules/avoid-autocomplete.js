'use strict';

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Warns against using autocomplete components',
      recommended: true,
    },
    schema: [] // No options
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
        if (node.name.name === 'Autocomplete') {
          context.report({
            node,
            message: 'consider replacing Autocomplete component with a normal TextField or input element'
          });
        }
      },
      
      // CallExpression(node) {
      //   // Check document.createElement('input')
      //   if (
      //     node.callee.type === 'MemberExpression' &&
      //     node.callee.object.name === 'document' &&
      //     node.callee.property.name === 'createElement' &&
      //     node.arguments.length > 0 &&
      //     node.arguments[0].type === 'Literal' &&
      //     node.arguments[0].value === 'input'
      //   ) {
      //     context.report({
      //       node,
      //       message: 'Remember to set autocomplete="off" on programmatically created input elements'
      //     });
      //   }
      // },
    };
  }
};
