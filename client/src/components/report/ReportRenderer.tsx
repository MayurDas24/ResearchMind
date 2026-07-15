import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";

import CodeBlock from "@/components/report/CodeBlock";
import { slugify } from "@/lib/markdown";

interface Props {
  content: string;
}

const ReportRenderer = ({ content }: Props) => {
  return (
    <div className="prose prose-invert prose-zinc max-w-none prose-headings:scroll-mt-24 prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-table:text-sm">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeHighlight]}
        components={{
          h2: ({ children }) => (
            <h2 id={slugify(String(children))} className="text-2xl font-bold mt-10 mb-4 pb-2 border-b border-zinc-800">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 id={slugify(String(children))} className="text-xl font-semibold mt-8 mb-3">
              {children}
            </h3>
          ),
          a: ({ children, href }) => (
            <a href={href} target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-4 rounded-lg border border-zinc-800">
              <table className="w-full">{children}</table>
            </div>
          ),
          code: ({ className, children, ...props }) => {
            const isInline = !className;
            if (isInline) {
              return (
                <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-sm text-emerald-300" {...props}>
                  {children}
                </code>
              );
            }
            return (
              <CodeBlock className={className}>
                {String(children).replace(/\n$/, "")}
              </CodeBlock>
            );
          },
          pre: ({ children }) => <>{children}</>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default ReportRenderer;