"use client";

import { useState, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Upload, FileSpreadsheet, FileText, FileCode, CheckCircle, AlertCircle, ArrowRight, Save } from "lucide-react";
import * as XLSX from "xlsx";

type FileFormat = "xlsx" | "csv" | "txt" | "md" | "lenex" | "sdif";

interface ParsedRow {
  [key: string]: string;
}

interface ImportState {
  step: "upload" | "mapping" | "preview" | "complete";
  file: File | null;
  format: FileFormat;
  headers: string[];
  rows: ParsedRow[];
  columnMapping: Record<string, string>;
  errors: string[];
}

const formatOptions = [
  { value: "xlsx", label: "Excel (.xlsx)", icon: FileSpreadsheet },
  { value: "csv", label: "CSV (.csv)", icon: FileSpreadsheet },
  { value: "txt", label: "Text (.txt)", icon: FileText },
  { value: "md", label: "Markdown (.md)", icon: FileText },
  { value: "lenex", label: "Lenex (.lxf, .lef)", icon: FileCode },
  { value: "sdif", label: "SDIF (.sd3)", icon: FileCode },
];

const targetFields = [
  { value: "swimmer_name", label: "Swimmer Name" },
  { value: "first_name", label: "First Name" },
  { value: "last_name", label: "Last Name" },
  { value: "event", label: "Event (e.g., 100m Free)" },
  { value: "time", label: "Time (e.g., 52.34)" },
  { value: "time_ms", label: "Time in milliseconds" },
  { value: "meet_name", label: "Meet Name" },
  { value: "meet_date", label: "Meet Date" },
  { value: "pool_type", label: "Pool Type (SCM/SCY/LCM)" },
  { value: "club", label: "Club" },
  { value: "skip", label: "Skip Column" },
];

