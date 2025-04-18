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
  const gridRef = useRef<AgGridReact>(null);
  const gridOptions: GridOptions = {
    theme: themeQuartz,
  };

  const [visibleColumns, setVisibleColumns] = useState<string[]>([]);

  useEffect(() => {
    const listener = (event: MessageEvent) => {
      if (event.data?.type === "loadLogs") {
        console.log("[WEBVIEW] Message received:", event.data);
        const data = event.data.payload;

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

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <div style={{ padding: 10, display: "flex", flexWrap: "wrap", gap: 10 }}>
        {columnDefs.map((col) => (
          <label key={col.colId} style={{ fontSize: "12px" }}>
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
              return { backgroundColor: "#ffe5e5" }; // light red
            }

            if (values.some((v) => ["warn", "warning"].includes(v))) {
              return { backgroundColor: "#fff8dc" }; // light yellow
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
        <div style={{ padding: 20 }}>Loading...</div>
      )}
    </div>
  );
}
