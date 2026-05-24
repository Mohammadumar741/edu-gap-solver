import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, type ViewKey } from "@/components/app-shell";
import { AnalyzerView } from "@/components/views/analyzer-view";
import { BenchmarkView } from "@/components/views/benchmark-view";
import { SprintsView } from "@/components/views/sprints-view";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TechGap Analyzer | Bridge Your Syllabus to the Industry" },
      {
        name: "description",
        content:
          "Upload your engineering syllabus or search your college to instantly find missing modern tech skills and get personalized roadmap recommendations.",
      },
      { property: "og:title", content: "TechGap Analyzer | Bridge Your Syllabus to the Industry" },
      {
        property: "og:description",
        content:
          "Upload your engineering syllabus or search your college to instantly find missing modern tech skills and get personalized roadmap recommendations.",
      },
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
