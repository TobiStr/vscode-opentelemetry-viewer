import React, { useEffect, useState, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import {
  ModuleRegistry,
  ClientSideRowModelModule,
  TextFilterModule,
  NumberFilterModule,
  DateFilterModule,
  ValidationModule,
  ColumnAutoSizeModule,
  RowStyleModule,
  themeQuartz,
  colorSchemeDark,
  colorSchemeLight,
  RowStyle,
  RowClassParams,
  SizeColumnsToContentStrategy,
  ColumnApiModule,
  GridOptions,
} from "ag-grid-community";

declare function acquireVsCodeApi(): {
  postMessage: (msg: any) => void;
  setState: (state: any) => void;
  getState: () => any;
};

const vscodeApi = acquireVsCodeApi();

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ValidationModule,
  TextFilterModule,
  NumberFilterModule,
  DateFilterModule,
  ColumnAutoSizeModule,
  RowStyleModule,
  ColumnApiModule,
]);

export default function App() {
  // Fields containing these strings are sized to fit
  const autoSizeTargets = ["timestamp", "message", "log", "info"];

  const [rowData, setRowData] = useState<any[]>([]);
  const [columnDefs, setColumnDefs] = useState<any[]>([]);
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(false);
  const gridRef = useRef<AgGridReact>(null);

  // Create theme based on current theme state
  const currentTheme = isDarkTheme
    ? themeQuartz.withPart(colorSchemeDark)
    : themeQuartz.withPart(colorSchemeLight);

  const gridOptions: GridOptions = {
    theme: currentTheme,
  };

  const [visibleColumns, setVisibleColumns] = useState<string[]>([]);

  useEffect(() => {
    const listener = (event: MessageEvent) => {
      if (event.data?.type === "loadLogs") {
        console.log("[WEBVIEW] Message received:", event.data);
        const data = event.data.payload;
        const theme = event.data.theme;

        // Update theme state
        if (theme) {
          setIsDarkTheme(theme === 'dark');
        }

        setRowData(data);
        if (data.length > 0) {
          const keys: string[] = Array.from(
            new Set(data.flatMap((row: any) => Object.keys(row)))
          );

          const columns = keys.map((key: string) => ({
            headerName: key
              .replace(/\./g, " ")
              .replace(/^\w/, (c) => c.toUpperCase()),
            colId: key,
            valueGetter: (params: any) =>
              (params.data as Record<string, any>)[key],
            filter: true,
            sortable: true,
            floatingFilter: true,
            resizable: true,
          }));

          setColumnDefs(columns);

          setVisibleColumns(keys);

          const colIdsToAutoSize = keys.filter((key) =>
            autoSizeTargets.some((target) =>
              key.toLowerCase().includes(target.toLowerCase())
            )
          );

          gridOptions.autoSizeStrategy = {
            type: "fitCellContents",
            colIds: colIdsToAutoSize,
          } satisfies SizeColumnsToContentStrategy;

          setTimeout(() => {
            try {
              console.log("Autosizing columns");
              gridRef.current?.api?.autoSizeAllColumns();
            } catch (error) {
              console.error("[WEBVIEW] Autosizing columns failed.", error);
            }
          }, 200);
        }
      }
    };

    window.addEventListener("message", listener);

    console.log("[WEBVIEW] Event listener added for VS Code messages.");

    vscodeApi?.postMessage({ type: "ready" });

    return () => window.removeEventListener("message", listener);
  }, []);

  // Container styles that adapt to theme
  const containerStyle = {
    height: "100vh",
    width: "100%",
    backgroundColor: isDarkTheme ? "#1e1e1e" : "#ffffff",
    color: isDarkTheme ? "#ffffff" : "#000000"
  };

  const controlsStyle = {
    padding: 10,
    display: "flex",
    flexWrap: "wrap" as const,
    gap: 10,
    backgroundColor: isDarkTheme ? "#2d2d2d" : "#f5f5f5",
    borderBottom: `1px solid ${isDarkTheme ? "#404040" : "#e0e0e0"}`
  };

  const labelStyle = {
    fontSize: "12px",
    color: isDarkTheme ? "#ffffff" : "#000000"
  };

  return (
    <div style={containerStyle}>
      <div style={controlsStyle}>
        {columnDefs.map((col) => (
          <label key={col.colId} style={labelStyle}>
            <input
              type="checkbox"
              checked={visibleColumns.includes(col.colId)}
              onChange={(e) => {
                const updated = e.target.checked
                  ? [...visibleColumns, col.colId]
                  : visibleColumns.filter((id) => id !== col.colId);

                setVisibleColumns(updated);
                gridRef.current?.api?.setColumnsVisible(
                  [col.colId],
                  e.target.checked
                );
              }}
            />{" "}
            {col.headerName}
          </label>
        ))}
      </div>
      {columnDefs.length > 0 ? (
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          gridOptions={gridOptions}
          getRowStyle={(
            params: RowClassParams<any, any>
          ): RowStyle | undefined => {
            const values = Object.values(params.data || {}).map((v) =>
              typeof v === "string" ? v.toLowerCase() : ""
            );

            if (
              values.some((v) =>
                ["error", "err", "crit", "critical", "sev", "severe"].includes(
                  v
                )
              )
            ) {
              // Error row styling - adapt to theme
              return {
                backgroundColor: isDarkTheme ? "#4a1a1a" : "#ffe5e5"
              };
            }

            if (values.some((v) => ["warn", "warning"].includes(v))) {
              // Warning row styling - adapt to theme
              return {
                backgroundColor: isDarkTheme ? "#4a3a1a" : "#fff8dc"
              };
            }

            return undefined;
          }}
          defaultColDef={{
            filter: true,
            sortable: true,
            floatingFilter: true,
            resizable: true,
          }}
        />
      ) : (
        <div style={{
          padding: 20,
          color: isDarkTheme ? "#ffffff" : "#000000"
        }}>
          Loading...
        </div>
      )}
    </div>
  );
}
