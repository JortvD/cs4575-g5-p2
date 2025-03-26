'use strict';

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Disallow multiple Img components inside a single component',
      category: 'Best Practices',
      recommended: false,
    },
    schema: [] // No options
  },
  create(context) {
    // Array to collect all <Img> JSX elements
    const imgNodes = [];

    return {
      // Visit every JSXElement node in the AST.
      JSXElement(node) {
        // Check if the opening element has a name "Img"
        if (
          node.openingElement &&
          node.openingElement.name &&
          node.openingElement.name.name === 'Img'
        ) {
          imgNodes.push(node);
        }
      },
      // Once the whole file is traversed, check if multiple images were found.
      'Program:exit': function () {
        if (imgNodes.length > 1) {
          imgNodes.forEach((node) => {
            const line = node.loc.start.line;
            context.report({
              node,
              message: `Multiple Img components found: 'Img' at line ${line}`,
            });
          });
        }
      },
    };
  },
};
