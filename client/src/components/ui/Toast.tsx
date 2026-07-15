import { CheckCircle2, XCircle, Info, X } from "lucide-react";
import { useToast } from "@/context/ToastContext";

const iconMap = {
  success: { Icon: CheckCircle2, className: "text-emerald-400" },
  error: { Icon: XCircle, className: "text-red-400" },
  info: { Icon: Info, className: "text-blue-400" },
};

const ToastContainer = () => {
  const { toasts, dismissToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 w-80">
      {toasts.map((toast) => {
        const { Icon, className } = iconMap[toast.type];

        return (
          <div
            key={toast.id}
            className="flex items-start gap-3 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 shadow-lg animate-in fade-in slide-in-from-bottom-2"
          >
            <Icon size={18} className={`shrink-0 mt-0.5 ${className}`} />
            <p className="text-sm text-zinc-200 flex-1">{toast.message}</p>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-zinc-500 hover:text-white transition-colors shrink-0"
            >
              <X size={15} />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ToastContainer;