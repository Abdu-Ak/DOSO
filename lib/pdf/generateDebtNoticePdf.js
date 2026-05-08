import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const C = {
  primary: [30, 64, 175],
  primaryMid: [59, 130, 246],
  primaryLight: [239, 246, 255],
  dark: [17, 24, 39],
  bodyText: [31, 41, 55],
  muted: [107, 114, 128],
  border: [229, 231, 235],
  rowAlt: [249, 250, 251],
  white: [255, 255, 255],
  headerBar: [30, 58, 138],
  accent: [16, 185, 129],
  success: [22, 163, 74],
  danger: [220, 38, 38],
};

const val = (v) => (v && String(v).trim() ? String(v).trim() : "\u2014");

const fmtDateTime = (date) => {
  if (!date) return "\u2014";
  return new Date(date).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const toDataUrl = async (url) => {
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
};

const sectionHeader = (doc, title, y, pageWidth, margin) => {
  doc.setFillColor(...C.primary);
  doc.rect(margin, y, 3, 6, "F");
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...C.primary);
  doc.text(title, margin + 6, y + 4.5);

  doc.setDrawColor(...C.border);
  doc.setLineWidth(0.35);
  doc.line(margin + 6, y + 6, pageWidth - margin, y + 6);
  return y + 10;
};

