"use client";

import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import {
  FileDown,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  CircleX,
} from "lucide-react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const ReportModal = ({ isOpen, onClose, filters, currentUser }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState(null);

  const activeFilters = [
    { label: "Search", value: filters.searchTerm },
    { label: "Role", value: filters.role },
    { label: "Status", value: filters.status },
    { label: "District", value: filters.district },
    { label: "Batch", value: filters.batch },
  ].filter((f) => f.value);

  const fetchAllUsers = async () => {
    try {
      const response = await axios.get("/api/users", {
        params: {
          all: true,
          search: filters.searchTerm,
          role: filters.role,
          status: filters.status,
          district: filters.district,
          batch: filters.batch,
        },
      });
      return response.data.users || [];
    } catch (err) {
      console.error("Fetch report data error:", err);
      throw new Error("Failed to fetch user data for report.");
    }
  };

  const getLogoBase64 = async () => {
    try {
      const response = await fetch("/doso_logo.jpeg");
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (err) {
      console.error("Logo fetch error:", err);
      return null;
    }
  };

  const getUserImageBase64 = async (url) => {
    if (!url) return null;
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (err) {
      console.error("User image fetch error:", err);
      return null;
    }
  };

  const handleExportCSV = async () => {
    setIsExporting(true);
    setError(null);
    try {
      const users = await fetchAllUsers();
      if (!users || users.length === 0) {
        setError("No users found matching the current filters.");
        setIsExporting(false);
        return;
      }

      const headers = [
        "User ID",
        "Name",
        "Email",
        "Phone",
        "Role",
        "Status",
        "House Name",
        "Father Name",
        "Address",
        "Post Office",
        "District",
        "Custom District",
        "Pincode",
        "Batch",
        "Education",
        "Date of Birth",
        "Current Job",
        "Custom Job",
        "Source",
        "Joined Date",
      ];
      const csvData = users.map((u) => [
        u.userId || "",
        u.name || "",
        u.email || "",
        u.phone || "",
        u.role || "",
        u.status || "",
        u.house_name || "",
        u.father_name || "",
        u.address || "",
        u.post_office || "",
        u.district || "",
        u.custom_district || "",
        u.pincode || "",
        u.batch || "",
        u.education || "",
        u.dob ? new Date(u.dob).toLocaleDateString() : "",
        u.current_job || "",
        u.custom_job || "",
        u.source || "",
        new Date(u.createdAt).toLocaleDateString(),
      ]);

      const csvContent = [headers, ...csvData]
        .map((e) =>
          e
            .map(String)
            .map((val) => `"${val.replace(/"/g, '""')}"`)
            .join(","),
        )
        .join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `users_report_${new Date().toISOString().split("T")[0]}.csv`,
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    setError(null);
    try {
      const users = await fetchAllUsers();
      if (!users || users.length === 0) {
        setError("No users found matching the current filters.");
        setIsExporting(false);
        return;
      }

      const logo = await getLogoBase64();
      const doc = new jsPDF();

      // Header Alignment
      const logoSize = 25;
      const margin = 14;
      if (logo) {
        doc.addImage(logo, "JPEG", margin, 12, logoSize, logoSize);
      }

      const textX = logo ? margin + logoSize + 6 : margin;
      doc.setFontSize(24);
      doc.setTextColor(30, 41, 59); // slate-800
      doc.text("Users Information Report", textX, 22);

      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139); // slate-500
      doc.text(`Generated on: ${new Date().toLocaleString()}`, textX, 29);
      doc.text(`Generated by: ${currentUser?.name || "Admin"}`, textX, 35);

      // Filters info
      let currentY = 45;
      if (activeFilters.length > 0) {
        doc.setFontSize(11);
        doc.setTextColor(51, 65, 85); // slate-700
        doc.text("Applied Filters:", 14, currentY);
        currentY += 8;

        doc.setFontSize(9);
        doc.setTextColor(71, 85, 105); // slate-600
        const filterChunks = [];
        for (let i = 0; i < activeFilters.length; i += 3) {
          filterChunks.push(activeFilters.slice(i, i + 3));
        }

        filterChunks.forEach((chunk) => {
          const filterLine = chunk
            .map((f) => `${f.label}: ${f.value}`)
            .join(" | ");
          doc.text(filterLine, 18, currentY);
          currentY += 6;
        });
        currentY += 4;
      }

      // Separator
      doc.setDrawColor(226, 232, 240); // slate-200
      doc.line(14, currentY, 196, currentY);
      currentY += 10;

      // Prepare user images in advance (needed for synchronous didDrawCell)
      const userImages = {};
      for (const u of users) {
        if (u && u._id && u.image) {
          try {
            userImages[u._id] = await getUserImageBase64(u.image);
          } catch (e) {
            console.error("Failed to pre-fetch image for user:", u._id, e);
          }
        }
      }

      // Table with 6 Grouped Columns
      autoTable(doc, {
        startY: currentY,
        head: [
          [
            "User Profile",
            "Personal & Contact",
            "Education & Career",
            "Address & Location",
            "Status & Source",
            "Joined Date",
          ],
        ],
        body: users.map((u) => [
          // Column 1: User Profile (Text will be offset by cellPadding.left)
          `ID: ${u.userId || "-"}\nName: ${u.name || "-"}\nRole: ${u.role || "-"}`,
          // Column 2: Personal & Contact
          `Email: ${u.email || "-"}\nPhone: ${u.phone || "-"}\nFather: ${u.father_name || "-"}\nDOB: ${u.dob ? new Date(u.dob).toLocaleDateString() : "-"}`,
          // Column 3: Education & Career
          `Batch: ${u.batch || "-"}\nEdu: ${u.education || "-"}\nJob: ${u.current_job || u.custom_job || "-"}`,
          // Column 4: Address & Location
          `House: ${u.house_name || "-"}\nDist: ${u.district || u.custom_district || "-"}\nPO: ${u.post_office || "-"}\nAddr: ${u.address || "-"}\nPin: ${u.pincode || "-"}`,
          // Column 5: Status & Source
          `Status: ${u.status || "-"}\nSource: ${u.source || "-"}`,
          // Column 6: Joined Date
          `${new Date(u.createdAt).toLocaleDateString()}`,
        ]),
        didDrawCell: (data) => {
          if (data.section === "body" && data.column.index === 0) {
            const user = users[data.row.index];
            if (user && user._id) {
              const base64Img = userImages[user._id];
              if (base64Img) {
                const imgSize = 14;
                const posX = data.cell.x + 2;
                const posY = data.cell.y + 4; // Align with top padding
                doc.addImage(base64Img, "JPEG", posX, posY, imgSize, imgSize);
              } else {
                // Draw placeholder for missing image
                const imgSize = 14;
                const posX = data.cell.x + 2;
                const posY = data.cell.y + 4;
                doc.setDrawColor(226, 232, 240); // slate-200
                doc.setFillColor(248, 250, 252); // slate-50
                doc.roundedRect(posX, posY, imgSize, imgSize, 2, 2, "FD");
                doc.setFontSize(6);
                doc.setTextColor(148, 163, 184); // slate-400
                doc.text("No Photo", posX + 2, posY + 8);
              }
            }
          }
        },
        headStyles: {
          fillColor: [79, 70, 229],
          textColor: [255, 255, 255],
          fontSize: 9,
          fontStyle: "bold",
          halign: "left",
        },
        bodyStyles: {
          fontSize: 7.5,
          textColor: [51, 65, 85],
          lineColor: [241, 245, 249],
          lineWidth: 0.1,
          cellPadding: 4,
          minCellHeight: 22,
          valign: "top",
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252],
        },
        margin: { top: 10, left: margin, right: margin },
        styles: {
          overflow: "linebreak",
          cellWidth: "auto",
        },
        columnStyles: {
          0: {
            cellWidth: 44,
            cellPadding: { left: 18, top: 4, right: 4, bottom: 4 },
          }, // User Profile - wider for image
          1: { cellWidth: 38 }, // Personal & Contact
          2: { cellWidth: 32 }, // Education & Career
          3: { cellWidth: 40 }, // Address & Location
          4: { cellWidth: 20 }, // Status & Source
          5: { cellWidth: 18 }, // Joined Date
        },
        theme: "grid",
      });

      // Footer with page numbers
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184); // slate-400
        doc.text(
          `Page ${i} of ${pageCount}`,
          doc.internal.pageSize.width / 2,
          doc.internal.pageSize.height - 10,
          { align: "center" },
        );
      }

      doc.save(`users_report_${new Date().toISOString().split("T")[0]}.pdf`);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} size="lg" hideCloseButton>
      <ModalContent>
        <ModalHeader className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-secondary/10 rounded-lg text-secondary">
              <FileDown size={22} />
            </div>
            <h3 className="text-lg font-body! font-semibold text-slate-800 dark:text-white">
              Generate User Report
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center text-red-600 hover:bg-red-400 rounded-full hover:text-white transition-all duration-200"
            aria-label="Close"
          >
            <CircleX size={22} />
          </button>
        </ModalHeader>
        <ModalBody className="space-y-2">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Choose the format to download the report. The report will include
            all users matching the current filters.
          </p>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm flex items-center gap-2 border border-red-100 dark:border-red-900/30">
              <AlertCircle size={18} />
              {error}
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <div className="flex gap-2 flex-2">
            <Button
              color="primary"
              variant="flat"
              onPress={handleExportCSV}
              startContent={isExporting ? null : <FileText size={18} />}
              className="font-bold flex-1"
              isLoading={isExporting}
            >
              CSV
            </Button>
            <Button
              color="secondary"
              onPress={handleExportPDF}
              startContent={isExporting ? null : <FileDown size={18} />}
              className="font-bold flex-1 shadow-lg shadow-secondary/20"
              isLoading={isExporting}
            >
              PDF
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ReportModal;
