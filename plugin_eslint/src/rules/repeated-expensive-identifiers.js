'use strict';

const EXPENSIVE_IDENTIFIERS = ['getComputedStyle', 'getBoundingClientRect', 'offsetHeight', 'offsetWidth'];
const LOOP_TYPES = ['ForStatement', 'WhileStatement'];
const FUNCTION_TYPES = ['FunctionDeclaration', 'FunctionExpression', 'ArrowFunctionExpression'];

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Warn when expensive methods "getComputedStyle, getClientBoundingRect and offsetHeight/offsetWidth" are called multiple times or in a loop',
      recommended: true,
    },
    schema: [] // No options
  },
  create(context) {
    return {
      Identifier(node) {
        if(!EXPENSIVE_IDENTIFIERS.includes(node.name)) {
          return;
        }

        function isDeeperNode(node, key) {
          return node[key] && typeof node[key] === 'object' && typeof node[key].type === 'string' && key !== 'parent';
        }

        function isDeeperChild(node) {
          return typeof node === 'object' && typeof node.type === 'string';
        }

        function getObjectName(node) {
          if(node.type === 'MemberExpression') {
            return getObjectName(node.object) + '.' + node.property.name;
          }

          return node.name;
        }

        function findCalls(node, identifier) {
          const identifiers = [];

          if(node.type === 'MemberExpression' && node.property.name === identifier) {
            identifiers.push(getObjectName(node));
          }

          for(const key in node) {
            if(isDeeperNode(node, key)) {
              identifiers.push(...findCalls(node[key], identifier));
            }
            else if(Array.isArray(node[key])) {
              for(const child of node[key]) {
                if (isDeeperChild(child)) {
                  identifiers.push(...findCalls(child, identifier));
                }
              }
            }
          }

          return identifiers;
        }

        let current = node;
        let isInsideLoop = false;
        let isInsideFunction = false;

        while(current) {
          if(LOOP_TYPES.includes(current.type)) {
            isInsideLoop = true;
            break;
          }

          if(FUNCTION_TYPES.includes(current.type)) {
            isInsideFunction = true;
            break;
          }

          current = current.parent;
        }

        if(isInsideLoop) {
          context.report({
            node,
            message: `Avoid calling expensive method "${node.name}" inside a loop. Consider caching the result outside the loop.`,
          });
        }

        if(isInsideFunction) {
          const calls = findCalls(current, node.name);
          
            const uniqueCalls = new Set(calls);

            if (uniqueCalls.size !== calls.length) {
              context.report({
                node,
                message: `The method "${node.name}" is called multiple times within the same function. Consider caching the result to improve performance.`,
              });
            }
        }
      }
    }
  },
};
