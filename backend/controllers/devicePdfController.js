const puppeteer = require('puppeteer');
const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');

exports.convertToDevicePDF = async (req, res) => {
  try {
    let data = req.body;

    // Read the HTML template
    const source = fs.readFileSync(path.join(__dirname, '../template/devicepdfTemplate.html'), 'utf8');
    const template = handlebars.compile(source);
    const html = template({ data });

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
  const pdf = await page.pdf({ format: 'A3', margin: margins });
  await browser.close();
  return pdf;
}
