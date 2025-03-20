'use strict';

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Suggest using loading="lazy" on images and iframes',
      recommended: true,
    },
    schema: [] // No options
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
        const isImage = node.name.name === 'img';
        const isIframe = node.name.name === 'iframe';
        const hasLazyAttribute = node.attributes.some((attribute) => attribute.name.name === 'loading' && attribute.value.value === 'lazy');

        if ((isImage || isIframe) && !hasLazyAttribute) {
          context.report({
            node,
            message: `${isImage ? 'Images' : 'Iframes'} should have a loading attribute set to 'lazy'.`,
          });
        }
      }
    };
  },
};
