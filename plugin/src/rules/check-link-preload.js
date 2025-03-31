'use strict';

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Ensure proper usage of link preload for performance optimization',
      recommended: true,
    },
    schema: [] // No options
  },
  create(context) {
    return {
      // Check JSX link elements with rel="preload"
      JSXOpeningElement(node) {
        if (node.name.name === 'link') {
          const relAttribute = node.attributes.find(
            attr => attr.type === 'JSXAttribute' && attr.name.name === 'rel'
          );
          
          if (relAttribute && relAttribute.value && 
              relAttribute.value.type === 'Literal' && 
              relAttribute.value.value === 'preload') {
            
            // Check if 'as' attribute is specified
            const asAttribute = node.attributes.find(
              attr => attr.type === 'JSXAttribute' && attr.name.name === 'as'
            );
            
            if (!asAttribute) {
              context.report({
                node,
                message: 'Link preload must specify an "as" attribute to indicate the resource type.'
              });
            }
            
            // Check if href attribute is present
            const hrefAttribute = node.attributes.find(
              attr => attr.type === 'JSXAttribute' && attr.name.name === 'href'
            );
            
            if (!hrefAttribute) {
              context.report({
                node,
                message: 'Link preload must specify an "href" attribute with the resource URL.'
              });
            }
          }
        }
      },
      
      // Check DOM API for link preload creation
      CallExpression(node) {
        // Check for document.createElement('link')
        if (
          node.callee.type === 'MemberExpression' &&
          node.callee.object.name === 'document' &&
          node.callee.property.name === 'createElement' &&
          node.arguments.length > 0 &&
          node.arguments[0].type === 'Literal' &&
          node.arguments[0].value === 'link'
        ) {
          // Flag potential preload usage for manual review
          context.report({
            node,
            message: 'If using this link for preload, ensure you set rel="preload" and include an appropriate "as" attribute.'
          });
        }
      },
      
      // Check for setAttribute calls that set rel="preload"
      MemberExpression(node) {
        if (
          node.property.name === 'setAttribute' &&
          node.parent &&
          node.parent.type === 'CallExpression' &&
          node.parent.arguments.length >= 2 &&
          node.parent.arguments[0].type === 'Literal' &&
          node.parent.arguments[0].value === 'rel' &&
          node.parent.arguments[1].type === 'Literal' &&
          node.parent.arguments[1].value === 'preload'
        ) {
          context.report({
            node: node.parent,
            message: 'When using link preload, ensure you also set the "as" attribute to indicate resource type.'
          });
        }
      }
    };
  }
};
