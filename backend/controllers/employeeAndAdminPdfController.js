const puppeteer = require('puppeteer');
const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');

exports.convertToemployeeAndAdminPDF = async (req, res) => {
  try {
    let data = req.body;

    // Check the roles in the data
    let roles = data.map(item => item.role);
    let uniqueRoles = [...new Set(roles)];

    let reportName = "Report";
    if (uniqueRoles.length === 1) {
      if (uniqueRoles[0] === "employee") {
        reportName = "Employee Report";
      } else if (uniqueRoles[0] === "admin") {
        reportName = "Admin Report";
      }
    } else if (uniqueRoles.length > 1) {
      reportName = "Admin and Employee Report";
    }

    // Read the HTML template
    const source = fs.readFileSync(path.join(__dirname, '../template/employeeAdminPdfTemplate.html'), 'utf8');
    const template = handlebars.compile(source);
    const html = template({ data, reportName });

    const pdf = await convertHTMLToPDF(html, 'data.pdf');
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=data.pdf');
    res.send(pdf);
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).send('Error generating PDF');
  }
};

async function convertHTMLToPDF(htmlContent, pdfFilePath, margins = { top: '10mm', right: '1mm', bottom: '10mm', left: '1mm' }) {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setContent(htmlContent);
  const pdf = await page.pdf({ format: 'A4', margin: margins, printBackground: true });
  await browser.close();
  return pdf;
}