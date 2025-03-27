'use strict';

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Detect multiple consecutive console.log() calls',
      category: 'Best Practices',
      recommended: false,
    },
    schema: [], // No options
  },
  create(context) {
    return {
      Program(node) {
        let consecutiveLogs = 0; 

        node.body.forEach((statement, index, statements) => {
          if (
            statement.type === 'ExpressionStatement' &&
            statement.expression.type === 'CallExpression' &&
            statement.expression.callee.type === 'MemberExpression' &&
            statement.expression.callee.object.name === 'console' &&
            statement.expression.callee.property.name === 'log'
          ) {
            consecutiveLogs++;

            // Check if there are at least 2 consecutive console.log statements
            if (consecutiveLogs >= 2) {
              context.report({
                node: statement,
                message: 'Avoid using multiple consecutive console.log() statements. Consider grouping them or removing unnecessary ones.',
              });
              consecutiveLogs = 0; 
            }
          } else {
            consecutiveLogs = 0; // Reset counter if the streak is broken
          }
        });
      },
    };
  },
};