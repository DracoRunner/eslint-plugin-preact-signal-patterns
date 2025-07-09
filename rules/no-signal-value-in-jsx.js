module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Warn when reading signal.value in JSX',
      category: 'Best Practices',
      recommended: false,
    },
    fixable: null, // No auto-fix for JSX usage
    schema: [],
    messages: {
      noSignalValueInJSX:
        'Reading signal.value in JSX is discouraged. Consider passing the signal directly to the component prop.',
    },
  },
  create(context) {
    let jsxDepth = 0;

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
      MemberExpression(node) {
        if (isSignalValueRead(node) && !isAssignment(node) && jsxDepth > 0) {
          context.report({
            node,
            messageId: 'noSignalValueInJSX',
          });
        }
      },
    };
  },
};
