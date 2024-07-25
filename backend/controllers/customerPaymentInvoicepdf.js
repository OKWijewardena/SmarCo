const puppeteer = require("puppeteer");
const fs = require("fs");
const handlebars = require("handlebars");
const path = require("path");
const moment = require("moment");
const axios = require("axios");

const convertToPaymentInvoicePDF = async (req, res) => {
  try {
    let data = Array.isArray(req.body) ? req.body : [req.body];
    console.log(data);

    // Format the date to exclude the time
    data = data.map((item) => {
      let date = new Date(item.date);
      let formattedDate =
        date.getFullYear() +
        "-" +
        String(date.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(date.getDate()).padStart(2, "0");
      item.date = formattedDate;
      item.statisticsDate = moment(formattedDate).format("YYYY-MM-DD");
      return item;
    });

    // Retrieve customer data
    for (let item of data) {
      try {
        const response = await axios.get(
          `http://podsaas.online/api/customer/civil/${item.civilID}`
        );
        item.customerData = response.data;
      } catch (err) {
        console.error(`Error fetching customer data: ${err.message}`);
        item.customerData = {}; // Handle error case appropriately
      }
    }

    // Retrieve selling data by ID
    for (let item of data) {
      try {
        const response = await axios.get(
          `http://podsaas.online/selling/getOneSellingID/${item.id}`
        );
        item.sellingData = response.data;
      } catch (err) {
        console.error(`Error fetching selling data: ${err.message}`);
        item.sellingData = {}; // Handle error case appropriately
      }
    }

    // Retrieve selling data by civil ID and EMI number
    for (let item of data) {
      try {
        const response = await axios.get(
          `http://podsaas.online/selling/getbyCIDEMI/${item.civilID}/${item.emiNumber}`
        );
        item.sellingData = response.data;
      } catch (err) {
        console.error(`Error fetching selling data: ${err.message}`);
        item.sellingData = {}; // Handle error case appropriately
      }
    }

    // Calculate the total price first
    let totalPrice = data.reduce(
      (total, item) => total + Number(item.price),
      0
    );

    // Format the individual price field
    let formatter = new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
    });

    data = data.map((item) => {
      item.price = formatter.format(Number(item.price));
      return item;
    });

    // Format the total price into Kuwaiti Dinar currency format
    let formattedPrice = formatter.format(totalPrice);

    // Read the HTML template
    const source = fs.readFileSync(
      path.join(__dirname, "../template/PaymentInvoicePdfTemplate.html"),
      "utf8"
    );

    // Compile the template with handlebars
    const template = handlebars.compile(source);
    const html = template({ data, formattedPrice }); // Pass the total price and customer data to the template

    const pdf = await convertHTMLToPDF(html, "data.pdf");
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=data.pdf");
    res.send(pdf);
  } catch (error) {
    console.error(`Error generating PDF: ${error.message}`);
    res.status(500).send("An error occurred while generating the PDF.");
  }
};

async function convertHTMLToPDF(
  htmlContent,
  pdfFilePath,
  margins = { top: "10mm", right: "1mm", bottom: "10mm", left: "1mm" }
) {
  try {
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.setContent(htmlContent);
    const pdf = await page.pdf({
      format: "A4",
      margin: margins,
      printBackground: true,
    }); // Added printBackground: true
    await browser.close();
    return pdf;
  } catch (error) {
    console.error(`Error creating PDF: ${error.message}`);
    throw error;
  }
}

module.exports = {
  convertToPaymentInvoicePDF,
};
