import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";

export function PostContent({ content }: { content: string }) {
  return (
    <div className="prose-custom">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize]}
        components={{
          h2: ({ children, ...props }) => (
            <h2 className="text-2xl font-bold mt-10 mb-4 text-foreground" {...props}>
              {children}
            </h2>
          ),
          h3: ({ children, ...props }) => (
            <h3 className="text-xl font-semibold mt-8 mb-3 text-foreground" {...props}>
              {children}
            </h3>
          ),
          p: ({ children, ...props }) => (
            <p className="text-base leading-relaxed text-muted-foreground mb-4" {...props}>
              {children}
            </p>
          ),
          ul: ({ children, ...props }) => (
            <ul className="list-disc pl-6 mb-4 space-y-1.5 text-muted-foreground" {...props}>
              {children}
            </ul>
          ),
          ol: ({ children, ...props }) => (
            <ol className="list-decimal pl-6 mb-4 space-y-1.5 text-muted-foreground" {...props}>
              {children}
            </ol>
          ),
          li: ({ children, ...props }) => (
            <li className="text-base leading-relaxed" {...props}>
              {children}
            </li>
          ),
          strong: ({ children, ...props }) => (
            <strong className="font-semibold text-foreground" {...props}>
              {children}
            </strong>
          ),
          a: ({ children, href, ...props }) => (
            <a
              href={href}
              className="text-brand-600 dark:text-brand-400 hover:underline font-medium"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            >
              {children}
            </a>
          ),
          code: ({ children, ...props }) => (
            <code
              className="font-mono text-sm bg-secondary px-1.5 py-0.5 rounded-md text-foreground"
              {...props}
            >
              {children}
            </code>
          ),
          pre: ({ children, ...props }) => (
            <pre
              className="bg-secondary rounded-xl p-4 mb-6 overflow-x-auto text-sm border border-border/40"
              {...props}
            >
              {children}
            </pre>
          ),
          blockquote: ({ children, ...props }) => (
            <blockquote
              className="border-l-4 border-brand-500 pl-4 my-6 italic text-muted-foreground"
              {...props}
            >
              {children}
            </blockquote>
          ),
          hr: (props) => (
            <hr className="my-8 border-border/40" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
