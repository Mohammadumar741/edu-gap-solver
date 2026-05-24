import { useCallback, useState } from "react";
import { Upload, FileText, Loader2, CheckCircle2, Zap, Download, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ROADMAPS, type Semester } from "@/lib/curriculum-data";
import { Combobox } from "@/components/ui/combobox";
import { CAREER_TRACK_SUGGESTIONS } from "@/lib/suggestions";
import { useLocalState } from "@/lib/storage";
import { CourseCard } from "@/components/course-card";
import { cn } from "@/lib/utils";
import { extractPdfText } from "@/lib/pdf-parse";
import { jsPDF } from "jspdf";

export function AnalyzerView() {
  const [file, setFile] = useState<File | null>(null);
  const [track, setTrack] = useState<string>("Computer Science Engineering");
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiRoadmap, setAiRoadmap] = useState<Semester[] | null>(null);
  const [completed, setCompleted] = useLocalState<Record<string, boolean>>("tg.analyzer.completed", {});
  const [dragOver, setDragOver] = useState(false);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) setFile(f);
  }, []);

  const generate = async () => {
    setLoading(true);
    setGenerated(false);
    setError(null);
    setAiRoadmap(null);
    try {
      let syllabusText = "";
      if (file) {
        syllabusText = await extractPdfText(file);
      }
      if (!syllabusText) {
        // fall back to dummy roadmap if no file
        setGenerated(true);
        setLoading(false);
        return;
      }
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "analyze",
          payload: { syllabusText, track },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Analysis failed");
      if (Array.isArray(data?.semesters)) {
        setAiRoadmap(data.semesters as Semester[]);
      }
      setGenerated(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const fallbackRoadmap = ROADMAPS[track as keyof typeof ROADMAPS] ?? ROADMAPS["Computer Science Engineering"];
  const roadmap: Semester[] = aiRoadmap ?? fallbackRoadmap;
  const totalGaps = roadmap.reduce((n, s) => n + s.missing.length, 0);
  const closedGaps = roadmap.reduce(
    (n, s) => n + s.missing.filter((m) => completed[m.id]).length,
    0,
  );

  const exportPdf = () => {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageW = doc.internal.pageSize.getWidth();
    let y = 48;
    doc.setFontSize(18);
    doc.text("TechGap Analyzer — 4-Year Roadmap", 40, y);
    y += 18;
    doc.setFontSize(11);
    doc.setTextColor(110);
    doc.text(`Track: ${track}  ·  Gaps closed: ${closedGaps}/${totalGaps}`, 40, y);
    y += 22;
    doc.setTextColor(20);

    roadmap.forEach((sem) => {
      if (y > 760) { doc.addPage(); y = 48; }
      doc.setFontSize(13);
      doc.setFont("helvetica", "bold");
      doc.text(`${sem.label} (Year ${sem.year})`, 40, y);
      y += 14;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(110);
      const cov = doc.splitTextToSize(`Covered: ${sem.covered.join(", ")}`, pageW - 80);
      doc.text(cov, 40, y);
      y += cov.length * 12 + 4;
      doc.setTextColor(20);
      sem.missing.forEach((m) => {
        if (y > 770) { doc.addPage(); y = 48; }
        const done = completed[m.id] ? "[x]" : "[ ]";
        const line = doc.splitTextToSize(`${done} ${m.skill}  →  ${m.course.title} (${m.course.provider}, ${m.course.hours}h)`, pageW - 80);
        doc.text(line, 48, y);
        y += line.length * 12 + 2;
      });
      y += 10;
    });

    doc.save(`techgap-roadmap-${track.replace(/\s+/g, "-").toLowerCase()}.pdf`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <header>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          Bridge your <span className="text-primary">syllabus → industry</span> gap
        </h1>
        <p className="text-sm text-muted-foreground mt-1.5">
          Upload your college syllabus PDF and get a 4-year roadmap of the modern skills your degree is missing.
        </p>
      </header>

      <div className="grid lg:grid-cols-[1fr_320px] gap-4">
        {/* Upload zone */}
        <label
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={cn(
            "relative cursor-pointer rounded-xl border-2 border-dashed transition-all p-8 sm:p-10 flex flex-col items-center justify-center text-center bg-card/40",
            dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
          )}
        >
          <input
            type="file"
            accept=".pdf"
            className="sr-only"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
          <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
            {file ? <FileText className="h-6 w-6 text-primary" /> : <Upload className="h-6 w-6 text-primary" />}
          </div>
          {file ? (
            <>
              <div className="font-medium text-sm">{file.name}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {(file.size / 1024).toFixed(1)} KB · click to replace
              </div>
            </>
          ) : (
            <>
              <div className="font-medium text-sm">Drop your syllabus PDF here</div>
              <div className="text-xs text-muted-foreground mt-1">or click to browse · no login required</div>
            </>
          )}
        </label>

        {/* Controls */}
        <div className="rounded-xl border border-border/60 bg-card/60 p-4 space-y-3">
          <div>
            <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono">
              Target career track
            </label>
            <div className="mt-1.5">
              <Combobox
                value={track}
                onChange={setTrack}
                options={CAREER_TRACK_SUGGESTIONS}
                placeholder="e.g. Computer Science Engineering (CSE)"
              />
            </div>
          </div>
          <Button
            onClick={generate}
            disabled={loading}
            className="w-full font-medium"
            style={{ background: "var(--gradient-primary)", color: "var(--primary-foreground)" }}
          >
            {loading ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> {file ? "Parsing & analyzing with Gemini…" : "Loading…"}</>
            ) : (
              <><Zap className="h-4 w-4 mr-2" /> Generate Roadmap</>
            )}
          </Button>
          {error && (
            <div className="text-xs text-destructive flex items-start gap-1.5 pt-1">
              <AlertCircle className="h-3.5 w-3.5 mt-px shrink-0" /> <span>{error}</span>
            </div>
          )}
          {generated && (
            <div className="text-xs text-muted-foreground pt-1">
              {closedGaps}/{totalGaps} gaps closed ·{" "}
              <span className="text-primary">{Math.round((closedGaps / totalGaps) * 100)}%</span> industry-ready
              {aiRoadmap && <span className="ml-1.5 text-primary/70">· AI-generated</span>}
            </div>
          )}
        </div>
      </div>

      {/* Roadmap timeline */}
      {generated && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <h2 className="text-lg font-semibold">4-Year Roadmap · {track}</h2>
            <Button onClick={exportPdf} variant="outline" size="sm" className="border-border/60">
              <Download className="h-3.5 w-3.5 mr-1.5" /> Export Roadmap to PDF
            </Button>
          </div>

          {[1, 2, 3, 4].map((year) => (
            <div key={year}>
              <div className="flex items-center gap-3 mb-2">
                <div className="text-[10px] uppercase tracking-widest font-mono text-primary/80">
                  Year {year}
                </div>
                <div className="flex-1 h-px bg-border/60" />
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                {roadmap
                  .filter((s) => s.year === year)
                  .map((sem) => (
                    <div key={sem.label} className="rounded-xl border border-border/60 bg-card/60 p-4">
                      <div className="flex items-baseline justify-between">
                        <div className="font-mono text-sm font-semibold">{sem.label}</div>
                        <div className="text-[10px] text-muted-foreground">
                          {sem.missing.length} gap{sem.missing.length !== 1 && "s"}
                        </div>
                      </div>
                      <div className="mt-1.5 text-[11px] text-muted-foreground">
                        Covered: {sem.covered.join(" · ")}
                      </div>

                      <div className="mt-3 space-y-2.5">
                        {sem.missing.map((m) => {
                          const done = !!completed[m.id];
                          return (
                            <div key={m.id} className="space-y-2">
                              <label className="flex items-start gap-2.5 cursor-pointer group">
                                <Checkbox
                                  checked={done}
                                  onCheckedChange={(c) =>
                                    setCompleted({ ...completed, [m.id]: !!c })
                                  }
                                  className="mt-0.5"
                                />
                                <div className="min-w-0 flex-1">
                                  <div className={cn(
                                    "text-sm font-medium leading-snug transition-colors",
                                    done && "line-through text-muted-foreground",
                                  )}>
                                    {m.skill}
                                  </div>
                                </div>
                                {done && <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />}
                              </label>
                              {!done && <CourseCard course={m.course} />}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}