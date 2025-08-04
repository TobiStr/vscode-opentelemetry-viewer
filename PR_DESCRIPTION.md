# 🌙 Add Dark Mode Support with Comprehensive Test Suite

## Overview
This PR adds comprehensive dark mode support to the OpenTelemetry Viewer extension, allowing users to customize the theme independently of VS Code's theme or have it automatically follow VS Code's appearance.

## ✨ Features Added

### 🎨 Theme Configuration
- **New setting**: `opentelemetryViewer.theme` with options:
  - `auto` (default) - Follows VS Code's current theme
  - `light` - Forces light theme
  - `dark` - Forces dark theme

### 🔧 Implementation Details
- **Extension Logic** (`src/extension.ts`):
  - Reads theme configuration from VS Code settings
  - Detects VS Code's current theme (light/dark/high contrast)
  - Passes theme information to webview
  
- **Webview Updates** (`src/webview/App.tsx`):
  - Uses ag-grid's `colorSchemeDark` and `colorSchemeLight` for proper grid theming
  - Adaptive container and controls styling
  - Theme-aware error/warning row highlighting:
    - Light mode: Light red/yellow backgrounds
    - Dark mode: Dark red/yellow backgrounds

### 🧪 Comprehensive Test Suite
- **14 tests** covering all theme functionality
- **Extension tests**: Theme detection, configuration validation
- **Webview tests**: Styling logic, message handling
- **Test infrastructure**: Proper TypeScript config, Mocha setup
- **Test organization**: Structured in `src/test/` directory

## 📁 Files Changed

### Core Implementation
- `package.json` - Added theme configuration and test dependencies
- `src/extension.ts` - Theme detection and configuration reading
- `src/webview/App.tsx` - Theme-aware UI components
- `tsconfig.json` - Updated to include test files

### Test Suite
- `src/test/suite/extension.test.ts` - Extension theme logic tests
- `src/test/suite/webview.test.ts` - Webview theme logic tests
- `src/test/runTest.ts` - VS Code test runner
- `src/test/suite/index.ts` - Test suite configuration
- `src/test/README.md` - Test documentation
- `src/test/fixtures/` - Test data and documentation

## 🎯 Testing
- ✅ All 14 tests passing
- ✅ Unit tests for theme logic
- ✅ VS Code integration tests
- ✅ Manual testing confirmed working

### Test Commands
```bash
npm test          # Full integration tests
npm run test:unit # Unit tests only
```

## 🖼️ Visual Changes
- **Light Mode**: Clean white background with dark text
- **Dark Mode**: Dark background (#1e1e1e) with light text
- **Controls**: Adaptive styling for column toggles
- **Error Rows**: Red highlighting adapted to theme
- **Warning Rows**: Yellow highlighting adapted to theme

## 🔄 Backwards Compatibility
- ✅ Fully backwards compatible
- ✅ Default setting (`auto`) maintains current behavior
- ✅ No breaking changes to existing functionality

## 📋 How to Test
1. Install the extension in development mode
2. Open a `.jsonl` log file
3. Click "OpenTelemetry Viewer" button
4. Test theme settings:
   - Go to VS Code Settings → Search "opentelemetryViewer"
   - Try different theme options
   - Change VS Code theme and verify "auto" mode follows

## 🎉 Benefits
- Enhanced user experience with theme consistency
- Improved accessibility with proper contrast
- Flexible configuration options
- Comprehensive test coverage for maintainability
- Professional dark mode implementation using ag-grid's built-in themes

---

**Type**: Feature
**Breaking Changes**: None
**Tests**: 14 passing ✅
