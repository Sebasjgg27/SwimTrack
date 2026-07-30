"use client";

import { useState, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, ArrowRight, Loader2, Info } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

interface ImportState {
  step: "upload" | "select-swimmer" | "preview" | "importing" | "complete";
  file: File | null;
  preview: {
    headers: string[];
    rows: Record<string, unknown>[];
    sheetName: string;
    totalRows: number;
  } | null;
  selectedSwimmerId: string;
  result: {
    resultsCreated: number;
    meetsCreated: number;
    trialsCreated: number;
    errors: number;
    errorDetails: string[];
  } | null;
  error: string;
}

export default function ImportPage() {
  const { user } = useAuth();
  const [state, setState] = useState<ImportState>({
    step: "upload",
    file: null,
    preview: null,
    selectedSwimmerId: "",
    result: null,
    error: "",
  });
  const [swimmers, setSwimmers] = useState<{ id: string; first_name: string; last_name: string }[]>([]);
  const [isLoadingSwimmers, setIsLoadingSwimmers] = useState(false);

  const loadSwimmers = useCallback(async () => {
    setIsLoadingSwimmers(true);
    try {
      const res = await fetch("/api/swimmers");
      if (res.ok) {
        const data = await res.json();
        setSwimmers(data.swimmers || data || []);
      }
    } catch {
      // silent
    }
    setIsLoadingSwimmers(false);
  }, []);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.split(".").pop()?.toLowerCase();
    if (ext !== "xlsx" && ext !== "xls") {
      setState(prev => ({ ...prev, error: "Only .xlsx files are supported" }));
      return;
    }

    try {
      const XLSX = await import("xlsx");
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(new Uint8Array(buffer), { type: "array" });

      const sheetName = workbook.SheetNames.find(n =>
        n.toLowerCase().includes("todos") || n.toLowerCase().includes("tiempos")
      ) || workbook.SheetNames[0];

      const sheet = workbook.Sheets[sheetName];
      const raw = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as unknown[][];

      if (raw.length < 2) {
        setState(prev => ({ ...prev, error: "File appears to be empty" }));
        return;
      }

      const headers = raw[0].map(h => String(h || ""));
      const rows = raw.slice(1)
        .filter(row => row && row.some(c => c !== null && c !== undefined && String(c).trim() !== ""))
        .map(row => {
          const obj: Record<string, unknown> = {};
          headers.forEach((h, i) => { obj[h] = (row as unknown[])[i] ?? ""; });
          return obj;
        });

      setState(prev => ({
        ...prev,
        file,
        preview: { headers, rows, sheetName, totalRows: rows.length },
        step: "select-swimmer",
        error: "",
      }));

      loadSwimmers();
    } catch {
      setState(prev => ({ ...prev, error: "Failed to parse Excel file" }));
    }
  }, [loadSwimmers]);

  const handleImport = useCallback(async () => {
    if (!state.file || !state.selectedSwimmerId) return;

    setState(prev => ({ ...prev, step: "importing" }));

    try {
      const formData = new FormData();
      formData.append("file", state.file);
      formData.append("swimmer_id", state.selectedSwimmerId);

      const res = await fetch("/api/import", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        setState(prev => ({ ...prev, step: "preview", error: data.error || "Import failed" }));
        return;
      }

      setState(prev => ({
        ...prev,
        step: "complete",
        result: data.summary,
      }));
    } catch {
      setState(prev => ({ ...prev, step: "preview", error: "Network error during import" }));
    }
  }, [state.file, state.selectedSwimmerId]);

  const stepNames = ["Upload", "Select Swimmer", "Preview", "Import", "Complete"];
  const stepIndex = state.step === "upload" ? 0 : state.step === "select-swimmer" ? 1 : state.step === "preview" ? 2 : state.step === "importing" ? 3 : 4;
  const preview = state.preview;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Import Times</h1>
        <p className="text-slate-600 mt-1">Import swim times from your Excel template</p>
      </div>

      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
        {stepNames.map((name, i) => (
          <div key={name} className="flex items-center flex-shrink-0">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              i <= stepIndex ? "bg-primary text-white" : "bg-slate-200 text-slate-500"
            }`}>
              {i < stepIndex ? <CheckCircle className="w-4 h-4" /> : i + 1}
            </div>
            <span className={`ml-2 text-sm whitespace-nowrap ${i <= stepIndex ? "text-slate-900" : "text-slate-500"}`}>
              {name}
            </span>
            {i < stepNames.length - 1 && <div className="w-8 h-0.5 bg-slate-200 mx-2 flex-shrink-0" />}
          </div>
        ))}
      </div>

      {state.error && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="pt-4">
            <p className="text-sm text-red-600 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {state.error}
            </p>
          </CardContent>
        </Card>
      )}

      {state.step === "upload" && (
        <Card>
          <CardHeader>
            <CardTitle>Upload Your Excel File</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Expected format: &quot;Todos los Tiempos&quot; sheet</p>
                  <p>Your Excel file should have columns: <strong>Fecha</strong>, <strong>Tipo</strong>, <strong>Nombre</strong>, and event columns like <strong>Libre 50m</strong>, <strong>Espalda 100m</strong>, etc.</p>
                  <p className="mt-1">Times should be in <code>MM:SS.mmm</code> format. Competition rows create results, training rows create time trials.</p>
                </div>
              </div>
            </div>

            <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-primary transition-colors">
              <FileSpreadsheet className="w-12 h-12 mx-auto mb-4 text-slate-400" />
              <p className="text-slate-600 mb-4">
                {state.file ? state.file.name : "Drop your .xlsx file here or click to browse"}
              </p>
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                className="hidden"
                id="file-input"
              />
              <Button onClick={() => document.getElementById("file-input")?.click()}>
                <Upload className="w-4 h-4 mr-2" />
                Choose File
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {state.step === "select-swimmer" && preview && (
        <Card>
          <CardHeader>
            <CardTitle>Select Swimmer</CardTitle>
            <p className="text-sm text-slate-500 mt-1">
              Found {preview.totalRows} data rows in &quot;{preview.sheetName}&quot; sheet
            </p>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Whose times are these?
              </label>
              {isLoadingSwimmers ? (
                <div className="flex items-center gap-2 text-slate-500">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading swimmers...
                </div>
              ) : (
                <select
                  value={state.selectedSwimmerId}
                  onChange={(e) => setState(prev => ({ ...prev, selectedSwimmerId: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                >
                  <option value="">Select a swimmer</option>
                  {swimmers.map(s => (
                    <option key={s.id} value={s.id}>{s.first_name} {s.last_name}</option>
                  ))}
                </select>
              )}
            </div>

            <div className="overflow-x-auto max-h-64 overflow-y-auto border border-slate-200 rounded-lg">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 sticky top-0">
                  <tr>
                    {preview.headers.slice(0, 8).map(h => (
                      <th key={h} className="px-3 py-2 text-left font-medium text-slate-600 border-b">
                        {h}
                      </th>
                    ))}
                    {preview.headers.length > 8 && (
                      <th className="px-3 py-2 text-left font-medium text-slate-600 border-b">
                        +{preview.headers.length - 8} more
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {preview.rows.slice(0, 10).map((row, i) => (
                    <tr key={i} className="border-b border-slate-100">
                      {preview.headers.slice(0, 8).map(h => (
                        <td key={h} className="px-3 py-2 text-slate-700">
                          {String(row[h] ?? "").substring(0, 30) || "-"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {preview.totalRows > 10 && (
              <p className="text-xs text-slate-500 mt-2">Showing first 10 of {preview.totalRows} rows</p>
            )}

            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={() => setState(prev => ({ ...prev, step: "upload", preview: null }))}>
                Back
              </Button>
              <Button
                onClick={() => setState(prev => ({ ...prev, step: "preview" }))}
                disabled={!state.selectedSwimmerId}
              >
                Preview Import
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {state.step === "preview" && preview && (
        <Card>
          <CardHeader>
            <CardTitle>Ready to Import</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-slate-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-slate-900">{preview.totalRows}</p>
                <p className="text-sm text-slate-600">Data rows</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-slate-900">{preview.headers.length}</p>
                <p className="text-sm text-slate-600">Columns</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-slate-900">
                  {preview.headers.filter(h => EVENT_COLUMNS.includes(h)).length}
                </p>
                <p className="text-sm text-slate-600">Event columns</p>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-amber-800">
                <strong>What will happen:</strong> Competition rows (Tipo = &quot;Competencia&quot;) will create meets and results.
                Training rows (Tipo = &quot;Entreno&quot;) will create time trials.
              </p>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setState(prev => ({ ...prev, step: "select-swimmer" }))}>
                Back
              </Button>
              <Button onClick={handleImport}>
                Import {preview.totalRows} Rows
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {state.step === "importing" && (
        <Card>
          <CardContent className="text-center py-12">
            <Loader2 className="w-12 h-12 mx-auto mb-4 text-primary animate-spin" />
            <h2 className="text-xl font-bold text-slate-900 mb-2">Importing...</h2>
            <p className="text-slate-600">This may take a moment for large files.</p>
          </CardContent>
        </Card>
      )}

      {state.step === "complete" && state.result && (
        <Card>
          <CardContent className="text-center py-12">
            <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Import Complete!</h2>

            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-6">
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-2xl font-bold text-blue-600">{state.result.meetsCreated}</p>
                <p className="text-xs text-blue-800">Meets created</p>
              </div>
              <div className="bg-green-50 rounded-lg p-3">
                <p className="text-2xl font-bold text-green-600">{state.result.resultsCreated}</p>
                <p className="text-xs text-green-800">Results saved</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-3">
                <p className="text-2xl font-bold text-purple-600">{state.result.trialsCreated}</p>
                <p className="text-xs text-purple-800">Time trials saved</p>
              </div>
            </div>

            {state.result.errors > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md mx-auto mb-6 text-left">
                <p className="text-sm font-medium text-red-800 mb-2">
                  {state.result.errors} row(s) had errors:
                </p>
                {state.result.errorDetails.map((err, i) => (
                  <p key={i} className="text-xs text-red-600">{err}</p>
                ))}
              </div>
            )}

            <Button onClick={() => setState({ step: "upload", file: null, preview: null, selectedSwimmerId: "", result: null, error: "" })}>
              Import Another File
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

const EVENT_COLUMNS = [
  "Libre 25m", "Libre 50m", "Libre 100m", "Libre 200m", "Libre 400m", "Libre 800m", "Libre 1500m",
  "Espalda 25m", "Espalda 50m", "Espalda 100m", "Espalda 200m",
  "Pecho 25m", "Pecho 50m", "Pecho 100m", "Pecho 200m",
  "Mariposa 25m", "Mariposa 50m", "Mariposa 100m", "Mariposa 200m",
  "Comb 100m", "Comb 200m", "Comb 400m",
];
