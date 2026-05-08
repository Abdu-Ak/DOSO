"use client";

import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { CheckCircle2, Clock, Calendar, CircleX } from "lucide-react";

export default function ManageRepaymentsModal({
  isOpen,
  onOpenChange,
  record,
  onMarkAsPaid,
  isLoading,
}) {
  if (!record) return null;

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="xl"
      hideCloseButton
      isDismissable={false}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex items-center justify-between gap-3">
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-body! font-semibold text-slate-800 dark:text-white">
                  Manage Repayments
                </h3>
                <p className="text-sm text-slate-600 font-normal dark:text-slate-400 -mt-2">
                  {record.requester?.name} • ID: {record.requester?.userId}
                </p>
              </div>

              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="w-6 h-6 flex items-center justify-center text-red-600 hover:bg-red-400 rounded-full hover:text-white transition-all duration-200"
                aria-label="Close"
              >
                <CircleX size={22} />
              </button>
            </ModalHeader>
            <ModalBody className="space-y-3">
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 flex justify-between items-center">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
                    Total Debt Amount
                  </p>
                  <p className="text-2xl font-black text-primary">
                    ₹{record.amount.toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
                    Payment Type
                  </p>
                  <Chip
                    variant="flat"
                    color="primary"
                    size="sm"
                    className="font-bold"
                  >
                    EMI ({record.duration_months} Months)
                  </Chip>
                </div>
              </div>

              <div className="space-y-3 pb-3">
                <p className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">
                  Installment Schedule
                </p>
                {record.installments?.map((item) => (
                  <div
                    key={item.installmentNumber}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:border-primary/30 transition-all group gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black text-slate-500 group-hover:bg-primary group-hover:text-white transition-colors shrink-0">
                        {item.installmentNumber}
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-700 dark:text-slate-200">
                          ₹{item.amount.toLocaleString()}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <Calendar size={12} className="text-slate-400" />
                          <p className="text-[11px] font-bold text-slate-500">
                            Due:{" "}
                            {new Date(item.dueDate).toLocaleDateString(
                              "en-IN",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-4 ml-14 sm:ml-0">
                      <Chip
                        variant="flat"
                        color={item.status === "paid" ? "success" : "warning"}
                        size="sm"
                        className="font-black text-[10px] tracking-wider uppercase"
                        startContent={
                          item.status === "paid" ? (
                            <CheckCircle2 size={12} />
                          ) : (
                            <Clock size={12} />
                          )
                        }
                      >
                        {item.status === "paid" ? "Paid" : "Pending"}
                      </Chip>

                      {item.status === "pending" && (
                        <Button
                          size="sm"
                          color="success"
                          variant="flat"
                          className="font-black text-[10px] uppercase tracking-wider h-8"
                          onPress={() =>
                            onMarkAsPaid(record._id, item.installmentNumber)
                          }
                          isLoading={isLoading}
                        >
                          Mark Paid
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
