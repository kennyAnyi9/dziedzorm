// Generate shadcn-compatible registry JSON from craft components.
// Usage: bun run scripts/generate-registry.ts

import { readdirSync, readFileSync, writeFileSync, mkdirSync } from "fs";
import { join, resolve } from "path";

const ROOT = resolve(import.meta.dir, "..");
const REGISTRY_SRC = join(ROOT, "registry", "default");
const OUTPUT_DIR = join(ROOT, "public", "r");

// Packages that are not external dependencies
const INTERNAL_PREFIXES = ["react", "@/", ".", "next"];

function extractDependencies(source: string): string[] {
  const deps = new Set<string>();
  // Match import ... from "package" and import "package"
  const importRegex = /(?:import\s.*?from\s+|import\s+)["']([^"']+)["']/g;
  let match;
  while ((match = importRegex.exec(source)) !== null) {
    const specifier = match[1];
    if (INTERNAL_PREFIXES.some((p) => specifier.startsWith(p))) continue;
    // Handle scoped packages: @scope/pkg → @scope/pkg
    // Handle deep imports: pkg/sub → pkg
    const parts = specifier.startsWith("@")
      ? specifier.split("/").slice(0, 2).join("/")
      : specifier.split("/")[0];
    deps.add(parts);
  }
  return [...deps];
}

async function main() {
  mkdirSync(OUTPUT_DIR, { recursive: true });

  const dirs = readdirSync(REGISTRY_SRC, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  const registryItems: Array<{
    name: string;
    type: string;
    title: string;
    description: string;
    dependencies: string[];
    files: Array<{ path: string; type: string }>;
  }> = [];

  for (const dir of dirs) {
    const dirPath = join(REGISTRY_SRC, dir);

    // Find main component file (<name>.tsx)
    const componentFile = `${dir}.tsx`;
    const componentPath = join(dirPath, componentFile);
    let source: string;
    try {
      source = readFileSync(componentPath, "utf-8");
    } catch {
      console.warn(`  skip ${dir}/ — no ${componentFile}`);
      continue;
    }

    // Import meta
    const metaPath = join(dirPath, `${dir}.meta.ts`);
    let meta: { slug: string; title: string; description: string };
    try {
      const mod = await import(metaPath);
      meta = mod.meta;
    } catch {
      console.warn(`  skip ${dir}/ — no valid meta`);
      continue;
    }

    const dependencies = extractDependencies(source);
    const filePath = `registry/default/${dir}/${componentFile}`;

    // Write individual registry item
    const item = {
      $schema: "https://ui.shadcn.com/schema/registry-item.json",
      name: meta.slug,
      title: meta.title,
      description: meta.description,
      dependencies,
      files: [
        {
          path: filePath,
          content: source,
          type: "registry:component" as const,
        },
      ],
      type: "registry:component" as const,
    };

    const outPath = join(OUTPUT_DIR, `${meta.slug}.json`);
    writeFileSync(outPath, JSON.stringify(item, null, 2) + "\n");
    console.log(`  ✓ ${meta.slug}.json`);

    // Collect for combined registry (without file content)
    registryItems.push({
      name: meta.slug,
      type: "registry:component",
      title: meta.title,
      description: meta.description,
      dependencies,
      files: [{ path: filePath, type: "registry:component" }],
    });
  }

  // Write combined registry
  const registry = {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: "dziedzorm",
    homepage: "https://dziedzorm.xyz",
    items: registryItems,
  };

  writeFileSync(
    join(OUTPUT_DIR, "registry.json"),
    JSON.stringify(registry, null, 2) + "\n",
  );
  console.log(`  ✓ registry.json (${registryItems.length} items)`);
}

console.log("Generating registry...");
main().then(() => console.log("Done."));
