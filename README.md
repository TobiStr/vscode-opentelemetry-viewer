# OpenTelemetry Log Viewer for VS Code

[![Version](https://img.shields.io/github/v/tag/TobiStr/vscode-opentelemetry-viewer?label=Version&sort=semver)](https://github.com/TobiStr/vscode-opentelemetry-viewer/releases)
[![Deployment](https://github.com/TobiStr/vscode-opentelemetry-viewer/actions/workflows/publish.yml/badge.svg?branch=main)](https://github.com/TobiStr/vscode-opentelemetry-viewer/actions/workflows/publish.yml)

[![Repository](https://img.shields.io/badge/Repository-TobiStr%2Fvscode--opentelemetry--viewer-orange?logo=github)](https://github.com/TobiStr/vscode-opentelemetry-viewer)

[![VS Code Marketplace](https://img.shields.io/visual-studio-marketplace/v/Tobias-Streng.vscode-opentelemetry-viewer?label=VS%20Code%20Marketplace&color=2ea44f)](https://marketplace.visualstudio.com/items?itemName=Tobias-Streng.vscode-opentelemetry-viewer)

A simple, interactive VS Code extension for exploring [OpenTelemetry](https://opentelemetry.io/) logs using a smart, filterable data grid.

Since there is no solution to view those logs offline?! Here is a simple viewer extension for VS Code:

![screenshot](https://raw.githubusercontent.com/TobiStr/vscode-opentelemetry-viewer/main/docs/screenshot_1.png)

---

## ✨ Features

- 📊 Displays structured JSON logs in a dynamic AG Grid table
- 🔍 Sort, filter, and search across all columns
- 🚀 One-click toolbar button **"OpenTelemetry Viewer"** to open the viewer (present when viewing `.log` or `.jsonl` files)
- 🧠 Validates file content before rendering the grid
- 🔐 Safe Content Security Policy (CSP) with inline script and style support

---

## 📦 Installation

Install from the [Visual Studio Code Marketplace](https://marketplace.visualstudio.com/items?itemName=Tobias-Streng.vscode-opentelemetry-viewer) or search for "OpenTelemetry Log Viewer" in the Extensions sidebar in VS Code.

[![VS Code Marketplace](https://img.shields.io/visual-studio-marketplace/v/Tobias-Streng.vscode-opentelemetry-viewer?label=VS%20Code%20Marketplace&color=2ea44f)](https://marketplace.visualstudio.com/items?itemName=Tobias-Streng.vscode-opentelemetry-viewer)


---

## 🪵 Usage

1. Open any `.log` or `.jsonl` file that contains OpenTelemetry logs in JSON Lines format.
2. Click the **"OpenTelemetry Viewer"** button in the editor toolbar (top-right). 
3. You can also run the command `OpenTelemetry Viewer` from the command palette (`Ctrl+Shift+P`).
4. View your logs in a rich, sortable grid!

> Log entries must be one JSON object per line (JSONL).

---

## 📁 File Types

This extension automatically activates and shows the **OpenTelemetry Viewer** button when working with:

- `.log`
- `.jsonl`

---

## 🛠 Development

### Commands

```bash
npm run build          # Builds the extension and webview
```

### Folder Structure

```
src/
├── extension.ts        # VS Code backend logic
└── webview/            # React-based frontend for the log viewer
    ├── App.tsx
    └── main.tsx
```

---

## ⚙️ Automatic Versioning

This project features automatic versioning and deployment. More on this can be found here: [TobiStr/branching-and-versioning](https://github.com/TobiStr/branching-and-versioning)

---

## 🛡 License & Notice

- [Apache 2.0 License](LICENSE)
- [NOTICE](NOTICE)

---

## 🙌 Credits

- Powered by [AG Grid](https://www.ag-grid.com/) for flexible data rendering
- Inspired by the need to finally view these log files offline.

---

> Contributions welcome! Please fork and enhance — and credit the original project.