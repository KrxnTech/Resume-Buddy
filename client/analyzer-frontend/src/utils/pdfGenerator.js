import { jsPDF } from "jspdf";

/**
 * Strips markdown symbols, asterisks, hashtags, backticks, and HTML tags for clean ATS parsing
 */
export function cleanAtsText(text) {
  if (!text) return "";
  return String(text)
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/__(.*?)__/g, "$1")
    .replace(/_(.*?)_/g, "$1")
    .replace(/`{1,3}(.*?)`{1,3}/g, "$1")
    .replace(/#{1,6}\s*/g, "")
    .replace(/<[^>]*>/g, "")
    .replace(/[•●]/g, "-")
    .replace(/\s{2,}/g, " ")
    .trim();
}

/**
 * Generates and downloads a clean, machine-readable, single-column ATS-friendly Resume PDF
 */
export function generateAtsResumePdf(canonicalResume, version = 1) {
  if (!canonicalResume) {
    throw new Error("No canonical resume data available for export.");
  }

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;

  let yPos = 20;

  // Helper for page overflow check
  const checkPageBreak = (neededHeight = 10) => {
    if (yPos + neededHeight > pageHeight - margin) {
      doc.addPage();
      yPos = margin;
    }
  };

  // Helper for drawing clean section header line
  const addSectionHeader = (title) => {
    checkPageBreak(14);
    yPos += 4;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(20, 20, 25);
    doc.text(title.toUpperCase(), margin, yPos);

    yPos += 2;
    doc.setDrawColor(60, 60, 70);
    doc.setLineWidth(0.35);
    doc.line(margin, yPos, margin + contentWidth, yPos);
    yPos += 5;
  };

  const id = canonicalResume.identity || {};

  // 1. CANDIDATE NAME (Prominent Header)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(10, 10, 15);
  const fullName = cleanAtsText(id.fullName || "Candidate Name").toUpperCase();
  doc.text(fullName, pageWidth / 2, yPos, { align: "center" });
  yPos += 6;

  // 2. PROFESSIONAL TITLE
  if (id.professionalTitle) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10.5);
    doc.setTextColor(70, 70, 80);
    doc.text(cleanAtsText(id.professionalTitle), pageWidth / 2, yPos, { align: "center" });
    yPos += 5;
  }

  // 3. CONTACT INFO LINE
  const contactParts = [
    id.email,
    id.phone,
    id.location,
    id.github ? id.github.replace(/^https?:\/\//, "") : "",
    id.linkedin ? id.linkedin.replace(/^https?:\/\//, "") : "",
    id.portfolio ? id.portfolio.replace(/^https?:\/\//, "") : "",
  ].filter(Boolean);

  if (contactParts.length > 0) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(80, 80, 90);
    const contactLine = contactParts.join("  |  ");
    const wrappedContact = doc.splitTextToSize(contactLine, contentWidth);
    doc.text(wrappedContact, pageWidth / 2, yPos, { align: "center" });
    yPos += wrappedContact.length * 4 + 2;
  }

  // 4. PROFESSIONAL SUMMARY
  if (canonicalResume.professionalSummary) {
    addSectionHeader("Professional Summary");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(30, 30, 35);

    const summaryText = cleanAtsText(canonicalResume.professionalSummary);
    const splitSummary = doc.splitTextToSize(summaryText, contentWidth);
    checkPageBreak(splitSummary.length * 4.5);
    doc.text(splitSummary, margin, yPos);
    yPos += splitSummary.length * 4.5 + 2;
  }

  // 5. TECHNICAL SKILLS
  const sk = canonicalResume.skills || {};
  const skillCategories = [
    { label: "Languages", items: sk.languages },
    { label: "Frameworks & Libraries", items: sk.frameworks },
    { label: "Databases & Caching", items: sk.databases },
    { label: "Cloud & DevOps", items: sk.cloud },
    { label: "Tools & Testing", items: sk.tools },
    { label: "Core Competencies", items: sk.softSkills },
  ].filter((c) => Array.isArray(c.items) && c.items.length > 0);

  if (skillCategories.length > 0) {
    addSectionHeader("Technical Skills");
    skillCategories.forEach((cat) => {
      checkPageBreak(6);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(25, 25, 30);
      const catLabel = `${cat.label}: `;
      doc.text(catLabel, margin, yPos);

      const labelWidth = doc.getTextWidth(catLabel);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(40, 40, 45);
      const itemsText = cat.items.map(cleanAtsText).join(", ");
      const splitItems = doc.splitTextToSize(itemsText, contentWidth - labelWidth);

      doc.text(splitItems, margin + labelWidth, yPos);
      yPos += splitItems.length * 4.2 + 1.5;
    });
  }

  // 6. PROFESSIONAL EXPERIENCE
  if (Array.isArray(canonicalResume.experience) && canonicalResume.experience.length > 0) {
    addSectionHeader("Professional Experience");

    canonicalResume.experience.forEach((exp) => {
      checkPageBreak(16);
      // Role & Company Row
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(20, 20, 25);
      const titleCompany = `${cleanAtsText(exp.title || "Software Engineer")} - ${cleanAtsText(exp.company || "Company")}`;
      doc.text(titleCompany, margin, yPos);

      // Date / Location (Right Aligned)
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(80, 80, 90);
      const dateLoc = [exp.period, exp.location].filter(Boolean).join(" | ");
      doc.text(dateLoc, margin + contentWidth, yPos, { align: "right" });
      yPos += 4.5;

      // Highlights / Bullets
      const highlights = Array.isArray(exp.highlights) ? exp.highlights : [exp.description || ""];
      highlights.filter(Boolean).forEach((hl) => {
        const bulletText = cleanAtsText(hl);
        const splitBullet = doc.splitTextToSize(bulletText, contentWidth - 5);
        checkPageBreak(splitBullet.length * 4.2 + 2);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(35, 35, 40);
        doc.text("-", margin + 1, yPos);
        doc.text(splitBullet, margin + 5, yPos);
        yPos += splitBullet.length * 4.2 + 1;
      });
      yPos += 2;
    });
  }

  // 7. KEY PROJECTS
  if (Array.isArray(canonicalResume.projects) && canonicalResume.projects.length > 0) {
    addSectionHeader("Key Technical Projects");

    canonicalResume.projects.forEach((proj) => {
      checkPageBreak(14);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.8);
      doc.setTextColor(20, 20, 25);
      const projTitle = cleanAtsText(proj.name || "Project");
      doc.text(projTitle, margin, yPos);

      if (proj.technologies?.length) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.5);
        doc.setTextColor(80, 80, 90);
        const techStr = `(${proj.technologies.map(cleanAtsText).join(", ")})`;
        const titleW = doc.getTextWidth(projTitle + " ");
        doc.text(techStr, margin + titleW, yPos);
      }
      yPos += 4.5;

      const descText = cleanAtsText(proj.description || "");
      const splitDesc = doc.splitTextToSize(descText, contentWidth - 5);
      checkPageBreak(splitDesc.length * 4.2 + 2);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(35, 35, 40);
      doc.text("-", margin + 1, yPos);
      doc.text(splitDesc, margin + 5, yPos);
      yPos += splitDesc.length * 4.2 + 2.5;
    });
  }

  // 8. EDUCATION
  if (Array.isArray(canonicalResume.education) && canonicalResume.education.length > 0) {
    addSectionHeader("Education");

    canonicalResume.education.forEach((edu) => {
      checkPageBreak(10);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(20, 20, 25);
      doc.text(cleanAtsText(edu.institution || "University"), margin, yPos);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(80, 80, 90);
      const eduMeta = [edu.period, edu.grade].filter(Boolean).join(" | ");
      doc.text(eduMeta, margin + contentWidth, yPos, { align: "right" });
      yPos += 4;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(40, 40, 45);
      doc.text(cleanAtsText(edu.degree || "Degree"), margin, yPos);
      yPos += 5;
    });
  }

  // 9. CERTIFICATIONS & ACHIEVEMENTS
  if (
    (Array.isArray(canonicalResume.certifications) && canonicalResume.certifications.length > 0) ||
    (Array.isArray(canonicalResume.achievements) && canonicalResume.achievements.length > 0)
  ) {
    addSectionHeader("Certifications & Achievements");

    if (Array.isArray(canonicalResume.certifications)) {
      canonicalResume.certifications.forEach((cert) => {
        checkPageBreak(5);
        const certName = typeof cert === "string" ? cert : `${cert.name} (${cert.issuer || ""})`;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(35, 35, 40);
        doc.text("-", margin + 1, yPos);
        doc.text(cleanAtsText(certName), margin + 5, yPos);
        yPos += 4.5;
      });
    }

    if (Array.isArray(canonicalResume.achievements)) {
      canonicalResume.achievements.forEach((ach) => {
        const achText = cleanAtsText(typeof ach === "string" ? ach : ach.description || "");
        const splitAch = doc.splitTextToSize(achText, contentWidth - 5);
        checkPageBreak(splitAch.length * 4.2 + 2);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(35, 35, 40);
        doc.text("-", margin + 1, yPos);
        doc.text(splitAch, margin + 5, yPos);
        yPos += splitAch.length * 4.2 + 1.5;
      });
    }
  }

  // Safe professional file name
  const rawName = id.fullName || "Candidate";
  const sanitizedName = rawName.replace(/[^a-zA-Z0-9_-]/g, "_").replace(/_+/g, "_");
  const fileName = version > 1 ? `${sanitizedName}_Resume_v${version}.pdf` : `${sanitizedName}_Resume.pdf`;

  doc.save(fileName);
  return fileName;
}
