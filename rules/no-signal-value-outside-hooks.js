module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow reading signal.value outside of useComputed, useSignalEffect, or JSX',
      category: 'Best Practices',
      recommended: true,
    },
    fixable: 'code',
    schema: [],
    messages: {
      noSignalValueOutsideHooks:
        'Reading signal.value outside of useComputed, useSignalEffect, or JSX is not allowed. Use .peek() instead.',
    },
  },
  create(context) {
    let currentFunction = null;
    let jsxDepth = 0;

    function isInAllowedContext() {
      // Allow if we're in JSX
      if (jsxDepth > 0) {
        return true;
      }

      // Allow if we're in useComputed or useSignalEffect
      if (currentFunction && currentFunction.name) {
        return currentFunction.name === 'useComputed' || currentFunction.name === 'useSignalEffect';
      }

      return false;
    }

    function isSignalValueRead(node) {
      return (
        node.type === 'MemberExpression' &&
        node.property.type === 'Identifier' &&
        node.property.name === 'value' &&
        !node.computed &&
        node.object.type === 'Identifier'
        // Note: We detect any .value access on identifiers
        // This is more permissive but catches all potential signal usage
      );
    }

    function isAssignment(node) {
      const parent = node.parent;
      return parent && parent.type === 'AssignmentExpression' && parent.left === node;
    }

    return {
      JSXElement() {
        jsxDepth++;
      },
      'JSXElement:exit'() {
        jsxDepth--;
      },
      JSXFragment() {
        jsxDepth++;
      },
      'JSXFragment:exit'() {
        jsxDepth--;
      },
      JSXExpressionContainer() {
        jsxDepth++;
      },
      'JSXExpressionContainer:exit'() {
        jsxDepth--;
      },
      CallExpression(node) {
        if (node.callee.name === 'useComputed' || node.callee.name === 'useSignalEffect') {
          currentFunction = { name: node.callee.name };
        }
      },
      'CallExpression:exit'(node) {
        if (node.callee.name === 'useComputed' || node.callee.name === 'useSignalEffect') {
          currentFunction = null;
        }
      },
      MemberExpression(node) {
        if (isSignalValueRead(node) && !isAssignment(node) && !isInAllowedContext()) {
          context.report({
            node,
            messageId: 'noSignalValueOutsideHooks',
            fix(fixer) {
              return fixer.replaceText(node.property, 'peek()');
            },
          });
        }
      },
    };
  },
};
