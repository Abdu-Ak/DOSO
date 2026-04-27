import { Wallet, FileText } from "lucide-react";
import { Button } from "@heroui/button";

export default function DebtHeader({ onReportClick, showReportButton }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
          <Wallet className="text-primary" />
          Debt Management
        </h1>
        <p className="text-slate-500 mt-1 font-medium text-sm">
          Review and approve debt applications from alumni after witness
          verification.
        </p>
      </div>
      <div className="flex items-center gap-2">
        {showReportButton && (
          <Button
            variant="flat"
            color="secondary"
            startContent={<FileText size={18} />}
            onPress={onReportClick}
            className="font-bold shrink-0"
          >
            Generate Report
          </Button>
        )}
      </div>
    </div>
  );
}
