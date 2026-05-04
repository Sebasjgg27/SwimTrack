"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Waves, Upload, FileSpreadsheet, ArrowRight, SkipForward, CheckCircle } from "lucide-react";
import * as XLSX from "xlsx";

interface ParsedRow {
  [key: string]: string;
}

export default function ImportTimesPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<ParsedRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [imported, setImported] = useState(false);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);

    try {
      const data = await parseSpreadsheet(selectedFile);
      setPreview(data.slice(0, 5)); // Show first 5 rows
    } catch (error) {
      console.error("Error parsing file:", error);
    }
  }, []);

  const handleSkip = () => {
    router.push("/onboarding");
  };

  const handleImport = () => {
    setIsLoading(true);
    // Store imported data in localStorage for demo
    localStorage.setItem("swimtrack_imported_times", JSON.stringify(preview));
    setTimeout(() => {
      setIsLoading(false);
      setImported(true);
    }, 1000);
  };

  const handleContinue = () => {
    router.push("/onboarding");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <Waves className="w-10 h-10 text-primary" />
            <span className="text-3xl font-bold text-white">SwimTrack</span>
          </Link>
          <h1 className="text-2xl font-bold text-white mt-6">Import Your Times</h1>
          <p className="text-slate-400 mt-2">Upload a file with your competition times (optional)</p>
        </div>

        <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-8">
          {!imported ? (
            <>
              {!file ? (
                <div className="text-center">
                  <div className="border-2 border-dashed border-slate-600 rounded-xl p-8 mb-6 hover:border-primary transition-colors">
                    <Upload className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                    <p className="text-slate-300 mb-2">Drop your file here or click to browse</p>
                    <p className="text-sm text-slate-500">Supports XLSX, CSV, TXT</p>
                    <input
                      type="file"
                      accept=".xlsx,.xls,.csv,.txt"
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-input"
                    />
                    <label
                      htmlFor="file-input"
                      className="inline-block mt-4 bg-primary text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-primary-dark transition-colors"
                    >
                      Choose File
                    </label>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-slate-500 mb-4">
                    <div className="h-px bg-slate-700 flex-1"></div>
                    <span className="text-sm">or</span>
                    <div className="h-px bg-slate-700 flex-1"></div>
                  </div>

                  <button
                    onClick={handleSkip}
                    className="text-slate-400 hover:text-white transition-colors inline-flex items-center gap-2"
                  >
                    <SkipForward className="w-4 h-4" />
                    Skip for now
                  </button>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-3 mb-4 p-4 bg-slate-700/50 rounded-lg">
                    <FileSpreadsheet className="w-8 h-8 text-success" />
                    <div className="flex-1">
                      <p className="text-white font-medium">{file.name}</p>
                      <p className="text-sm text-slate-400">{preview.length > 0 ? `${preview.length} rows detected` : 'Parsing...'}</p>
                    </div>
                  </div>

                  {preview.length > 0 && (
                    <div className="mb-6">
                      <p className="text-sm text-slate-400 mb-2">Preview (first 5 rows):</p>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-slate-700/50">
                            <tr>
                              {Object.keys(preview[0] || {}).slice(0, 5).map((key) => (
                                <th key={key} className="px-3 py-2 text-left text-slate-300 font-medium">
                                  {key}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {preview.map((row, i) => (
                              <tr key={i} className="border-t border-slate-700">
                                {Object.values(row).slice(0, 5).map((val, j) => (
                                  <td key={j} className="px-3 py-2 text-slate-300">
                                    {val || "-"}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4">
                    <button
                      onClick={() => { setFile(null); setPreview([]); }}
                      className="flex-1 py-3 px-4 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors"
                    >
                      Remove File
                    </button>
                    <button
                      onClick={handleSkip}
                      className="py-3 px-4 text-slate-400 hover:text-white transition-colors inline-flex items-center gap-2"
                    >
                      Skip
                    </button>
                    <button
                      onClick={handleImport}
                      disabled={isLoading || preview.length === 0}
                      className="flex-1 py-3 px-4 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-2"
                    >
                      {isLoading ? "Importing..." : "Import Times"}
                      {!isLoading && <ArrowRight className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 mx-auto mb-4 text-success" />
              <h2 className="text-xl font-bold text-white mb-2">Times Imported!</h2>
              <p className="text-slate-400 mb-6">Your competition times have been added successfully.</p>
              <button
                onClick={handleContinue}
                className="bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors inline-flex items-center gap-2"
              >
                Continue to Profile Setup
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={handleSkip}
            className="text-slate-500 text-sm hover:text-slate-300"
          >
            Skip this step completely →
          </button>
        </div>
      </div>
    </div>
  );
}

async function parseSpreadsheet(file: File): Promise<ParsedRow[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(firstSheet, { header: 1 }) as unknown[][];
        
        if (json.length === 0) {
          resolve([]);
          return;
        }

        const headers = json[0].map((cell: unknown) => String(cell));
        const rows = json.slice(1).map((row: unknown[]) => {
          const obj: ParsedRow = {};
          headers.forEach((header: string, i: number) => {
            obj[header] = String(row[i] ?? "");
          });
          return obj;
        });

        resolve(rows);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}