# Tests

This directory contains the test suite for the OpenTelemetry Viewer extension.

## Structure

- `suite/` - Contains the actual test files
  - `extension.test.ts` - Tests for the main extension logic (theme detection, configuration)
  - `webview.test.ts` - Tests for the webview React component theme handling
  - `index.ts` - Test runner configuration
- `fixtures/` - Contains test data files
  - `test-logs.jsonl` - Sample log file for testing
  - `test-extension.md` - Manual testing instructions
- `runTest.ts` - Main test runner entry point
- `mocha.opts` - Mocha configuration

## Running Tests

### All Tests (Integration + Unit)
```bash
npm test
```

### Unit Tests Only
```bash
npm run test:unit
```

### Manual Testing
1. Open VS Code
2. Go to Debug panel (Cmd+Shift+D)
3. Select "Run Extension"
4. Press F5 to launch Extension Development Host
5. Open `src/test/fixtures/test-logs.jsonl`
6. Click "OpenTelemetry Viewer (Dev)" button
7. Test theme settings in VS Code settings

## Test Coverage

### Extension Tests (`extension.test.ts`)
- Theme configuration default values
- Theme configuration validation
- VS Code theme detection (light/dark/high contrast)
- Theme determination logic

### Webview Tests (`webview.test.ts`)
- Container styling for light/dark modes
- Controls styling for light/dark modes
- Row styling for error/warning logs in both themes
- Theme message handling

## Adding New Tests

1. Create new `.test.ts` files in the `suite/` directory
2. Use the `suite()` and `test()` functions from Mocha
3. Import `assert` for assertions
4. Use `sinon` for mocking VS Code APIs when needed
