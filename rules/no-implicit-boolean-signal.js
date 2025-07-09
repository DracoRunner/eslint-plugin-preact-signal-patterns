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

    // Track actual signal variables by their definitions
    const signalVariables = new Set();

    function trackSignalVariable(name) {
      if (name) {
        signalVariables.add(name);
      }
    }

    function isSignalVariable(node) {
      // First check if we've tracked this as a signal variable
      if (signalVariables.has(node.name)) {
        return true;
      }

      // Try to detect if variable comes from a Preact signal import or assignment
      const scope = context.getScope();
      let currentScope = scope;

      while (currentScope) {
        const variable = currentScope.set.get(node.name);
        if (variable && variable.defs.length > 0) {
          const def = variable.defs[0];

          // Check if it's imported from @preact/signals*
          if (def.type === 'ImportBinding' && def.node.source) {
            const importPath = def.node.source.value;
            if (typeof importPath === 'string' && importPath.includes('@preact/signals')) {
              trackSignalVariable(node.name);
              return true;
            }
          }

          // Check if it's assigned from a signal-creating function
          if (def.node && def.node.init) {
            const init = def.node.init;
            if (init.type === 'CallExpression' && init.callee) {
              const calleeName = init.callee.name;
              // Check for signal creation functions
              if (['signal', 'useSignal', 'useComputed', 'computed'].includes(calleeName)) {
                trackSignalVariable(node.name);
                return true;
              }
            }
          }
          break;
        }
        currentScope = currentScope.upper;
      }

      // Fallback: only check for very obvious signal naming conventions
      const hasSignalSuffix = /\$$/.test(node.name); // count$, user$
      if (hasSignalSuffix) {
        return true;
      }

      return false;
    }

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
      // Track signal variable declarations
      VariableDeclarator(node) {
        if (node.init && node.init.type === 'CallExpression' && node.init.callee) {
          const calleeName = node.init.callee.name;
          if (['signal', 'useSignal', 'useComputed', 'computed'].includes(calleeName)) {
            if (node.id && node.id.type === 'Identifier') {
              trackSignalVariable(node.id.name);
            }
          }
        }
      },

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
        if (!isSignalVariable(node)) {
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
