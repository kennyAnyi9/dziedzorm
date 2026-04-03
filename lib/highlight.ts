import { createHighlighter, type Highlighter } from "shiki";

let highlighter: Highlighter | null = null;

async function getHighlighter() {
  if (!highlighter) {
    highlighter = await createHighlighter({
      themes: ["github-dark"],
      langs: ["tsx", "ts", "jsx", "js", "bash", "json"],
    });
  }
  return highlighter;
}

export async function highlight(code: string, lang = "tsx"): Promise<string> {
  const h = await getHighlighter();
  return h.codeToHtml(code, {
    lang,
    theme: "github-dark",
    transformers: [
      {
        pre(node) {
          // transparent bg so our container controls it
          node.properties.style = "background:transparent;margin:0;padding:0;";
        },
      },
    ],
  });
}
