const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const reportPath = 'C:\\Users\\hi\\.gemini\\antigravity-ide\\brain\\92d179e4-38ed-4631-87a6-ec544ceccf81\\mediguardian_project_report.md';
const outputPath = 'C:\\Users\\hi\\Desktop\\mediguardian\\MediGuardian_Project_Report.pdf';

try {
  const markdown = fs.readFileSync(reportPath, 'utf8');
  const lines = markdown.split('\n');

  const doc = new PDFDocument({
    margin: 50,
    size: 'A4',
    bufferPages: true
  });

  doc.pipe(fs.createWriteStream(outputPath));

  // Helper colors
  const primaryColor = '#0d9488'; // Teal-600
  const secondaryColor = '#4f46e5'; // Indigo-600
  const textDark = '#1e293b'; // Slate-800
  const codeBg = '#f1f5f9'; // Slate-100

  // Cover / Header Banner
  doc.rect(0, 0, 612, 120).fill(primaryColor);
  doc.fillColor('#ffffff').fontSize(24).font('Helvetica-Bold').text('MEDIGUARDIAN HEALTHCARE PORTAL', 50, 40);
  doc.fontSize(12).font('Helvetica').text('Full-Stack Project Report & Implementation Walkthrough', 50, 75);
  doc.moveDown(4);

  // Content rendering
  let isCodeBlock = false;
  doc.fillColor(textDark);

  lines.forEach((line) => {
    // Strip markdown formatting markers
    const cleanLine = line.replace(/\*\*|`|_/g, '').trim();

    if (line.startsWith('```')) {
      isCodeBlock = !isCodeBlock;
      doc.moveDown(0.5);
      return;
    }

    if (isCodeBlock) {
      if (cleanLine) {
        doc.font('Courier').fontSize(9).fillColor('#475569');
        doc.text('  ' + cleanLine, { align: 'left', lineGap: 2 });
      }
      return;
    }

    // Set styling based on headers
    if (line.startsWith('# ')) {
      const title = line.replace('# ', '').trim();
      doc.moveDown(1.5);
      doc.font('Helvetica-Bold').fontSize(18).fillColor(primaryColor).text(title);
      doc.moveDown(0.5);
    } else if (line.startsWith('## ')) {
      const heading = line.replace('## ', '').trim();
      doc.moveDown(1.2);
      doc.font('Helvetica-Bold').fontSize(14).fillColor(secondaryColor).text(heading);
      doc.moveDown(0.4);
    } else if (line.startsWith('### ')) {
      const subheading = line.replace('### ', '').trim();
      doc.moveDown(1.0);
      doc.font('Helvetica-Bold').fontSize(11).fillColor('#334155').text(subheading);
      doc.moveDown(0.3);
    } else if (line.startsWith('* ') || line.startsWith('- ')) {
      const bulletText = line.substring(2).trim();
      doc.font('Helvetica').fontSize(10).fillColor(textDark);
      doc.text(' •  ' + bulletText, { indent: 15, paragraphGap: 4, lineGap: 2 });
    } else if (cleanLine) {
      // Normal paragraph text
      doc.font('Helvetica').fontSize(10).fillColor(textDark);
      doc.text(cleanLine, { paragraphGap: 6, lineGap: 2 });
    } else {
      doc.moveDown(0.5);
    }
  });

  // Add Page Numbers
  const range = doc.bufferedPageRange();
  for (let i = range.start; i < range.start + range.count; i++) {
    doc.switchToPage(i);
    // Draw footer
    doc.rect(50, 780, 512, 1).fill('#cbd5e1');
    doc.fillColor('#64748b').fontSize(8).font('Helvetica');
    doc.text(`MediGuardian Project Portfolio Report`, 50, 790);
    doc.text(`Page ${i + 1} of ${range.count}`, 50, 790, { align: 'right' });
  }

  doc.end();
  console.log('Successfully generated Project Report PDF at: ' + outputPath);
} catch (err) {
  console.error('Error generating PDF:', err);
  process.exit(1);
}
