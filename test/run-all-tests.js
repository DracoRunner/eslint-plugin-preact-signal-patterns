#!/usr/bin/env node

// Test runner for eslint-plugin-preact-signals
const { execSync } = require('child_process');
const path = require('path');

console.log("🧪 ESLint Plugin Preact Signals - Test Suite Runner\n");

const tests = [
  {
    name: "Basic Plugin Structure",
    script: "test.js",
    description: "Validates plugin exports and basic functionality"
  },
  {
    name: "Real-World Code Validation", 
    script: "test-real-world.js",
    description: "Tests rules with actual code examples"
  },
  {
    name: "Validation Summary",
    script: "validation-summary.js",
    description: "Final validation and publication readiness check"
  }
];

let allPassed = true;

for (const test of tests) {
  console.log(`🔍 Running: ${test.name}`);
  console.log(`   ${test.description}`);
  
  try {
    const output = execSync(`node ${path.join(__dirname, test.script)}`, {
      encoding: 'utf8',
      cwd: path.dirname(__dirname)
    });
    
    console.log("   ✅ PASSED\n");
  } catch (error) {
    console.log("   ❌ FAILED");
    console.log(`   Error: ${error.message}\n`);
    allPassed = false;
  }
}

console.log("=" .repeat(50));

if (allPassed) {
  console.log("🎉 ALL TESTS PASSED!");
  console.log("✅ Plugin is ready for publication");
  process.exit(0);
} else {
  console.log("❌ Some tests failed");
  console.log("Please fix the issues before proceeding");
  process.exit(1);
}
