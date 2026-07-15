import { LucideIcon } from "lucide-react";

interface Props {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

const EmptyState = ({ icon: Icon, title, description, action }: Props) => {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-12 text-center">
      <Icon className="mx-auto text-zinc-600" size={40} />
      <p className="mt-4 text-zinc-300 font-medium">{title}</p>
      {description && (
        <p className="text-sm text-zinc-500 mt-1">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
};

export default EmptyState;