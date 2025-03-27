'use strict';

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Avoid using features that could make a page incompatible with bfcache',
      category: 'Best Practices',
      recommended: true,
    },
    schema: [] // No options
  },
  create(context) {
    return {
      // Check for unload and beforeunload event listeners
      CallExpression(node) {
        if (node.callee.property && node.callee.property.name === 'addEventListener') {
          if (node.arguments[0].value === 'unload' || node.arguments[0].value === 'beforeunload' ) {
            context.report({
              node,
              message: 'Avoid using events incompatible with the bfcache. Consider listening for the pagehide event instead.',
            });
          }
        }
      },
      // Check for link elements with target="_blank" without rel="noopener" or "noreferrer"
      JSXOpeningElement(node) {
        if (node.name.name !== 'a' && node.name.name !== 'area' && node.name.name !== 'form') return;

        let hasTargetBlank = false;
        let hasRelNoopener = false;
        let hasRelNoreferrer = false;
        let relAttribute = null;

        node.attributes.forEach((attr) => {
          // Check for target="_blank"
          if (attr.name && attr.name.name === 'target' && attr.value && attr.value.value === '_blank') {
            hasTargetBlank = true;
          }
          // Check for rel attribute
          if (attr.name && attr.name.name === 'rel') {
            relAttribute = attr;
            const relValues = attr.value && attr.value.value.split(/\s+/); // Split rel values into array
            hasRelNoopener = relValues.includes('noopener');
            hasRelNoreferrer = relValues.includes('noreferrer');
          }
        });

        if (hasTargetBlank && !(hasRelNoopener || hasRelNoreferrer)) {
          context.report({
            node,
            message: 'Consider including rel="noopener" or "noreferrer" when using target="_blank", to be compatible with bfcache and prevent security risks.',
          });
        }
      }
    };
  },
};
