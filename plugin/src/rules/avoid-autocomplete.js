'use strict';

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Warns against using autocomplete on form fields',
      recommended: true,
    },
    schema: [] // No options
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
        if (node.name.name === 'input') {
          // Check if autocomplete is explicitly turned off
          const autocompleteAttr = node.attributes.find(
            attr => attr.type === 'JSXAttribute' && attr.name.name === 'autoComplete'
          );
          
          if (!autocompleteAttr) {
            context.report({
              node,
              message: 'Input field should have autoComplete="off"'
            });
          } else if (
            autocompleteAttr.value &&
            autocompleteAttr.value.type === 'Literal' &&
            autocompleteAttr.value.value !== 'off'
          ) {
            context.report({
              node,
              message: 'Input field should have autoComplete="off"'
            });
          }
        } else if (node.name.name === 'form') {
          // Check form elements for autocomplete attribute
          const autocompleteAttr = node.attributes.find(
            attr => attr.type === 'JSXAttribute' && attr.name.name === 'autoComplete'
          );
          
          if (!autocompleteAttr) {
            context.report({
              node,
              message: 'Form should have autoComplete="off"'
            });
          } else if (
            autocompleteAttr.value &&
            autocompleteAttr.value.type === 'Literal' &&
            autocompleteAttr.value.value !== 'off'
          ) {
            context.report({
              node,
              message: 'Form should have autoComplete="off"'
            });
          }
        }
      },
      
      // Check DOM API for input creation
      CallExpression(node) {
        // Check document.createElement('input')
        if (
          node.callee.type === 'MemberExpression' &&
          node.callee.object.name === 'document' &&
          node.callee.property.name === 'createElement' &&
          node.arguments.length > 0 &&
          node.arguments[0].type === 'Literal' &&
          node.arguments[0].value === 'input'
        ) {
          context.report({
            node,
            message: 'Remember to set autocomplete="off" on programmatically created input elements'
          });
        }
      },
      
      // Check for setAttribute calls that might be setting autocomplete
      MemberExpression(node) {
        if (
          node.property.name === 'setAttribute' &&
          node.parent &&
          node.parent.type === 'CallExpression' &&
          node.parent.arguments.length >= 2 &&
          node.parent.arguments[0].type === 'Literal' &&
          node.parent.arguments[0].value === 'autocomplete' &&
          (node.parent.arguments[1].type !== 'Literal' ||
            node.parent.arguments[1].value !== 'off')
        ) {
          context.report({
            node: node.parent,
            message: 'Set autocomplete="off" for better energy usage'
          });
        }
      }
    };
  }
};
