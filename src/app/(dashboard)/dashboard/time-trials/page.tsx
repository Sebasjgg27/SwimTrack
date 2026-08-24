"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { calculateCSS, calculateZones, formatPace } from "@/lib/utils";
import { Clock, Calculator, Save, RefreshCw, CheckCircle } from "lucide-react";

export default function TimeTrialsPage() {
  const [formData, setFormData] = useState({
    t400: "",
    t200: "",
    poolType: "SCM",
    trialDate: new Date().toISOString().split("T")[0],
  });
  const [calculated, setCalculated] = useState(false);
  const [zones, setZones] = useState<ReturnType<typeof calculateZones> | null>(null);
  const [css, setCss] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);

  // Load saved data on mount
  useEffect(() => {
    const savedData = localStorage.getItem("swimtrack_time_trials");
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setFormData(parsed);
      if (parsed.t400 && parsed.t200) {
        const cssValue = calculateCSS(parseTime(parsed.t400), parseTime(parsed.t200));
        if (cssValue > 0) {
          setCss(cssValue);
          setZones(calculateZones(cssValue));
          setCalculated(true);
        }
      }
    }
  }, []);

  const parseTime = (timeStr: string): number => {
    if (!timeStr) return 0;
    const parts = timeStr.split(/[:.]/);
    let ms = 0;
    
    if (parts.length === 3) {
      const minutes = parseInt(parts[0]) || 0;
      const seconds = parseInt(parts[1]) || 0;
      const centiseconds = parseInt(parts[2]) || 0;
      ms = (minutes * 60000) + (seconds * 1000) + (centiseconds * 10);
    } else if (parts.length === 2) {
      const seconds = parseInt(parts[0]) || 0;
      const centiseconds = parseInt(parts[1]) || 0;
      ms = (seconds * 1000) + (centiseconds * 10);
    } else {
      ms = parseInt(timeStr) || 0;
    }
    
    return ms;
  };

  const handleCalculate = () => {
    const t400ms = parseTime(formData.t400);
    const t200ms = parseTime(formData.t200);
    
    if (t400ms > 0 && t200ms > 0 && t400ms > t200ms) {
      const cssValue = calculateCSS(t400ms, t200ms);
      if (cssValue > 0) {
        setCss(cssValue);
        setZones(calculateZones(cssValue));
        setCalculated(true);
      }
    }
  };

  const handleSave = () => {
    localStorage.setItem("swimtrack_time_trials", JSON.stringify(formData));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    setFormData({ t400: "", t200: "", poolType: "SCM", trialDate: new Date().toISOString().split("T")[0] });
    setCalculated(false);
    setZones(null);
    setCss(null);
    localStorage.removeItem("swimtrack_time_trials");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setCalculated(false);
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Time Trials</h1>
        <p className="text-slate-600 mt-1">Enter your 400m and 200m time trials to calculate your training pace zones</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Entry Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Time Trial Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  400m Time
                </label>
                <input
                  type="text"
                  name="t400"
                  value={formData.t400}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg font-mono text-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="4:32.15"
                />
                <p className="text-xs text-slate-500 mt-1">Format: mm:ss.xx</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  200m Time
                </label>
                <input
                  type="text"
                  name="t200"
                  value={formData.t200}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg font-mono text-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="2:08.45"
                />
                <p className="text-xs text-slate-500 mt-1">Format: mm:ss.xx</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Pool Type
                </label>
                <select
                  name="poolType"
                  value={formData.poolType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="SCM">SCM (25m)</option>
                  <option value="LCM">LCM (50m)</option>
                  <option value="SCY">SCY (25y)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Trial Date
                </label>
                <input
                  type="date"
                  name="trialDate"
                  value={formData.trialDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleCalculate}
                disabled={!formData.t400 || !formData.t200}
                className="flex-1 flex items-center justify-center gap-2"
              >
                <Calculator className="w-4 h-4" />
                Calculate Zones
              </Button>
              <Button
                onClick={handleReset}
                variant="outline"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>

            {saved && (
              <div className="flex items-center gap-2 text-success">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm">Time trials saved!</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-primary" />
              Your Training Zones
            </CardTitle>
            {calculated && (
              <Button onClick={handleSave} variant="outline" size="sm" className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                Save
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {!calculated ? (
              <div className="text-center py-12 text-slate-500">
                <Clock className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                <p>Enter your 400m and 200m times to see your training zones</p>
              </div>
            ) : zones && css ? (
              <div>
                <div className="text-center mb-6 p-4 bg-primary/10 rounded-xl">
                  <p className="text-sm text-slate-600">Critical Swim Speed (CSS)</p>
                  <p className="text-4xl font-bold font-mono text-primary">{formatPace(css)}</p>
                  <p className="text-sm text-slate-500">sec/100m</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { name: "A1", label: "Recovery", range: `${formatPace(zones.a1.max)} - ${formatPace(zones.a1.min)}`, color: "bg-blue-100 text-blue-800", role: "Warm-up, cooldown" },
                    { name: "A2", label: "Endurance", range: `${formatPace(zones.a2.max)} - ${formatPace(zones.a2.min)}`, color: "bg-cyan-100 text-cyan-800", role: "Aerobic base" },
                    { name: "A3", label: "Threshold", range: `${formatPace(zones.a3.min)} - ${formatPace(zones.a3.max)}`, color: "bg-teal-100 text-teal-800", role: "Lactate threshold" },
                    { name: "VO2", label: "VO2 Max", range: `${formatPace(zones.vo2.min)} - ${formatPace(zones.vo2.max)}`, color: "bg-orange-100 text-orange-800", role: "Aerobic power" },
                    { name: "TOL", label: "Tolerance", range: `${formatPace(zones.tolerance.min)} - ${formatPace(zones.tolerance.max)}`, color: "bg-red-100 text-red-800", role: "Lactate tolerance" },
                    { name: "ALL OUT", label: "Sprint", range: formatPace(zones.allOut), color: "bg-purple-100 text-purple-800", role: "Maximum effort" },
                  ].map((zone) => (
                    <div key={zone.name} className={`rounded-lg p-3 text-center ${zone.color}`}>
                      <p className="text-xs font-medium opacity-70">{zone.label}</p>
                      <p className="text-lg font-bold font-mono mt-1">{zone.name}</p>
                      <p className="text-xs font-mono mt-1">{zone.range}</p>
                      <p className="text-xs opacity-60 mt-1">{zone.role}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                  <h4 className="font-medium text-slate-900 mb-2">How to use these zones:</h4>
                  <ul className="text-sm text-slate-600 space-y-1">
                    <li>• <strong>A1 (Recovery):</strong> Warm-up, cool-down, active recovery</li>
                    <li>• <strong>A2 (Endurance):</strong> Build aerobic base, longer distances</li>
                    <li>• <strong>A3 (Threshold):</strong> Lactate threshold training</li>
                    <li>• <strong>VO2:</strong> High intensity intervals, 3-5 min efforts</li>
                    <li>• <strong>Tolerance:</strong> Lactate tolerance, 100-200m race prep</li>
                    <li>• <strong>All Out:</strong> Sprints, 25-50m maximum effort</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500">
                <p>Invalid time values. 400m must be slower than 200m.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-slate-900">Need help with time trials?</h3>
              <p className="text-sm text-slate-500">Learn how to perform a proper CSS test</p>
            </div>
            <Button variant="outline">View Guide</Button>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
