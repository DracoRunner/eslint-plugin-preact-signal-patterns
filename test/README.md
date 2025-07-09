# Test Directory

This directory contains all tests for the eslint-plugin-preact-signals package.

## Test Files

### `test.js`
Basic plugin structure validation:
- Verifies plugin exports (rules, configs)
- Checks rule metadata
- Validates configuration structure

### `test-real-world.js`
Real-world ESLint integration tests:
- Tests rules with actual code examples
- Validates auto-fix functionality
- Tests JSX warning detection
- Tests hook context detection

### `test-validation.js`
Comprehensive ESLint API validation (currently experimental):
- Advanced testing scenarios
- ESLint API integration testing

### `test-rules.js`
Direct rule logic testing (currently experimental):
- Tests rule implementations directly
- Mock-based testing approach

### `validation-summary.js`
Final validation and publication readiness check:
- Comprehensive validation summary
- Publication checklist
- Example code demonstration

### `run-all-tests.js`
Test runner script:
- Runs all essential tests
- Provides comprehensive test results
- Used by `npm test`

## Running Tests

```bash
# Run all tests
npm test

# Run individual test suites
npm run test:basic           # Basic plugin structure
npm run test:real-world      # Real-world integration
npm run test:validation      # ESLint API validation
npm run test:direct          # Direct rule testing
npm run test:summary         # Validation summary
```

## Test Coverage

The test suite covers:

✅ **Plugin Structure**: Exports, configurations, rule metadata  
✅ **Rule Functionality**: Real code examples with ESLint integration  
✅ **Auto-fix**: Validates auto-fix transforms `.value` to `.peek()`  
✅ **JSX Detection**: Warnings for signal usage in JSX  
✅ **Hook Context**: Allows signal.value in useComputed/useSignalEffect  
✅ **Assignment Safety**: Never flags signal.value assignments  

## Publication Readiness

The test suite ensures the plugin is ready for npm publication by validating:

- All rules work correctly with real code
- Auto-fix functionality operates as expected
- Documentation is complete and accurate
- Package structure is correct
- No breaking issues in core functionality
