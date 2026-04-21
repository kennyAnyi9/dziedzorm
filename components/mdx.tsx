import type { MDXRemoteProps } from "next-mdx-remote/rsc";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeExternalLinks from "rehype-external-links";
import rehypeSlug from "rehype-slug";
import rehypeShiki from "@shikijs/rehype";
import remarkGfm from "remark-gfm";
import { CodePre } from "@/components/code-pre";

const components: MDXRemoteProps["components"] = {
  h1: (props) => <h1 className="text-3xl font-bold" {...props} />,
  h2: (props) => <h2 className="text-2xl font-semibold" {...props} />,
  h3: (props) => <h3 className="text-xl font-medium" {...props} />,
  pre: CodePre,
};

const options: MDXRemoteProps["options"] = {
  mdxOptions: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      [rehypeExternalLinks, { target: "_blank", rel: "nofollow noopener" }],
      rehypeSlug,
      [
        rehypeShiki,
        {
          theme: "github-dark",
          langs: ["tsx", "ts", "jsx", "js", "bash", "json", "css", "html", "python", "go", "rust", "yaml", "markdown", "shell"],
          transformers: [
            {
              pre(node: { properties: { style: string } }) {
                node.properties.style =
                  "background:transparent;margin:0;padding:0;";
              },
            },
          ],
        },
      ],
    ],
  },
};

export function MDX({ code }: { code: string }) {
  return <MDXRemote source={code} components={components} options={options} />;
}