export default function ImportPage() {
  const [state, setState] = useState<ImportState>({
    step: "upload",
    file: null,
    format: "xlsx",
    headers: [],
    rows: [],
    columnMapping: {},
    errors: [],
  });

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const format = file.name.split(".").pop()?.toLowerCase() as FileFormat;
    
    try {
      let headers: string[] = [];
      let rows: ParsedRow[] = [];

      if (format === "xlsx" || format === "csv") {
        const data = await parseSpreadsheet(file);
        headers = data.headers;
        rows = data.rows;
      } else if (format === "txt" || format === "md") {
        const data = await parseTextFile(file);
        headers = data.headers;
        rows = data.rows;
      } else {
        setState(prev => ({ ...prev, errors: [`Format ${format} parsing not yet implemented`] }));
        return;
      }

      setState(prev => ({
        ...prev,
        file,
        format,
        headers,
        rows,
        step: "mapping",
        errors: [],
      }));
    } catch (error) {
      setState(prev => ({ ...prev, errors: ["Failed to parse file"] }));
    }
  }, []);

  const handleMappingChange = useCallback((header: string, target: string) => {
    setState(prev => ({
      ...prev,
      columnMapping: { ...prev.columnMapping, [header]: target },
    }));
  }, []);

  const handleImport = useCallback(() => {
    setState(prev => ({ ...prev, step: "complete" }));
  }, []);

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Import Times</h1>
        <p className="text-slate-600 mt-1">Import swimmer times from various file formats</p>
      </div>

      <div className="flex items-center gap-4 mb-8">
        {["Upload", "Map Columns", "Preview", "Complete"].map((step, i) => (
          <div key={step} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${
              state.step === "upload" && i === 0 ? "bg-primary text-white" :
              state.step === "mapping" && i <= 1 ? "bg-primary text-white" :
              state.step === "preview" && i <= 2 ? "bg-primary text-white" :
              state.step === "complete" ? "bg-success text-white" :
              "bg-slate-200 text-slate-500"
            }`}>
              {i + 1}
            </div>
            <span className={`ml-2 text-sm ${state.step === step.toLowerCase().replace(" ", "") || 
              (state.step === "complete" && i === 3) ? "text-slate-900" : "text-slate-500"}`}>
              {step}
            </span>
            {i < 3 && <div className="w-8 h-0.5 bg-slate-200 mx-2" />}
          </div>
        ))}
      </div>

      {state.errors.length > 0 && (
        <Card className="mb-6 border-error/50 bg-error/5">
          <CardContent className="pt-4">
            {state.errors.map((err, i) => (
              <p key={i} className="text-sm text-error flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {err}
              </p>
            ))}
          </CardContent>
        </Card>
      )}

      {state.step === "upload" && (
        <Card>
          <CardHeader>
            <CardTitle>Select File Format</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
              {formatOptions.map((opt) => (
                <label
                  key={opt.value}
                  className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                    state.format === opt.value
                      ? "border-primary bg-primary/5"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="format"
                    value={opt.value}
                    checked={state.format === opt.value}
                    onChange={(e) => setState(prev => ({ ...prev, format: e.target.value as FileFormat }))}
                    className="sr-only"
                  />
                  <opt.icon className={`w-8 h-8 mb-2 ${state.format === opt.value ? "text-primary" : "text-slate-400"}`} />
                  <span className={`text-sm text-center ${state.format === opt.value ? "text-primary font-medium" : "text-slate-600"}`}>
                    {opt.label}
                  </span>
                </label>
              ))}
            </div>

            <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-primary transition-colors">
              <Upload className="w-12 h-12 mx-auto mb-4 text-slate-400" />
              <p className="text-slate-600 mb-4">Drop your file here or click to browse</p>
              <input
                type="file"
                accept=".xlsx,.xls,.csv,.txt,.md,.lxf,.lef,.sd3"
                onChange={handleFileChange}
                className="hidden"
                id="file-input"
              />
              <Button onClick={() => document.getElementById("file-input")?.click()}>
                Choose File
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {state.step === "mapping" && (
        <Card>
          <CardHeader>
            <CardTitle>Map Columns</CardTitle>
            <p className="text-sm text-slate-500 mt-1">Match your file columns to SwimTrack fields</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mb-6">
              {state.headers.map((header) => (
                <div key={header} className="flex items-center gap-4">
                  <div className="w-48 font-medium text-slate-700 truncate">{header}</div>
                  <ArrowRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <Select
                    options={targetFields}
                    value={state.columnMapping[header] || ""}
                    onChange={(e) => handleMappingChange(header, e.target.value)}
                    placeholder="Select target field"
                    className="flex-1"
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setState(prev => ({ ...prev, step: "upload" }))}>
                Back
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Save Template
                </Button>
                <Button onClick={() => setState(prev => ({ ...prev, step: "preview" }))}>
                  Continue
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {state.step === "preview" && (
        <Card>
          <CardHeader>
            <CardTitle>Preview Import</CardTitle>
            <p className="text-sm text-slate-500 mt-1">{state.rows.length} rows found</p>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    {Object.values(state.columnMapping).filter(f => f !== "skip").map((field) => (
                      <th key={field} className="px-4 py-2 text-left font-medium text-slate-600">
                        {targetFields.find(f => f.value === field)?.label || field}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {state.rows.slice(0, 10).map((row, i) => (
                    <tr key={i} className="border-b border-slate-100">
                      {Object.entries(state.columnMapping).filter(([_, f]) => f !== "skip").map(([_, field]) => (
                        <td key={field} className="px-4 py-2">{row[field] || "-"}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {state.rows.length > 10 && (
              <p className="p-4 text-sm text-slate-500">Showing first 10 of {state.rows.length} rows</p>
            )}
          </CardContent>
          <CardContent className="flex justify-between pt-4">
            <Button variant="outline" onClick={() => setState(prev => ({ ...prev, step: "mapping" }))}>
              Back
            </Button>
            <Button onClick={handleImport}>Import {state.rows.length} Results</Button>
          </CardContent>
        </Card>
      )}

      {state.step === "complete" && (
        <Card>
          <CardContent className="text-center py-12">
            <CheckCircle className="w-16 h-16 mx-auto mb-4 text-success" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Import Complete!</h2>
            <p className="text-slate-600 mb-6">{state.rows.length} results have been imported successfully</p>
            <Button onClick={() => setState(prev => ({ ...prev, step: "upload", rows: [], headers: [], columnMapping: {} }))}>
              Import More
            </Button>
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  );
}

async function parseSpreadsheet(file: File): Promise<{ headers: string[]; rows: ParsedRow[] }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json<Record<string, string>>(firstSheet, { header: 1 });
        
        if (json.length === 0) {
          resolve({ headers: [], rows: [] });
          return;
        }

        const headers = json[0].map(String);
        const rows = json.slice(1).map(row => {
          const obj: ParsedRow = {};
          headers.forEach((header, i) => {
            obj[header] = String(row[i] ?? "");
          });
          return obj;
        });

        resolve({ headers, rows });
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

async function parseTextFile(file: File): Promise<{ headers: string[]; rows: ParsedRow[] }> {
  const text = await file.text();
  const lines = text.trim().split("\n");
  
  if (lines.length === 0) return { headers: [], rows: [] };

  const delimiter = lines[0].includes("\t") ? "\t" : ",";
  const headers = lines[0].split(delimiter).map(h => h.trim());
  const rows = lines.slice(1).map(line => {
    const values = line.split(delimiter);
    const obj: ParsedRow = {};
    headers.forEach((header, i) => {
      obj[header] = values[i]?.trim() || "";
    });
    return obj;
  });

  return { headers, rows };
}