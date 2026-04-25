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

const ReportModal = ({
  isOpen,
  onClose,
  filters,
  currentUser,
  moduleType = "users",
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState(null);

  const REPORT_CONFIG = {
    users: {
      title: "Users Information Report",
      fileName: "users_report",
      endpoint: "/api/users",
      dataKey: "users",
      csvHeaders: [
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
      ],
      pdfHeaders: [
        "User Profile",
        "Personal & Contact",
        "Education & Career",
        "Address & Location",
        "Status & Source",
        "Joined Date",
      ],
      getCSVRow: (u) => [
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
      ],
      getPDFRow: (u) => [
        `ID: ${u.userId || "-"}\nName: ${u.name || "-"}\nRole: ${u.role || "-"}`,
        `Email: ${u.email || "-"}\nPhone: ${u.phone || "-"}\nFather: ${u.father_name || "-"}\nDOB: ${u.dob ? new Date(u.dob).toLocaleDateString() : "-"}`,
        `Batch: ${u.batch || "-"}\nEdu: ${u.education || "-"}\nJob: ${u.current_job || u.custom_job || "-"}`,
        `House: ${u.house_name || "-"}\nDist: ${u.district || u.custom_district || "-"}\nPO: ${u.post_office || "-"}\nAddr: ${u.address || "-"}\nPin: ${u.pincode || "-"}`,
        `Status: ${u.status || "-"}\nSource: ${u.source || "-"}`,
        `${new Date(u.createdAt).toLocaleDateString()}`,
      ],
      columnStyles: {
        0: {
          cellWidth: 44,
          cellPadding: { left: 18, top: 4, right: 4, bottom: 4 },
        },
        1: { cellWidth: 38 },
        2: { cellWidth: 32 },
        3: { cellWidth: 40 },
        4: { cellWidth: 20 },
        5: { cellWidth: 18 },
      },
    },
    students: {
      title: "Students Information Report",
      fileName: "students_report",
      endpoint: "/api/students",
      dataKey: "students",
      csvHeaders: [
        "Student ID",
        "Name",
        "Email",
        "Phone",
        "Status",
        "Madrasa Class",
        "School Class",
        "House Name",
        "Father Name",
        "Guardian",
        "Guardian Phone",
        "Address",
        "District",
        "Admission Date",
        "Joined Date",
      ],
      pdfHeaders: [
        "Student Profile",
        "Contact Info",
        "Education",
        "Guardian Info",
        "Address",
        "Joined Date",
      ],
      getCSVRow: (u) => [
        u.studentId || "",
        u.name || "",
        u.email || "",
        u.phone || "",
        u.status || "",
        u.current_madrasa_class || "",
        u.current_school_class || "",
        u.house_name || "",
        u.father_name || "",
        u.guardian_name || "",
        u.guardian_phone || "",
        u.address || "",
        u.district || "",
        u.date_of_admission
          ? new Date(u.date_of_admission).toLocaleDateString()
          : "",
        new Date(u.createdAt).toLocaleDateString(),
      ],
      getPDFRow: (u) => [
        `ID: ${u.studentId || "-"}\nName: ${u.name || "-"}\nStatus: ${u.status || "-"}`,
        `Email: ${u.email || "-"}\nPhone: ${u.phone || "-"}`,
        `Madrasa: ${u.current_madrasa_class || "-"}\nSchool: ${u.current_school_class || "-"}`,
        `Guardian: ${u.guardian_name || "-"}\nPhone: ${u.guardian_phone || "-"}\nRelation: ${u.guardian_relation || "-"}`,
        `House: ${u.house_name || "-"}\nDist: ${u.district || "-"}\nAddr: ${u.address || "-"}`,
        `${new Date(u.createdAt).toLocaleDateString()}`,
      ],
      columnStyles: {
        0: {
          cellWidth: 42,
          cellPadding: { left: 18, top: 4, right: 4, bottom: 4 },
        },
        1: { cellWidth: 38 },
        2: { cellWidth: 28 },
        3: { cellWidth: 35 },
        4: { cellWidth: 32 },
        5: { cellWidth: 17 },
      },
    },
    sundook: {
      title: "Sundook Records Report",
      fileName: "sundook_report",
      endpoint: "/api/sundook",
      dataKey: "records",
      csvHeaders: [
        "Alumni ID",
        "Alumni Name",
        "Year",
        "Box Number",
        "Status",
        "Receipt Number",
        "Rejected Reason",
        "Date",
      ],
      pdfHeaders: ["Alumni Profile", "Details", "Box & Year", "Status", "Date"],
      getCSVRow: (r) => [
        r.alumni?.userId || "",
        r.alumni?.name || "",
        r.year || "",
        r.box_number || "",
        r.status || "",
        r.receipt_number || "",
        r.rejection_reason || "",
        new Date(r.createdAt).toLocaleDateString(),
      ],
      getPDFRow: (r) => [
        `ID: ${r.alumni?.userId || "-"}\nName: ${r.alumni?.name || "-"}`,
        r.status === "approved"
          ? `Receipt: ${r.receipt_number || "-"}`
          : r.status === "rejected"
            ? `Reason: ${r.rejection_reason || "-"}`
            : "-",
        `Box: ${r.box_number || "-"}\nYear: ${r.year || "-"}`,
        `${r.status || "-"}`,
        `${new Date(r.createdAt).toLocaleDateString()}`,
      ],
      columnStyles: {
        0: {
          cellWidth: 50,
          cellPadding: { left: 18, top: 4, right: 4, bottom: 4 },
        },
        1: { cellWidth: 70 },
        2: { cellWidth: 20 },
        3: { cellWidth: 25 },
        4: { cellWidth: 27 },
      },
      imageField: "alumni",
    },
    welfare: {
      title: "Welfare Fund Report",
      fileName: "welfare_report",
      endpoint: "/api/welfare",
      dataKey: "records",
      csvHeaders: [
        "Alumni ID",
        "Alumni Name",
        "Description",
        "Amount",
        "Status",
        "Receipt Number",
        "Rejected Reason",
        "Date",
      ],
      pdfHeaders: [
        "Alumni Profile",
        "Description",
        "Details",
        "Amount",
        "Status",
        "Date",
      ],
      getCSVRow: (r) => [
        r.alumni?.userId || "",
        r.alumni?.name || "",
        r.description || "",
        r.amount || "",
        r.status || "",
        r.receipt_number || "",
        r.rejection_reason || "",
        new Date(r.createdAt).toLocaleDateString(),
      ],
      getPDFRow: (r) => [
        `ID: ${r.alumni?.userId || "-"}\nName: ${r.alumni?.name || "-"}`,
        `${r.description || "-"}`,
        r.status === "approved"
          ? `Receipt: ${r.receipt_number || "-"}`
          : r.status === "rejected"
            ? `Reason: ${r.rejection_reason || "-"}`
            : "-",
        `${r.amount || "-"}`,
        `${r.status || "-"}`,
        `${new Date(r.createdAt).toLocaleDateString()}`,
      ],
      columnStyles: {
        0: {
          cellWidth: 40,
          cellPadding: { left: 18, top: 4, right: 4, bottom: 4 },
        },
        1: { cellWidth: 40 },
        2: { cellWidth: 40 },
        3: { cellWidth: 20 },
        4: { cellWidth: 20 },
        5: { cellWidth: 22 },
      },
      imageField: "alumni",
    },
    dashboard: {
      title: "Dashboard Summary Report",
      fileName: "dashboard_report",
      endpoint: "/api/dashboard/stats",
      dataKey: "reportData",
      csvHeaders: ["Metric", "Value", "Details"],
      pdfHeaders: ["Metric", "Value", "Details"],
      getCSVRow: (r) => [r.metric || "", r.value || "0", r.details || ""],
      getPDFRow: (r) => [r.metric || "-", r.value || "0", r.details || "-"],
      columnStyles: {
        0: { cellWidth: 80, fontStyle: "bold" },
        1: { cellWidth: 40, halign: "right" },
        2: { cellWidth: 60 },
      },
    },
  };

  const currentConfig = REPORT_CONFIG[moduleType];

  const activeFilters = [
    { label: "Search", value: filters.searchTerm || filters.search },
    { label: "Role", value: filters.role },
    { label: "Status", value: filters.status },
    { label: "District", value: filters.district },
    { label: "Batch", value: filters.batch },
    { label: "Year", value: filters.year },
    { label: "From", value: filters.fromDate },
    { label: "To", value: filters.toDate },
  ].filter((f) => f.value);

  const fetchReportData = async () => {
    try {
      const response = await axios.get(currentConfig.endpoint, {
        params: {
          all: true,
          ...filters,
        },
      });
      return response.data[currentConfig.dataKey] || [];
    } catch (err) {
      console.error("Fetch report data error:", err);
      throw new Error(`Failed to fetch ${moduleType} data for report.`);
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
      const data = await fetchReportData();
      if (!data || data.length === 0) {
        setError(`No ${moduleType} found matching the current filters.`);
        setIsExporting(false);
        return;
      }

      const headers = currentConfig.csvHeaders;
      const csvData = data.map((item) => currentConfig.getCSVRow(item));

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
        `${currentConfig.fileName}_${new Date().toISOString().split("T")[0]}.csv`,
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
      const data = await fetchReportData();
      if (!data || data.length === 0) {
        setError(`No ${moduleType} found matching the current filters.`);
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
      doc.text(currentConfig.title, textX, 22);

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

      // Prepare images in advance
      const fetchedImages = {};
      for (const item of data) {
        const u = currentConfig.imageField === "alumni" ? item.alumni : item;
        if (u && u._id && u.image) {
          try {
            fetchedImages[u._id] = await getUserImageBase64(u.image);
          } catch (e) {
            console.error("Failed to pre-fetch image for item:", u._id, e);
          }
        }
      }

      // Table
      autoTable(doc, {
        startY: currentY,
        head: [currentConfig.pdfHeaders],
        body: data.map((item) => currentConfig.getPDFRow(item)),
        didDrawCell: (cellData) => {
          if (cellData.section === "body" && cellData.column.index === 0) {
            const item = data[cellData.row.index];
            const u =
              currentConfig.imageField === "alumni" ? item.alumni : item;

            if (u && u._id) {
              const base64Img = fetchedImages[u._id];
              if (base64Img) {
                const imgSize = 14;
                const posX = cellData.cell.x + 2;
                const posY = cellData.cell.y + 4;
                doc.addImage(base64Img, "JPEG", posX, posY, imgSize, imgSize);
              } else {
                // Draw placeholder
                const imgSize = 14;
                const posX = cellData.cell.x + 2;
                const posY = cellData.cell.y + 4;
                doc.setDrawColor(226, 232, 240);
                doc.setFillColor(248, 250, 252);
                doc.roundedRect(posX, posY, imgSize, imgSize, 2, 2, "FD");
                doc.setFontSize(6);
                doc.setTextColor(148, 163, 184);
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
        columnStyles: currentConfig.columnStyles,
        theme: "grid",
      });

      // Footer
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184);
        doc.text(
          `Page ${i} of ${pageCount}`,
          doc.internal.pageSize.width / 2,
          doc.internal.pageSize.height - 10,
          { align: "center" },
        );
      }

      doc.save(
        `${currentConfig.fileName}_${new Date().toISOString().split("T")[0]}.pdf`,
      );
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
        <ModalHeader className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-secondary/10 rounded-lg text-secondary">
              <FileDown size={22} />
            </div>
            <h3 className="text-lg font-body! font-semibold text-slate-800 dark:text-white capitalize text-nowrap">
              Generate {moduleType} Report
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
            all records matching the current filters.
          </p>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm flex items-center gap-2 border border-red-100 dark:border-red-900/30">
              <AlertCircle size={18} />
              {error}
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <div className="flex gap-2 flex-1">
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
