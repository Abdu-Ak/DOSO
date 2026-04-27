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

  // 1. Alumni Details
  y = sectionHeader(doc, "Alumni Information", y, W, margin);
  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    body: [
      ["Name", val(record.requester?.name)],
      ["User ID", val(record.requester?.userId)],
      ["Email", val(record.requester?.email)],
    ],
    theme: "plain",
    styles: { fontSize: 9, cellPadding: 2, textColor: C.bodyText },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 40, textColor: C.muted },
    },
  });
  y = doc.lastAutoTable.finalY + 10;

  // 2. Debt Specifics
  y = sectionHeader(doc, "Debt Particulars", y, W, margin);
  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    body: [
      ["Amount", `INR ${record.amount.toLocaleString("en-IN")}`],
      ["Payment Type", val(record.payment_type).toUpperCase()],
      ["Duration", `${record.duration_months} Month(s)`],
      ["Requested On", fmtDateTime(record.createdAt)],
      ["Receipt No", val(record.receipt_no)],
    ],
    theme: "plain",
    styles: { fontSize: 9, cellPadding: 2, textColor: C.bodyText },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 40, textColor: C.muted },
    },
  });
  y = doc.lastAutoTable.finalY + 10;

  // 3. Witnesses
  y = sectionHeader(doc, "Witness Verification", y, W, margin);
  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    body: [
      [
        "Witness 1",
        `${val(record.witness1?.name)} (${val(record.witness1?.userId)})`,
      ],
      ["Status 1", val(record.witness1_status).toUpperCase()],
      [
        "Witness 2",
        `${val(record.witness2?.name)} (${val(record.witness2?.userId)})`,
      ],
      ["Status 2", val(record.witness2_status).toUpperCase()],
    ],
    theme: "plain",
    styles: { fontSize: 9, cellPadding: 2, textColor: C.bodyText },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 40, textColor: C.muted },
    },
  });
  y = doc.lastAutoTable.finalY + 20;

  // 4. Signatures Section
  const sigW = 60;
  const sigY = y + 10;

  // Receiver Sign
  doc.setDrawColor(...C.border);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...C.muted);
  doc.text("Receiving confirmation & Signature", margin, sigY + 5);

  // Repayment Sign
  doc.text("Repayment Confirmation & Signature", W - margin, sigY + 5, {
    align: "right",
  });

  // Footer
  doc.setFillColor(...C.headerBar);
  doc.rect(0, H - 10, W, 10, "F");
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(186, 214, 255);
  doc.text(
    `Generated: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" })}   |   DOSO Administration`,
    margin,
    H - 3.5,
  );
  doc.text("Confidential \u2014 Official Notice", W - margin, H - 3.5, {
    align: "right",
  });

  doc.save(
    `Debt_Notice_${val(record.requester?.userId)}_${val(record.receipt_no)}.pdf`,
  );
};
