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
};

const val = (v) => (v && String(v).trim() ? String(v).trim() : "\u2014");

const fmtDate = (date) => {
  if (!date) return "\u2014";
  return new Date(date).toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const calcAge = (dob) => {
  if (!dob) return null;
  return Math.floor(
    (Date.now() - new Date(dob).getTime()) / (1000 * 60 * 60 * 24 * 365.25),
  );
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

const section = (doc, title, rows, y, pageWidth, margin) => {
  const usable = pageWidth - margin * 2;

  doc.setFillColor(...C.primary);
  doc.rect(margin, y, 3, 6, "F");
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...C.primary);
  doc.text(title, margin + 6, y + 4.5);

  doc.setDrawColor(...C.border);
  doc.setLineWidth(0.35);
  doc.line(margin + 6, y + 6, margin + usable, y + 6);

  autoTable(doc, {
    startY: y + 8,
    margin: { left: margin, right: margin },
    head: [],
    body: rows,
    theme: "plain",
    styles: {
      fontSize: 8.5,
      cellPadding: { top: 2.5, bottom: 2.5, left: 4, right: 4 },
      textColor: C.bodyText,
      lineColor: C.border,
      lineWidth: 0.25,
    },
    columnStyles: {
      0: {
        fontStyle: "bold",
        textColor: C.muted,
        cellWidth: 50,
        fillColor: C.rowAlt,
      },
      1: { textColor: C.bodyText, fillColor: C.white },
    },
    tableWidth: usable,
    rowPageBreak: "avoid",
  });

  return doc.lastAutoTable.finalY + 7;
};

export const generateAlumniPdf = async (alumni) => {
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

  // Photo — white rounded rect frame + image
  const photoSize = 30;
  const photoPad = 2.5;
  const photoX = W - margin - photoSize - photoPad - 6;
  const photoY = Math.round((headerH - photoSize) / 2);

  if (alumni.image) {
    const imgData = await toDataUrl(alumni.image);
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

  // Title line
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(186, 214, 255);
  doc.text("Alumni Portfolio  \u00b7  Official Record", margin, 10);

  // Name
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...C.white);
  doc.text(val(alumni.name), margin, 22);

  // ID pill
  const idText = val(alumni.userId);
  const idW = Math.min(idText.length * 2.2 + 8, 60);
  doc.setFillColor(...C.primaryMid);
  doc.roundedRect(margin, 27, idW, 6, 1.5, 1.5, "F");
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...C.white);
  doc.text(idText, margin + 3, 31.2);

  // Batch badge
  let afterId = margin + idW + 4;
  if (alumni.batch) {
    const batchText = `Batch ${alumni.batch}`;
    const batchW = batchText.length * 1.9 + 6;
    doc.setFillColor(...C.accent);
    doc.roundedRect(afterId, 27, batchW, 6, 1.5, 1.5, "F");
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...C.white);
    doc.text(batchText, afterId + 3, 31.2);
    afterId += batchW + 4;
  }

  // Registered date
  doc.setFont("helvetica", "normal");
  doc.setTextColor(186, 214, 255);
  doc.text(`Registered: ${fmtDate(alumni.createdAt)}`, afterId, 31.2);

  // Divider
  doc.setDrawColor(...C.border);
  doc.setLineWidth(0.5);
  doc.line(0, headerH, W, headerH);

  let y = headerH + 8;

  y = section(
    doc,
    "Personal & Contact Information",
    [
      ["Email Address", val(alumni.email)],
      ["Phone Number", val(alumni.phone)],
      [
        "Date of Birth",
        alumni.dob
          ? `${fmtDate(alumni.dob)}  (Age: ${calcAge(alumni.dob)} yrs)`
          : "\u2014",
      ],
      ["Father's Name", val(alumni.father_name)],
    ],
    y,
    W,
    margin,
  );

  y = section(
    doc,
    "Education & Career",
    [
      ["Batch", val(alumni.batch)],
      ["Education", val(alumni.education)],
      [
        "Current Job",
        val(
          alumni.current_job === "Other"
            ? alumni.custom_job
            : alumni.current_job,
        ),
      ],
      ["Job Location", val(alumni.job_location)],
    ],
    y,
    W,
    margin,
  );

  if (alumni.address || alumni.district || alumni.house_name) {
    section(
      doc,
      "Address & Location",
      [
        ["House Name", val(alumni.house_name)],
        ["Full Address", val(alumni.address)],
        [
          "District",
          val(
            alumni.district === "Other"
              ? alumni.custom_district
              : alumni.district,
          ),
        ],
        ["Post Office", val(alumni.post_office)],
        ["Pincode", val(alumni.pincode)],
      ],
      y,
      W,
      margin,
    );
  }

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
  doc.text(
    "Confidential \u2014 For Administrative Use Only",
    W - margin,
    H - 3.5,
    {
      align: "right",
    },
  );

  doc.save(
    `Alumni_${val(alumni.userId)}_${val(alumni.name).replace(/\s+/g, "_")}.pdf`,
  );
};
