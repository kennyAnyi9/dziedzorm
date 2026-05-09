import { Suspense } from "react";
import { getAllDocs } from "@/lib/journal/documents";
import { HomeView } from "@/components/home-view";

export default function Home() {
  const docs = getAllDocs();
  return (
    <Suspense>
      <HomeView docs={docs} />
    </Suspense>
  );
}
