"use client";

import React, { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/modal";
import { Button } from "@heroui/button";
import { QRCodeSVG } from "qrcode.react";
import { Copy, Check, CircleX } from "lucide-react";

const RegistrationQRModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("student");
  const [copied, setCopied] = useState(false);

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const registrationUrl = `${baseUrl}/register/${activeTab}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(registrationUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} hideCloseButton>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex items-center justify-between">
              <h3 className="text-lg font-body! font-semibold text-slate-800 dark:text-white">
                Registration Link
              </h3>
              <button
                onClick={onClose}
                className="w-6 h-6 flex items-center justify-center text-red-600 hover:bg-red-400 rounded-full hover:text-white transition-all duration-200"
              >
                <CircleX size={22} />
              </button>
            </ModalHeader>
            <ModalBody className="pb-6">
              {/* Tab Switch */}
              <div className="flex gap-2 mb-6">
                <Button
                  size="sm"
                  variant={activeTab === "student" ? "solid" : "flat"}
                  color="primary"
                  className="font-bold flex-1"
                  onPress={() => setActiveTab("student")}
                >
                  Student
                </Button>
                <Button
                  size="sm"
                  variant={activeTab === "alumni" ? "solid" : "flat"}
                  color="primary"
                  className="font-bold flex-1"
                  onPress={() => setActiveTab("alumni")}
                >
                  Alumni
                </Button>
              </div>

              {/* QR Code */}
              <div className="flex justify-center p-6 bg-white rounded-xl">
                <QRCodeSVG
                  value={registrationUrl}
                  size={200}
                  level="H"
                  includeMargin
                />
              </div>

              {/* Copyable Link */}
              <div className="mt-4 flex items-center gap-2 bg-slate-50 dark:bg-slate-800 rounded-lg p-3">
                <span className="text-xs text-slate-600 dark:text-slate-400 truncate flex-1">
                  {registrationUrl}
                </span>
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  onPress={handleCopy}
                  className="shrink-0"
                >
                  {copied ? (
                    <Check size={16} className="text-green-500" />
                  ) : (
                    <Copy size={16} className="text-slate-400" />
                  )}
                </Button>
              </div>

              <p className="text-[10px] text-center text-slate-400 mt-3">
                Share this QR code or link for {activeTab} registration
              </p>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default RegistrationQRModal;
