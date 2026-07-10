"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Save, CheckCircle, Eye, Edit, Globe, Users, Trophy, Calendar } from "lucide-react";

interface ContentSection {
  id: string;
  title: string;
  content: string;
  enabled: boolean;
}

const defaultSections: ContentSection[] = [
  { id: "hero", title: "Hero Section", content: "Track your swimming progress", enabled: true },
  { id: "about", title: "About Section", content: "SwimTrack helps swimmers track their times", enabled: true },
  { id: "features", title: "Features", content: "Track times, view leaderboards, import results", enabled: true },
  { id: "testimonials", title: "Testimonials", content: "What coaches say", enabled: false },
  { id: "cta", title: "Call to Action", content: "Start tracking today", enabled: true },
];

export default function ContentPage() {
  const [sections, setSections] = useState<ContentSection[]>(defaultSections);
  const [isSaving, setIsSaving] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("web_content");
    if (saved) {
      setSections(JSON.parse(saved));
    }
  }, []);

  const handleContentChange = (id: string, content: string) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, content } : s));
  };

  const handleToggle = (id: string) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));
  };

  const handleSave = () => {
    setIsSaving(true);
    localStorage.setItem("web_content", JSON.stringify(sections));
    setIsSaving(false);
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2000);
  };

  const handlePreview = () => {
    localStorage.setItem("web_content_preview", JSON.stringify(sections));
    window.open("/", "_blank");
  };

  return (
    <DashboardLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Web Content</h1>
          <p className="text-slate-600 mt-1">Manage your website content</p>
        </div>
        <div className="flex items-center gap-3">
          {showSaved && (
            <div className="flex items-center gap-2 text-success">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Saved!</span>
            </div>
          )}
          <Button variant="outline" onClick={() => setPreviewMode(!previewMode)}>
            <Eye className="w-4 h-4 mr-2" />
            {previewMode ? "Edit Mode" : "Preview"}
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              Home Page Sections
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {sections.map((section) => (
              <div
                key={section.id}
                className={`p-4 border rounded-lg ${section.enabled ? "border-slate-200" : "border-slate-100 opacity-60"}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {section.id === "hero" && <Trophy className="w-4 h-4 text-accent" />}
                    {section.id === "about" && <Users className="w-4 h-4 text-primary" />}
                    {section.id === "features" && <Edit className="w-4 h-4 text-secondary" />}
                    {section.id === "testimonials" && <Users className="w-4 h-4 text-accent" />}
                    {section.id === "cta" && <Calendar className="w-4 h-4 text-success" />}
                    <span className="font-medium">{section.title}</span>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={section.enabled}
                      onChange={() => handleToggle(section.id)}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-sm text-slate-500">Enabled</span>
                  </label>
                </div>
                {previewMode ? (
                  <div className="p-3 bg-slate-50 rounded text-sm text-slate-600">
                    {section.content}
                  </div>
                ) : (
                  <textarea
                    value={section.content}
                    onChange={(e) => handleContentChange(section.id, e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    disabled={!section.enabled}
                  />
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-800 rounded-lg p-4 min-h-[400px]">
              <div className="bg-white rounded-lg p-6 space-y-6">
                {sections.filter(s => s.enabled).map((section) => (
                  <div key={section.id}>
                    <h3 className="font-semibold text-lg mb-2">{section.title}</h3>
                    <p className="text-slate-600">{section.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}