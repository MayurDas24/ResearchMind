import { TocItem } from "@/lib/markdown";
import { List } from "lucide-react";

interface Props {
  items: TocItem[];
}

const TableOfContents = ({ items }: Props) => {
  if (items.length === 0) return null;

  const handleClick = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="sticky top-20 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
      <div className="flex items-center gap-2 text-sm font-medium text-zinc-300 mb-3">
        <List size={15} />
        On this page
      </div>
      <nav className="flex flex-col gap-1">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => handleClick(item.id)}
            className={`text-left text-sm text-zinc-500 hover:text-emerald-400 transition-colors truncate py-1 ${
              item.level === 3 ? "pl-4" : ""
            }`}
          >
            {item.text}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default TableOfContents;