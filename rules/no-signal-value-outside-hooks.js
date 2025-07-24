const { createSignalDetector } = require('../utils/signal-detector');

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow reading signal.value outside of useComputed, useSignalEffect, or JSX',
      category: 'Best Practices',
      recommended: true,
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          autoFix: {
            type: 'boolean',
            default: true,
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      noSignalValueOutsideHooks:
        'Reading signal.value outside of useComputed, useSignalEffect, or JSX is not allowed. Use .peek() instead.',
    },
  },
  create(context) {
    const options = context.options[0] || {};
    const autoFix = options.autoFix !== false; // Default to true unless explicitly set to false
    
    let currentFunction = null;
    let jsxDepth = 0;

    // Create signal detector with shared logic
    const signalDetector = createSignalDetector(context);

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

    return {
      // Use shared signal declaration visitor
      ...signalDetector.getSignalDeclarationVisitor(),
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
        if (signalDetector.isSignalValueRead(node) && !signalDetector.isAssignment(node) && !isInAllowedContext()) {
          const report = {
            node,
            messageId: 'noSignalValueOutsideHooks',
          };
          
          // Only provide fix if auto-fix is enabled
          if (autoFix) {
            report.fix = function(fixer) {
              return fixer.replaceText(node.property, 'peek()');
            };
          }
          
          context.report(report);
        }
      },
    };
  },
};
