const { createSignalDetector } = require('../utils/signal-detector');

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Warn when reading signal.value in JSX',
      category: 'Best Practices',
      recommended: false,
    },
    fixable: null, 
    schema: [],
    messages: {
      noSignalValueInJSX:
        'Reading signal.value in JSX is discouraged. Consider passing the signal directly to the component prop.',
    },
  },
  create(context) {
    let jsxDepth = 0;

    // Create signal detector with shared logic
    const signalDetector = createSignalDetector(context);

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
      MemberExpression(node) {
        if (signalDetector.isSignalValueRead(node) && !signalDetector.isAssignment(node) && jsxDepth > 0) {
          context.report({
            node,
            messageId: 'noSignalValueInJSX',
          });
        }
      },
    };
  },
};
