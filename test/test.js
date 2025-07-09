// Simple test to verify plugin functionality
const plugin = require("../index.js");

console.log("🧪 Testing eslint-plugin-preact-signals...\n");

// Test 1: Plugin exports
console.log("✅ Plugin exports:", Object.keys(plugin));
console.log("✅ Rules:", Object.keys(plugin.rules));
console.log("✅ Configs:", Object.keys(plugin.configs));

// Test 2: Rule imports
try {
  const rule1 = plugin.rules["no-signal-value-outside-hooks"];
  const rule2 = plugin.rules["no-signal-value-in-jsx"];

  console.log("✅ Rule 1 loaded:", !!rule1.meta);
  console.log("✅ Rule 2 loaded:", !!rule2.meta);
  console.log("✅ Rule 1 fixable:", rule1.meta.fixable === "code");
  console.log("✅ Rule 2 not fixable:", rule2.meta.fixable === null);
} catch (error) {
  console.log("❌ Error loading rules:", error.message);
}

// Test 3: Config structure
console.log("\n📋 Available configurations:");
Object.keys(plugin.configs).forEach((configName) => {
  const config = plugin.configs[configName];
  console.log(`  ${configName}:`, {
    plugins: config.plugins,
    rules: Object.keys(config.rules),
  });
});

console.log("\n🎉 Plugin test completed!");