export const generateDebtNoticePdf = async (record) => {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const margin = 16;
  const headerH = 46;

  // Header background
  doc.setFillColor(...C.headerBar);
  doc.rect(0, 0, W, headerH, "F");

  // Diagonal accent
  doc.setFillColor(...C.primaryMid);
  doc.triangle(W * 0.58, 0, W, 0, W, headerH, "F");

  // Alumni Photo
  const photoSize = 30;
  const photoPad = 2.5;
  const photoX = W - margin - photoSize - photoPad - 6;
  const photoY = Math.round((headerH - photoSize) / 2);

  if (record.requester?.image) {
    const imgData = await toDataUrl(record.requester.image);
    if (imgData) {
      doc.setFillColor(...C.white);
      doc.roundedRect(
        photoX - photoPad,
        photoY - photoPad,
        photoSize + photoPad * 2,
        photoSize + photoPad * 2,
        2,
        2,
        "F",
      );
      doc.addImage(
        imgData,
        "JPEG",
        photoX,
        photoY,
        photoSize,
        photoSize,
        undefined,
        "FAST",
      );
    }
  }

  // Header Text
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(186, 214, 255);
  doc.text("Debt Management  \u00b7  Official Record", margin, 10);

  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...C.white);
  doc.text("Debt Notice", margin, 22);

  const statusLabel = record.status.toUpperCase();
  const statusColor = record.status === "approved" ? C.success : C.primaryMid;

  doc.setFillColor(...statusColor);
  doc.roundedRect(margin, 27, 35, 6, 1.5, 1.5, "F");
  doc.setFontSize(7.5);
  doc.setTextColor(...C.white);
  doc.text(statusLabel, margin + 4, 31.2);

  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(186, 214, 255);
  doc.text(`Record ID: ${val(record._id)}`, margin, 38);

  let y = headerH + 12;
  const colW = (W - margin * 2 - 10) / 2; // 10mm gap

  // Helper for drawing headers in two-column layout
  const drawSubHeader = (title, x, currentY, width) => {
    doc.setFillColor(...C.primary);
    doc.rect(x, currentY, 2.5, 5, "F");
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...C.primary);
    doc.text(title, x + 5, currentY + 3.8);
    doc.setDrawColor(...C.border);
    doc.setLineWidth(0.3);
    doc.line(x + 5, currentY + 5, x + width, currentY + 5);
  };

  // 1. Alumni & Debt side-by-side
  const startY1 = y;
  
  // Left: Alumni
  drawSubHeader("Alumni Information", margin, startY1, colW);
  autoTable(doc, {
    startY: startY1 + 7,
    margin: { left: margin, right: W - (margin + colW) },
    body: [
      ["Name", val(record.requester?.name)],
      ["User ID", val(record.requester?.userId)],
      ["Phone", val(record.requester?.phone)],
      ["Email", val(record.requester?.email)],
    ],
    theme: "plain",
    styles: { fontSize: 8.5, cellPadding: 2, textColor: C.bodyText },
    columnStyles: { 0: { fontStyle: "bold", cellWidth: 24, textColor: C.muted } },
  });
  const alumniY = doc.lastAutoTable.finalY;

  // Right: Debt
  const rightX = margin + colW + 10;
  drawSubHeader("Debt Particulars", rightX, startY1, colW);
  autoTable(doc, {
    startY: startY1 + 7,
    margin: { left: rightX, right: margin },
    body: [
      ["Amount", `INR ${record.amount.toLocaleString("en-IN")}`],
      ["Type", val(record.payment_type).toUpperCase()],
      ["Duration", `${record.duration_months} Month(s)`],
      ["Status", val(record.status).toUpperCase()],
    ],
    theme: "plain",
    styles: { fontSize: 8.5, cellPadding: 2, textColor: C.bodyText },
    columnStyles: { 0: { fontStyle: "bold", cellWidth: 24, textColor: C.muted } },
  });
  const debtY = doc.lastAutoTable.finalY;
  
  y = Math.max(alumniY, debtY) + 12;

  // 2. Repayment Schedule (if EMI)
  if (record.payment_type === "emi" && record.installments?.length > 0) {
    drawSubHeader("Repayment Schedule (EMI)", margin, y, W - margin * 2);
    autoTable(doc, {
      startY: y + 7,
      margin: { left: margin, right: margin },
      head: [["#", "Amount", "Due Date", "Status"]],
      body: record.installments.map((i) => [
        i.installmentNumber,
        `INR ${i.amount.toLocaleString("en-IN")}`,
        new Date(i.dueDate).toLocaleDateString("en-IN"),
        i.status.toUpperCase(),
      ]),
      theme: "striped",
      headStyles: { fillColor: C.primary, textColor: C.white, fontSize: 8.5, fontStyle: "bold" },
      bodyStyles: { fontSize: 8.5, cellPadding: 2, textColor: C.bodyText },
      columnStyles: { 0: { cellWidth: 10 }, 1: { cellWidth: 35 }, 2: { cellWidth: 35 }, 3: { fontStyle: "bold" } },
    });
    y = doc.lastAutoTable.finalY + 12;
  }

  // 3. Witnesses side-by-side
  const startY2 = y;
  
  // Left: Witness 1
  drawSubHeader("Witness 1 Information", margin, startY2, colW);
  autoTable(doc, {
    startY: startY2 + 7,
    margin: { left: margin, right: W - (margin + colW) },
    body: [
      ["Name", val(record.witness1?.name)],
      ["User ID", val(record.witness1?.userId)],
      ["Phone", val(record.witness1?.phone)],
      ["Status", val(record.witness1_status).toUpperCase()],
    ],
    theme: "plain",
    styles: { fontSize: 8.5, cellPadding: 2, textColor: C.bodyText },
    columnStyles: { 0: { fontStyle: "bold", cellWidth: 24, textColor: C.muted } },
  });
  const w1Y = doc.lastAutoTable.finalY;

  // Right: Witness 2
  drawSubHeader("Witness 2 Information", rightX, startY2, colW);
  autoTable(doc, {
    startY: startY2 + 7,
    margin: { left: rightX, right: margin },
    body: [
      ["Name", val(record.witness2?.name)],
      ["User ID", val(record.witness2?.userId)],
      ["Phone", val(record.witness2?.phone)],
      ["Status", val(record.witness2_status).toUpperCase()],
    ],
    theme: "plain",
    styles: { fontSize: 8.5, cellPadding: 2, textColor: C.bodyText },
    columnStyles: { 0: { fontStyle: "bold", cellWidth: 24, textColor: C.muted } },
  });
  const w2Y = doc.lastAutoTable.finalY;

  y = Math.max(w1Y, w2Y) + 20;

  // 4. Signatures Section
  const sigY = y + 15;
  doc.setDrawColor(...C.border);
  doc.setLineWidth(0.4);

  // Receiver Sign
  doc.line(margin, sigY, margin + 65, sigY);
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...C.dark);
  doc.text("I RECEIVED THE DEBT", margin, sigY + 5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...C.muted);
  doc.text("(Requester Signature & Date)", margin, sigY + 9.5);

  // Repayment Sign
  doc.line(W - margin - 65, sigY, W - margin, sigY);
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...C.dark);
  doc.text("THE DEBT HAS BEEN REPAID", W - margin, sigY + 5, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...C.muted);
  doc.text("(Admin Confirmation & Date)", W - margin, sigY + 9.5, { align: "right" });

  // Footer
  doc.setFillColor(...C.headerBar);
  doc.rect(0, H - 10, W, 10, "F");
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(186, 214, 255);
  doc.text(
    `Generated: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" })}   |   DOSO Administration`,
    margin, H - 3.5
  );
  doc.text("Confidential \u2014 Official Notice", W - margin, H - 3.5, { align: "right" });

  doc.save(`Debt_Notice_${val(record.requester?.userId)}_${val(record._id)}.pdf`);
};
