# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-07-09

### Added

- Initial release of eslint-plugin-preact-signals
- `no-signal-value-outside-hooks` rule with auto-fix functionality
- `no-signal-value-in-jsx` rule for JSX usage warnings
- Three configuration presets: `recommended`, `strict`, and `jsx-warnings-only`
- Comprehensive documentation and examples
- Support for ESLint 8.0+

### Features

- **Auto-fix**: Automatically converts `signal.value` to `signal.peek()` in non-JSX contexts
- **Context-aware**: Distinguishes between JSX and non-JSX usage
- **Hook-aware**: Allows `signal.value` in `useComputed` and `useSignalEffect`
- **Assignment-safe**: Never flags `signal.value = newValue` assignments
- **Configurable severity**: Different rule configurations for different team preferences

### Supported Scenarios

- ✅ Allows `signal.value` in `useComputed(() => signal.value)`
- ✅ Allows `signal.value` in `useSignalEffect(() => { ... signal.value ... })`
- ✅ Allows assignments: `signal.value = newValue`
- ⚠️ Warns about JSX usage: `<div className={signal.value} />`
- 🔧 Auto-fixes non-JSX reads: `signal.value` → `signal.peek()`
