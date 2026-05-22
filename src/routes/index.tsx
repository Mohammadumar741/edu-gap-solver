import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, type ViewKey } from "@/components/app-shell";
import { AnalyzerView } from "@/components/views/analyzer-view";
import { BenchmarkView } from "@/components/views/benchmark-view";
import { SprintsView } from "@/components/views/sprints-view";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TechGap Analyzer — Bridge Your Syllabus to Industry" },
      {
        name: "description",
        content:
          "Compare your engineering syllabus against modern industry requirements. Get a 4-year roadmap of the skills your degree is missing.",
      },
      { property: "og:title", content: "TechGap Analyzer" },
      { property: "og:description", content: "Bridge the gap between your college syllabus and modern industry skills." },
    ],
  }),
  component: Index,
});

function Index() {
  const [view, setView] = useState<ViewKey>("analyzer");
  return (
    <AppShell view={view} onViewChange={setView}>
      {view === "analyzer" && <AnalyzerView />}
      {view === "benchmark" && <BenchmarkView />}
      {view === "sprints" && <SprintsView />}
    </AppShell>
  );
}
