"use client";

import { useState } from "react";
import { AlertTriangle, FileText, Upload } from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PreviewData {
  fileName: string;
  headers: string[];
  rows: string[][];
}

export default function ImportPage() {
  const [preview, setPreview] = useState<PreviewData | null>(null);
  const [error, setError] = useState("");

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setError("");

    try {
      const lines = (await file.text()).split(/\r?\n/).filter((line) => line.trim());
      if (lines.length === 0) throw new Error("The file is empty.");
      const delimiter = file.name.toLowerCase().endsWith(".csv") ? "," : /\t/.test(lines[0]) ? "\t" : ",";
      const parsed = lines.map((line) => line.split(delimiter).map((cell) => cell.trim()));
      setPreview({ fileName: file.name, headers: parsed[0], rows: parsed.slice(1, 11) });
    } catch (caught) {
      setPreview(null);
      setError(caught instanceof Error ? caught.message : "The file could not be read.");
    }
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold text-slate-900">Result Import Preview</h1>
      <p className="mt-1 text-slate-600">Check how a CSV, TXT, or Markdown table could be read</p>

      <Card className="mt-6 border-amber-200 bg-amber-50/60">
        <CardContent className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
          <p className="text-sm text-slate-700"><strong>Preview only:</strong> this beta reads the file in your browser for inspection. It does not upload or save results.</p>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader><CardTitle>Choose a text-based results file</CardTitle></CardHeader>
        <CardContent>
          <label className="flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed border-slate-300 p-10 text-center hover:border-primary">
            <Upload className="mb-3 h-10 w-10 text-slate-400" />
            <span className="font-medium text-slate-700">Choose CSV, TXT, or MD</span>
            <span className="mt-1 text-sm text-slate-500">The first row is treated as column headings</span>
            <input type="file" accept=".csv,.txt,.md,text/csv,text/plain" onChange={handleFile} className="sr-only" />
          </label>
          {error && <p role="alert" className="mt-4 text-sm text-error">{error}</p>}
        </CardContent>
      </Card>

      {preview && (
        <Card className="mt-6">
          <CardHeader className="flex flex-row items-center justify-between gap-3"><div><CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5 text-primary" />{preview.fileName}</CardTitle><p className="mt-1 text-sm text-slate-500">Showing up to 10 rows; nothing has been saved</p></div><Button variant="outline" onClick={() => setPreview(null)}>Clear</Button></CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full min-w-max text-sm"><thead><tr className="border-b bg-slate-50">{preview.headers.map((header, index) => <th key={`${header}-${index}`} className="px-3 py-2 text-left font-medium text-slate-700">{header || `Column ${index + 1}`}</th>)}</tr></thead><tbody>{preview.rows.map((row, rowIndex) => <tr key={rowIndex} className="border-b border-slate-100">{preview.headers.map((_, columnIndex) => <td key={columnIndex} className="px-3 py-2 text-slate-600">{row[columnIndex] || "—"}</td>)}</tr>)}</tbody></table>
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  );
}
