# Testing Dark Mode Extension

## Steps to test

1. **Build the extension**: `npm run build` ✅
2. **Open VS Code Extension Development Host**: `code --extensionDevelopmentPath=. --new-window` ✅
3. **Open the test log file**: Open `test-logs.jsonl` in the extension development window
4. **Test the OpenTelemetry Viewer**: Click the "OpenTelemetry Viewer" button in the editor toolbar
5. **Test theme settings**:
   - Go to VS Code Settings (Cmd+,)
   - Search for "opentelemetryViewer.theme"
   - Try different values: "auto", "light", "dark"
6. **Test VS Code theme integration**:
   - Change VS Code theme to dark (View > Appearance > Theme > Dark Modern)
   - Change VS Code theme to light (View > Appearance > Theme > Light Modern)
   - Verify the extension follows VS Code theme when set to "auto"

## Expected behavior

- **Light theme**: White background, dark text, light ag-grid theme
- **Dark theme**: Dark background, light text, dark ag-grid theme
- **Auto mode**: Should follow VS Code's current theme
- **Error rows**: Light red background in light mode, dark red in dark mode
- **Warning rows**: Light yellow background in light mode, dark yellow in dark mode

## Configuration added

```json
{
  "opentelemetryViewer.theme": {
    "type": "string",
    "enum": ["auto", "light", "dark"],
    "default": "auto",
    "description": "Theme for the OpenTelemetry viewer. 'auto' follows VS Code's theme, 'light' forces light theme, 'dark' forces dark theme."
  }
}
```
