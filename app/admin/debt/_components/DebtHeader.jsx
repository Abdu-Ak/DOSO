import { Button } from "@heroui/button";
import { FileDown } from "lucide-react";

export default function DebtHeader({ onReportClick, showReportButton }) {
  return (
    <div className="px-1 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h2 className="text-lg font-body! font-bold text-slate-900 dark:text-white">
          Debt Management
        </h2>
        <p className="text-slate-600 text-sm dark:text-slate-400">
          Review and approve debt applications from alumni after witness
          verification.
        </p>
      </div>
      {showReportButton && (
        <Button
          color="secondary"
          variant="flat"
          onPress={onReportClick}
          startContent={<FileDown size={18} />}
          className="font-bold self-start md:self-auto shadow-sm"
        >
          Generate Report
        </Button>
      )}
    </div>
  );
}
