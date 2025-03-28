module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Suggest using requestAnimationFrame instead of setInterval for animations',
      recommended: false,
    },
    schema: [], // No options
  },
  create(context) {
    return {
      CallExpression(node) {
        if (
          node.callee.name === "setInterval" && 
          node.arguments.length > 0) {
          
          const callback = node.arguments[0];

          if (callback.type === "ArrowFunctionExpression" || callback.type === "FunctionExpression") {
            context.sourceCode.getScope(node).through.forEach(reference => {
              // Check if we are referencing the style property of an element inside setInterval
              if (
                reference.identifier.parent &&
                reference.identifier.parent.type === "MemberExpression" &&
                reference.identifier.parent.property.name === "style"
              ) {
                context.report({
                  node,
                  message: 'Avoid using setInterval for animations. Consider using requestAnimationFrame instead.',
                });
              }
            });
          }
        }
      }
    };
  }
};