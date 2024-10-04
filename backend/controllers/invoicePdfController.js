// invoicePdfController.js

const puppeteer = require("puppeteer");
const fs = require("fs");
const Handlebars = require("handlebars"); // Removed redundant import
const path = require("path");
const moment = require("moment");
const stats = require("simple-statistics");
const axios = require("axios"); // Import axios

/**
 * Helper function to convert HTML content to PDF using Puppeteer.
 * @param {string} htmlContent - The HTML content to convert.
 * @param {string} pdfFilePath - The desired PDF file path (not used currently).
 * @param {object} margins - Optional margins for the PDF.
 * @returns {Buffer} - The generated PDF as a buffer.
 */
async function convertHTMLToPDF(
  htmlContent,
  pdfFilePath,
  margins = { top: "10mm", right: "1mm", bottom: "10mm", left: "1mm" }
) {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: "networkidle0" }); // Ensures all network requests are finished
  const pdf = await page.pdf({
    format: "A4",
    margin: margins,
    printBackground: true,
  });
  await browser.close();
  return pdf;
}

/**
 * Generates a standard PDF invoice.
 */
const convertToPDF = async (req, res) => {
  try {
    let data = Array.isArray(req.body) ? req.body : [req.body];

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

    // Sort the data by date
    data.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Identify the start and end dates
    let startDate = data[0].date;
    let endDate = data[data.length - 1].date;

    // Calculate the total price
    let totalPrice = data.reduce(
      (total, item) => total + parseFloat(item.price),
      0
    );

    // Add formatted statisticsDate using moment
    data = data.map((item) => {
      item.statisticsDate = moment(item.date);
      return item;
    });

    // Group payments by month
    let paymentsByMonth = {};
    data.forEach((item) => {
      let month = item.statisticsDate.format("YYYY-MM");
      if (!paymentsByMonth[month]) {
        paymentsByMonth[month] = [];
      }
      paymentsByMonth[month].push(parseFloat(item.price));
    });

    // Calculate total payments for each month
    let totalPaymentsByMonth = {};
    for (let month in paymentsByMonth) {
      totalPaymentsByMonth[month] = stats.sum(paymentsByMonth[month]);
    }

    // Find the month with the highest payment
    let highestPaymentMonth = Object.keys(totalPaymentsByMonth).reduce((a, b) =>
      totalPaymentsByMonth[a] > totalPaymentsByMonth[b] ? a : b
    );
    let x = parseFloat(totalPaymentsByMonth[highestPaymentMonth]);

    // Find the month with the lowest payment
    let lowestPaymentMonth = Object.keys(totalPaymentsByMonth).reduce((a, b) =>
      totalPaymentsByMonth[a] < totalPaymentsByMonth[b] ? a : b
    );
    let y = parseFloat(totalPaymentsByMonth[lowestPaymentMonth]);

    // Read the HTML template
    const source = fs.readFileSync(
      path.join(__dirname, "../template/invoicespdfTemplate.html"),
      "utf8"
    );

    // Calculate the number of data items
    let numberOfItems = data.length;

    // Compile the template with Handlebars
    const template = Handlebars.compile(source);
    const html = template({
      data,
      totalPrice,
      numberOfItems,
      startDate,
      endDate,
      highestPaymentMonth,
      x,
      lowestPaymentMonth,
      y,
    });

    // Convert HTML to PDF
    const pdf = await convertHTMLToPDF(html, "data.pdf");
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=data.pdf");
    res.send(pdf);
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * Generates a payment invoice PDF.
 */
const convertToPaymentInvoicePDF = async (req, res) => {
  try {
    let data = Array.isArray(req.body) ? req.body : [req.body];

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
      const response = await axios.get(
        `http://localhost:8000/api/customer/civil/${item.civilID}`
      );
      const customerData = response.data;
      item.customerData = customerData;
    }

    // Retrieve selling data
    for (let item of data) {
      const response = await axios.get(
        `http://localhost:8000/selling/getOneSellingID/${item.id}`
      );
      const sellingData = response.data;
      item.sellingData = sellingData;
    }

    // Calculate the total price first
    let totalPrice = data.reduce((total, item) => total + Number(item.price), 0);

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

    // Compile the template with Handlebars
    const template = Handlebars.compile(source);
    const html = template({ data, formattedPrice }); // Pass the total price and customer data to the template

    // Convert HTML to PDF
    const pdf = await convertHTMLToPDF(html, "data.pdf");
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=data.pdf");
    res.send(pdf);
  } catch (error) {
    console.error("Error generating Payment Invoice PDF:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * Generates an overall payment invoice PDF.
 */
const convertToOverAllPaymentInvoicePDF = async (req, res) => {
  try {
    let data = Array.isArray(req.body) ? req.body : [req.body];
    console.log("boom", data);
    const { id, civil_id } = req.body;
    console.log("ID:", id);
    console.log("Civil ID:", civil_id);

    // Retrieve customer data and selling data
    for (let item of data) {
      // Fetch customer data
      const customerResponse = await axios.get(
        `http://localhost:8000/api/customer/civil/${item.civil_id}`
      );
      const customerData = customerResponse.data;
      console.log("Customer Data:", customerData);
      item.customerData = customerData;

      // Fetch selling data
      const sellingResponse = await axios.get(
        `http://localhost:8000/selling/getOneSellingID/${item.id}`
      );
      const sellingData = sellingResponse.data;
      console.log("Selling Data:", sellingData);
      item.sellingData = sellingData;

      // Use the date from sellingData
      let formattedDate = moment(sellingData.date).format("YYYY-MM-DD");
      item.date = formattedDate;
      item.statisticsDate = formattedDate;

      // Format selling price
      let formatter = new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
      });
      item.formattedSellingPrice = formatter.format(Number(sellingData.price));
    }

    // Add monthNumber based on index
    data = data.map((item, index) => {
      item.monthNumber = index + 1;
      return item;
    });

    // Calculate the total price
    let totalPrice = data.reduce(
      (total, item) => total + Number(item.sellingData.price),
      0
    );

    // Formatter for prices
    let formatter = new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
    });

    // Register Handlebars helpers
    Handlebars.registerHelper("indexPlusOne", function (index) {
      return index + 1;
    });

    Handlebars.registerHelper("statusColor", function (status) {
      return status === "paid"
        ? "color: green !important; font-weight: bold !important; text-transform: uppercase  !important;"
        : "color: red !important; font-weight: bold !important; text-transform: uppercase !important;";
    });

    Handlebars.registerHelper("formatPrice", function (price) {
      let formatter = new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
      });
      return formatter.format(Number(price));
    });

    Handlebars.registerHelper("advanceStatusColor", function (advance) {
      if (advance > 0) {
        return new Handlebars.SafeString(
          `<span style="color: green !important; font-weight: bold !important; text-transform: uppercase !important;">PAID</span>`
        );
      } else {
        return new Handlebars.SafeString(
          `<span style="font-weight: bold !important; text-transform: uppercase !important;">UNPAID</span>`
        );
      }
    });

    // Format individual prices
    data = data.map((item) => {
      item.price = formatter.format(Number(item.sellingData.price));
      return item;
    });

    // Format the total price into Kuwaiti Dinar currency format
    let formattedPrice = formatter.format(totalPrice);

    // Calculate total paid amount with validation
    let totalPaidAmount = data.reduce((total, item) => {
      let paidAmount = parseFloat(item.sellingData.advance || 0);

      // Validate customArray
      if (Array.isArray(item.sellingData.customArray)) {
        for (let customItem of item.sellingData.customArray) {
          if (customItem.status === "paid") {
            paidAmount += parseFloat(customItem.price);
          }
        }
      } else {
        console.warn(
          `customArray is missing or not an array for item ID: ${item.id}`
        );
      }

      return total + paidAmount;
    }, 0);

    // Format the total paid amount
    let formattedTotalPaidAmount = formatter.format(totalPaidAmount);

    // Calculate the unpaid amount
    const totalPaidAmountNumber = parseFloat(totalPaidAmount);
    const totalSellingPriceNumber = parseFloat(totalPrice);

    // Ensure values are numbers before calculating unpaid amount
    const totalUnpaidAmount =
      isNaN(totalSellingPriceNumber) || isNaN(totalPaidAmountNumber)
        ? 0
        : totalSellingPriceNumber - totalPaidAmountNumber;

    // Format the unpaid amount to currency format
    const formattedTotalUnpaidAmount = formatter.format(totalUnpaidAmount);
    console.log("Unpaid Amount:", formattedTotalUnpaidAmount);

    // Read the HTML template
    const source = fs.readFileSync(
      path.join(__dirname, "../template/overAllpaymentInvoicePdfTemplate.html"),
      "utf8"
    );

    // Compile the template with Handlebars
    const template = Handlebars.compile(source);
    const html = template({
      data,
      formattedPrice,
      formattedTotalPaidAmount,
      formattedTotalUnpaidAmount,
      formattedSellingPrice:
        data.length > 0 ? data[0].formattedSellingPrice : "",
    });

    // Convert HTML to PDF
    const pdf = await convertHTMLToPDF(html, "data.pdf");
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=data.pdf");
    res.send(pdf);
  } catch (error) {
    console.error("Error generating Overall Payment Invoice PDF:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  convertToPDF,
  convertToPaymentInvoicePDF,
  convertToOverAllPaymentInvoicePDF,
};
