module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Prevent image resizing in JSX',
      category: 'Best Practices',
      recommended: true,
    },
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
        if (node.name.name !== 'img') {
          return;
        }

        const attributes = node.attributes;
        const hasResizingAttribute = attributes.some(attr => {
          if (!attr.name) return false;
          return ['width', 'height', 'style', 'className', 'class'].includes(attr.name.name);
        });

        if (hasResizingAttribute) {
          context.report({
            node,
            message: 'Avoid resizing images in JSX. Use CSS classes or external styling instead.',
          });
        }
      },
    };
  },
};
