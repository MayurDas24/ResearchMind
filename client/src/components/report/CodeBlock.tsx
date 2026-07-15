import { useState } from "react";
import { Check, Copy } from "lucide-react";

interface Props {
  children: string;
  className?: string;
}

const CodeBlock = ({ children, className }: Props) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const language = className?.replace("language-", "") || "text";

  return (
    <div className="relative group my-4">
      <div className="flex items-center justify-between bg-zinc-800 px-4 py-2 rounded-t-lg border border-zinc-700 border-b-0">
        <span className="text-xs text-zinc-400 font-mono">{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
        >
          {copied ? (
            <>
              <Check size={13} className="text-emerald-400" />
              Copied
            </>
          ) : (
            <>
              <Copy size={13} />
              Copy
            </>
          )}
        </button>
      </div>
      <pre className="mt-0! rounded-t-none! border border-zinc-700 overflow-x-auto">
        <code className={className}>{children}</code>
      </pre>
    </div>
  );
};

export default CodeBlock;