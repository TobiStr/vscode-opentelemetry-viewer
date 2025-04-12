import React, { useEffect, useState, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import {
  ModuleRegistry,
  ClientSideRowModelModule,
  TextFilterModule,
  NumberFilterModule,
  DateFilterModule,
  ValidationModule,
  themeQuartz,
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
]);

export default function App() {
  const [rowData, setRowData] = useState<any[]>([]);
  const [columnDefs, setColumnDefs] = useState<any[]>([]);
  const gridRef = useRef<AgGridReact>(null);

  useEffect(() => {
    const listener = (event: MessageEvent) => {
      if (event.data?.type === "loadLogs") {
        console.log("[WEBVIEW] Message received:", event.data);
        const data = event.data.payload;

        setRowData(data);
        if (data.length > 0) {
          const keys = Object.keys(data[0]);
          const columns = keys.map((key) => ({
            field: key,
            filter: true,
            sortable: true,
            floatingFilter: true,
            resizable: true,
          }));
          setColumnDefs(columns);

          setTimeout(() => {
            gridRef.current?.api?.sizeColumnsToFit();
          }, 0);
        }
      }
    };

    window.addEventListener("message", listener);

    console.log("[WEBVIEW] Event listener added for VS Code messages");

    vscodeApi?.postMessage({ type: "ready" });

    return () => window.removeEventListener("message", listener);
  }, []);

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      {columnDefs.length > 0 ? (
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          gridOptions={{
            theme: themeQuartz,
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
