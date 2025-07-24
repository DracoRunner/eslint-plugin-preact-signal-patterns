const { createSignalDetector } = require('../utils/signal-detector');

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow implicit boolean coercion of signal variables',
      category: 'Best Practices',
      recommended: true,
    },
    fixable: null,
    schema: [
      {
        type: 'object',
        properties: {
          allowNullishCoalesce: {
            oneOf: [
              {
                type: 'string',
                enum: ['always', 'nullish'],
              },
              {
                type: 'boolean',
                enum: [false],
              },
            ],
            default: 'nullish',
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      implicitBooleanSignal:
        'Signal is implicitly converted to boolean, which will always be true. Use .value or .peek() instead.',
      implicitNullishCheck: 'Signal is implicitly checked for nullishness. Consider explicit null check instead.',
    },
  },
  create(context) {
    const options = context.options[0] || {};
    const allowNullishCoalesce = options.allowNullishCoalesce;

    // Create signal detector with shared logic
    const signalDetector = createSignalDetector(context);

    function isInBooleanContext(node) {
      const parent = node.parent;
      if (!parent) return null;

      switch (parent.type) {
        case 'UnaryExpression':
          return parent.operator === '!' ? 'boolean' : null;

        case 'IfStatement':
          return parent.test === node ? 'boolean' : null;

        case 'ConditionalExpression':
          return parent.test === node ? 'boolean' : null;

        case 'LogicalExpression':
          if (parent.left === node || parent.right === node) {
            return parent.operator === '??' ? 'nullish' : 'boolean';
          }
          return null;

        case 'WhileStatement':
          return parent.test === node ? 'boolean' : null;

        case 'DoWhileStatement':
          return parent.test === node ? 'boolean' : null;

        case 'ForStatement':
          return parent.test === node ? 'boolean' : null;

        default:
          return null;
      }
    }

    return {
      // Use shared signal declaration visitor
      ...signalDetector.getSignalDeclarationVisitor(),

      Identifier(node) {
        // Skip if it's a property access (signal.value, signal.peek)
        if (node.parent && node.parent.type === 'MemberExpression' && node.parent.object === node) {
          return;
        }

        // Skip if it's being assigned to
        if (node.parent && node.parent.type === 'AssignmentExpression' && node.parent.left === node) {
          return;
        }

        // Skip if it's a function parameter or declaration
        if (
          node.parent &&
          (node.parent.type === 'VariableDeclarator' ||
            node.parent.type === 'FunctionDeclaration' ||
            node.parent.type === 'ArrowFunctionExpression' ||
            node.parent.type === 'FunctionExpression')
        ) {
          return;
        }

        // Skip if it's a function parameter
        let current = node.parent;
        while (current) {
          if (
            current.type === 'FunctionDeclaration' ||
            current.type === 'FunctionExpression' ||
            current.type === 'ArrowFunctionExpression'
          ) {
            if (
              current.params &&
              current.params.some((param) => {
                return param === node || (param.type === 'Identifier' && param.name === node.name);
              })
            ) {
              return;
            }
            break;
          }
          current = current.parent;
        }

        // Only check variables we've confirmed are signals
        if (!signalDetector.isSignalVariable(node)) {
          return;
        }

        const booleanContext = isInBooleanContext(node);

        if (booleanContext === 'boolean') {
          context.report({
            node,
            messageId: 'implicitBooleanSignal',
          });
        } else if (booleanContext === 'nullish') {
          // Handle nullish coalescing options
          if (allowNullishCoalesce === 'always') {
            return;
          }
          if (allowNullishCoalesce === 'nullish') {
            // We can't easily detect nullish types without TypeScript, so allow by default
            return;
          }
          if (allowNullishCoalesce === false) {
            context.report({
              node,
              messageId: 'implicitNullishCheck',
            });
          }
        }
      },
    };
  },
};
