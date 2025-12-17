/**
 * Shared utilities for signal detection across ESLint rules
 */

/**
 * Gets the scope for a given node, compatible with both ESLint 8 and ESLint 9
 * ESLint 9 removed context.getScope() in favor of sourceCode.getScope(node)
 * @param {Object} context - ESLint rule context
 * @param {Object} node - AST node to get scope for
 * @returns {Object} The scope object
 */
function getScope(context, node) {
	// ESLint 9+: Use sourceCode.getScope(node)
	if (context.sourceCode && typeof context.sourceCode.getScope === "function") {
		return context.sourceCode.getScope(node);
	}
	// ESLint 8: Use context.getScope() (deprecated but still works)
	if (typeof context.getScope === "function") {
		return context.getScope();
	}
	// Fallback for older versions
	return null;
}

/**
 * Creates a signal detector that can track and identify signal variables
 * @param {Object} context - ESLint rule context
 * @returns {Object} Object with signal detection methods
 */
function createSignalDetector(context) {
	// Track actual signal variables by their definitions
	const signalVariables = new Set();

	/**
	 * Track a variable as a signal
	 * @param {string} name - Variable name to track
	 */
	function trackSignalVariable(name) {
		// Input validation: ensure name is a non-empty string
		if (typeof name === "string" && name.trim().length > 0) {
			signalVariables.add(name.trim());
		}
	}

	/**
	 * Check if a node represents a signal variable
	 * @param {Object} node - AST node to check
	 * @returns {boolean} True if the node is a signal variable
	 */
	function isSignalVariable(node) {
		// Input validation: ensure node exists and has a name property
		if (
			!node ||
			typeof node.name !== "string" ||
			node.name.trim().length === 0
		) {
			return false;
		}

		// First check if we've tracked this as a signal variable
		if (signalVariables.has(node.name)) {
			return true;
		}

		// Try to detect if variable comes from a Preact signal import or assignment
		const scope = getScope(context, node);
		if (!scope) {
			return false;
		}
		let currentScope = scope;

		while (currentScope) {
			const variable = currentScope.set.get(node.name);
			if (variable && variable.defs.length > 0) {
				const def = variable.defs[0];

				// Check if it's imported from @preact/signals*
				if (def.type === "ImportBinding" && def.node.source) {
					const importPath = def.node.source.value;
					if (
						typeof importPath === "string" &&
						importPath.includes("@preact/signals")
					) {
						trackSignalVariable(node.name);
						return true;
					}
				}

				// Check if it's assigned from a signal-creating function
				if (def.node?.init) {
					const init = def.node.init;
					if (init.type === "CallExpression" && init.callee) {
						const calleeName = init.callee.name;
						// Check for signal creation functions
						if (
							["signal", "useSignal", "useComputed", "computed"].includes(
								calleeName,
							)
						) {
							trackSignalVariable(node.name);
							return true;
						}
					}
				}
				break;
			}
			currentScope = currentScope.upper;
		}

		return false;
	}

	/**
	 * Check if a node represents reading signal.value
	 * @param {Object} node - AST node to check
	 * @returns {boolean} True if it's a signal.value read operation
	 */
	function isSignalValueRead(node) {
		// Input validation: ensure node has the expected structure
		if (!node || node.type !== "MemberExpression") {
			return false;
		}

		return (
			node.property &&
			node.property.type === "Identifier" &&
			node.property.name === "value" &&
			!node.computed &&
			node.object &&
			node.object.type === "Identifier" &&
			isSignalVariable(node.object) // Only check if it's actually a signal variable
		);
	}

	/**
	 * Check if a node is an assignment operation
	 * @param {Object} node - AST node to check
	 * @returns {boolean} True if it's an assignment
	 */
	function isAssignment(node) {
		// Input validation: ensure node exists and has a parent
		if (!node || !node.parent) {
			return false;
		}

		const parent = node.parent;
		return parent.type === "AssignmentExpression" && parent.left === node;
	}

	/**
	 * Get a visitor for tracking signal variable declarations
	 * @returns {Object} ESLint visitor object
	 */
	function getSignalDeclarationVisitor() {
		return {
			VariableDeclarator(node) {
				// Input validation: ensure node has the expected structure
				if (
					!node ||
					!node.init ||
					node.init.type !== "CallExpression" ||
					!node.init.callee
				) {
					return;
				}

				const calleeName = node.init.callee.name;
				if (
					typeof calleeName === "string" &&
					["signal", "useSignal", "useComputed", "computed"].includes(
						calleeName,
					)
				) {
					if (
						node.id &&
						node.id.type === "Identifier" &&
						typeof node.id.name === "string"
					) {
						trackSignalVariable(node.id.name);
					}
				}
			},
		};
	}

	return {
		trackSignalVariable,
		isSignalVariable,
		isSignalValueRead,
		isAssignment,
		getSignalDeclarationVisitor,
	};
}

module.exports = {
	createSignalDetector,
};
