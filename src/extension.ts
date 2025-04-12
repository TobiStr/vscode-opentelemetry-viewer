import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";

export function activate(context: vscode.ExtensionContext) {
  console.log("OpenTelemetry Viewer Extension is now active!");

  const disposable = vscode.commands.registerCommand(
    "vscode-opentelemetry-viewer.showLogs",
    async () => {
      const panel = vscode.window.createWebviewPanel(
        "otelLogViewer",
        "OpenTelemetry Viewer",
        vscode.ViewColumn.One,
        {
          enableScripts: true,
          localResourceRoots: [
            vscode.Uri.file(path.join(context.extensionPath, "media")),
          ],
        }
      );

      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showErrorMessage("No active file open.");
        return;
      }

      const filePath = editor.document.uri.fsPath;
      if (!fs.existsSync(filePath)) {
        vscode.window.showErrorMessage("The file does not exist.");
        return;
      }

      let rawData = fs.readFileSync(filePath, "utf-8");
      let logData: any[] = [];

      try {
        logData = rawData
          .split("\n")
          .filter((line) => line.trim())
          .map(line => {
            const parsed = JSON.parse(line);
            if (parsed.attributes && typeof parsed.attributes === 'object') {
              parsed.attributes = JSON.stringify(parsed.attributes, null, 2);
            }
            return parsed;
          });
      } catch (error) {
        vscode.window.showErrorMessage(
          "Error parsing log file. Make sure it is JSON Lines formatted."
        );
        return;
      }

      const scriptUri = panel.webview.asWebviewUri(
        vscode.Uri.joinPath(context.extensionUri, "media", "assets", "main.js")
      );

      const cssFile = fs
        .readdirSync(path.join(context.extensionPath, "media", "assets"))
        .find((file) => file.endsWith(".css"));

      const cssUri = cssFile
        ? panel.webview.asWebviewUri(
            vscode.Uri.joinPath(
              context.extensionUri,
              "media",
              "assets",
              cssFile
            )
          )
        : null;

      const nonce = getNonce();

      panel.webview.html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta http-equiv="Content-Security-Policy"
        content="default-src 'none';
                 script-src 'nonce-${nonce}';
                 style-src 'self' ${panel.webview.cspSource} 'unsafe-inline';
                 font-src ${panel.webview.cspSource} data:;
                 img-src ${panel.webview.cspSource} data:;">
      ${cssUri ? `<link rel="stylesheet" href="${cssUri}" nonce="${nonce}" />` : ''}
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>OpenTelemetry Logs</title>
    </head>
    <body>
      <div id="root"></div>
      <script nonce="${nonce}" type="module" src="${scriptUri}"></script>
    </body>
    </html>
  `;

      // Send logs to the webview after it's ready
      panel.webview.onDidReceiveMessage((msg) => {
        if (msg.type === "ready") {
          console.log("[EXT] Webview is ready. Sending logs...");
          panel.webview.postMessage({ type: "loadLogs", payload: logData });
        }
      });
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}

function getNonce() {
  return [...Array(32)].map(() => Math.random().toString(36)[2]).join("");
}
