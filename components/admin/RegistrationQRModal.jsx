"use client";

import React, { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/modal";
import { Button } from "@heroui/button";
import { QRCodeSVG } from "qrcode.react";
import { Copy, Check, CircleX, MessageCircle } from "lucide-react";
import WhatsappIcon from "@/assets/icons/whatsapp";

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

  const handleWhatsAppShare = () => {
    const tabNames = {
      student: "Student",
      alumni: "Alumni",
      sundook: "Sundook Record",
      welfare: "Welfare Contribution",
    };
    const text = `Join us at DOSO! Register/Submit ${tabNames[activeTab]} here: ${registrationUrl}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} hideCloseButton>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex items-center justify-between gap-3">
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
              <div className="flex flex-wrap gap-2 mb-2">
                <Button
                  size="sm"
                  variant={activeTab === "student" ? "solid" : "flat"}
                  color="primary"
                  className="font-bold flex-1 min-w-fit"
                  onPress={() => setActiveTab("student")}
                >
                  Student
                </Button>
                <Button
                  size="sm"
                  variant={activeTab === "alumni" ? "solid" : "flat"}
                  color="primary"
                  className="font-bold flex-1 min-w-fit"
                  onPress={() => setActiveTab("alumni")}
                >
                  Alumni
                </Button>
                <Button
                  size="sm"
                  variant={activeTab === "sundook" ? "solid" : "flat"}
                  color="primary"
                  className="font-bold flex-1 min-w-fit"
                  onPress={() => setActiveTab("sundook")}
                >
                  Sundook
                </Button>
                <Button
                  size="sm"
                  variant={activeTab === "welfare" ? "solid" : "flat"}
                  color="primary"
                  className="font-bold flex-1 min-w-fit"
                  onPress={() => setActiveTab("welfare")}
                >
                  Welfare
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
                <span className="text-sm text-slate-600 dark:text-slate-400 truncate flex-1">
                  {registrationUrl}
                </span>
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  onPress={handleCopy}
                  className="shrink-0 text-slate-600"
                >
                  {copied ? (
                    <Check size={18} className="text-green-500" />
                  ) : (
                    <Copy size={18} />
                  )}
                </Button>
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  onPress={handleWhatsAppShare}
                  className="shrink-0 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20"
                >
                  <WhatsappIcon />
                </Button>
              </div>

              <p className="text-xs text-center text-slate-500 mt-3">
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
