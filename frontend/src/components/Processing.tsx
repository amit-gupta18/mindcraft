import { Loader2 } from "lucide-react";

export default function Processing() {
  return (
    <div className="flex flex-col items-center justify-center min-h-48 py-16">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-4" />
      <div className="text-lg font-medium text-blue-700 dark:text-blue-300">Masking in progress…</div>
    </div>
  );
}
