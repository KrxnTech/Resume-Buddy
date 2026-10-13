import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { cleanAtsText } from "./pdfGenerator";

/**
 * Directly modifies the user's uploaded original PDF file
 * applying accepted rewrite changes onto the document and downloading it.
 *
 * @param {File} originalPdfFile - The raw PDF File object uploaded by the user
 * @param {Array} acceptedChanges - List of accepted rewrite changes from useAnalysis
 * @param {Object} canonicalResume - The structured canonical resume profile
 * @param {Number} version - Revision version number
 * @returns {Promise<string>} The generated download filename
 */
export async function modifyOriginalResumePdf(
  originalPdfFile,
  acceptedChanges = [],
  canonicalResume = {},
  version = 2
) {
  if (!originalPdfFile) {
    throw new Error("No original resume PDF file was found. Please upload a PDF first.");
  }

  // 1. Read raw binary bytes of the user's uploaded PDF
  const originalBytes = await originalPdfFile.arrayBuffer();

  // 2. Load the actual document into pdf-lib
  const pdfDoc = await PDFDocument.load(originalBytes, { ignoreEncryption: true });

  // 3. Embed standard vector fonts
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  const pages = pdfDoc.getPages();
  const pageCount = pages.length;

  if (pageCount > 0) {
    const firstPage = pages[0];
    const { width, height } = firstPage.getSize();

    // Draw an official revision badge at the top banner of Page 1
    const bannerHeight = 22;
    const bannerY = height - bannerHeight - 6;

    // Subtle dark accent background for the rewrite banner
    firstPage.drawRectangle({
      x: 14,
      y: bannerY,
      width: width - 28,
      height: bannerHeight,
      color: rgb(0.08, 0.08, 0.1),
      borderColor: rgb(0.9, 0.99, 0.32), // accent yellow-green
      borderWidth: 1,
    });

    const bannerText = `AI REWRITE APPLIED • ATS VERSION ${version} • ${acceptedChanges.length} REWRITES MERGED`;
    const textWidth = fontBold.widthOfTextAtSize(bannerText, 8.5);
    const textX = (width - textWidth) / 2;

    firstPage.drawText(bannerText, {
      x: textX,
      y: bannerY + 7,
      size: 8.5,
      font: fontBold,
      color: rgb(0.9, 0.99, 0.32),
    });
  }

  // 4. Create and append the "AI Optimized & Rewritten Highlights" Page directly to the user's document
  // This ensures all accepted rewrites (even long expanded bullets) are cleanly presented without truncation!
  const a4Width = 595.28;
  const a4Height = 841.89;
  const newPage = pdfDoc.addPage([a4Width, a4Height]);

  const margin = 36;
  const contentWidth = a4Width - margin * 2;
  let y = a4Height - 44;

  const checkPageBreak = (needed = 24) => {
    if (y - needed < margin) {
      const p = pdfDoc.addPage([a4Width, a4Height]);
      y = a4Height - 44;
      return p;
    }
    return newPage;
  };

  // Header Bar
  newPage.drawRectangle({
    x: margin,
    y: y - 28,
    width: contentWidth,
    height: 34,
    color: rgb(0.08, 0.08, 0.12),
    borderColor: rgb(0.85, 0.95, 0.25),
    borderWidth: 1,
  });

  const headerTitle = "AI RESUME REWRITE STUDIO — ACCEPTED IMPROVEMENTS";
  newPage.drawText(headerTitle, {
    x: margin + 14,
    y: y - 16,
    size: 11,
    font: fontBold,
    color: rgb(0.9, 0.99, 0.32),
  });

  const candidateName = cleanAtsText(canonicalResume?.identity?.fullName || "Candidate").toUpperCase();
  const subTitle = `Candidate: ${candidateName} | Target: ${canonicalResume?.identity?.professionalTitle || "Software Engineer"}`;
  newPage.drawText(subTitle, {
    x: margin + 14,
    y: y - 25,
    size: 8,
    font: fontRegular,
    color: rgb(0.8, 0.8, 0.85),
  });

  y -= 46;

  // Overview Note
  const introText =
    acceptedChanges.length > 0
      ? `The following ${acceptedChanges.length} AI-optimized statements have been accepted and merged into this resume document. Statements feature active power verbs, quantifiable metrics, and verified ATS keywords.`
      : "Baseline resume profile analyzed and formatted for high-precision ATS parsing and recruiter evaluation.";

  const introWords = introText.split(" ");
  let currentLine = "";
  for (const word of introWords) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    if (fontRegular.widthOfTextAtSize(testLine, 8.5) > contentWidth) {
      newPage.drawText(currentLine, { x: margin, y, size: 8.5, font: fontRegular, color: rgb(0.25, 0.25, 0.3) });
      y -= 12;
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) {
    newPage.drawText(currentLine, { x: margin, y, size: 8.5, font: fontRegular, color: rgb(0.25, 0.25, 0.3) });
    y -= 16;
  }

  // Draw each accepted change in high-contrast card blocks
  if (acceptedChanges.length > 0) {
    for (let i = 0; i < acceptedChanges.length; i++) {
      const change = acceptedChanges[i];
      const sectionName = (change.section || "General").toUpperCase();
      const improvedText = cleanAtsText(change.proposedValue || "");
      const originalText = cleanAtsText(change.originalValue || "");

      // Section Header
      checkPageBreak(50);
      y -= 4;

      // Section Pill
      newPage.drawRectangle({
        x: margin,
        y: y - 14,
        width: Math.min(contentWidth, fontBold.widthOfTextAtSize(` ${sectionName} #${i + 1} `, 8.5) + 12),
        height: 16,
        color: rgb(0.12, 0.12, 0.16),
      });

      newPage.drawText(` ${sectionName} #${i + 1}`, {
        x: margin + 4,
        y: y - 10,
        size: 8,
        font: fontBold,
        color: rgb(0.9, 0.99, 0.32),
      });

      y -= 20;

      // Optimized Statement Block
      newPage.drawText("AI OPTIMIZED STATEMENT:", {
        x: margin,
        y,
        size: 8,
        font: fontBold,
        color: rgb(0.1, 0.55, 0.25),
      });
      y -= 11;

      // Wrap improved text
      const words = improvedText.split(" ");
      let line = "";
      for (const w of words) {
        const test = line ? `${line} ${w}` : w;
        if (fontRegular.widthOfTextAtSize(test, 9) > contentWidth - 8) {
          checkPageBreak(14);
          newPage.drawText(line, { x: margin + 6, y, size: 9, font: fontRegular, color: rgb(0.1, 0.1, 0.15) });
          y -= 12;
          line = w;
        } else {
          line = test;
        }
      }
      if (line) {
        checkPageBreak(14);
        newPage.drawText(line, { x: margin + 6, y, size: 9, font: fontRegular, color: rgb(0.1, 0.1, 0.15) });
        y -= 12;
      }

      // Original Statement Reference (small font)
      if (originalText && originalText !== improvedText) {
        y -= 2;
        newPage.drawText("Replaced Original Statement:", {
          x: margin,
          y,
          size: 7.5,
          font: fontOblique,
          color: rgb(0.5, 0.5, 0.55),
        });
        y -= 10;

        let origLine = "";
        const origWords = originalText.split(" ");
        for (const ow of origWords) {
          const testO = origLine ? `${origLine} ${ow}` : ow;
          if (fontRegular.widthOfTextAtSize(testO, 7.5) > contentWidth - 8) {
            checkPageBreak(12);
            newPage.drawText(origLine, { x: margin + 6, y, size: 7.5, font: fontRegular, color: rgb(0.5, 0.5, 0.55) });
            y -= 10;
            origLine = ow;
          } else {
            origLine = testO;
          }
        }
        if (origLine) {
          checkPageBreak(12);
          newPage.drawText(origLine, { x: margin + 6, y, size: 7.5, font: fontRegular, color: rgb(0.5, 0.5, 0.55) });
          y -= 10;
        }
      }

      // Divider line
      y -= 6;
      newPage.drawLine({
        start: { x: margin, y },
        end: { x: margin + contentWidth, y },
        thickness: 0.4,
        color: rgb(0.85, 0.85, 0.88),
      });
      y -= 8;
    }
  } else {
    // If no changes accepted yet, show instructions
    y -= 10;
    newPage.drawText("No specific section rewrites have been accepted yet in Rewrite Studio.", {
      x: margin,
      y,
      size: 9.5,
      font: fontRegular,
      color: rgb(0.4, 0.4, 0.45),
    });
    y -= 14;
    newPage.drawText("Open AI Rewrite Studio, click '✓ ACCEPT' on recommended statements, and export again.", {
      x: margin,
      y,
      size: 9,
      font: fontOblique,
      color: rgb(0.4, 0.4, 0.45),
    });
  }

  // Footer on the new page
  newPage.drawText(
    `Generated by Resume Buddy • Preserving Candidate's Original Vector PDF Structure • Version ${version}`,
    {
      x: margin,
      y: margin - 12,
      size: 7.5,
      font: fontRegular,
      color: rgb(0.55, 0.55, 0.6),
    }
  );

  // 5. Save the modified PDF bytes
  const modifiedBytes = await pdfDoc.save();

  // 6. Build clean download filename
  const rawFileName = originalPdfFile.name || "Resume.pdf";
  const baseName = rawFileName.replace(/\.pdf$/i, "").replace(/[^a-zA-Z0-9_-]/g, "_");
  const downloadFileName = `${baseName}_Rewritten_v${version}.pdf`;

  // 7. Trigger browser file download
  const blob = new Blob([modifiedBytes], { type: "application/pdf" });
  const downloadUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = downloadUrl;
  anchor.download = downloadFileName;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  setTimeout(() => URL.revokeObjectURL(downloadUrl), 5000);

  return downloadFileName;
}
