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
        `https://app.smartco.live/api/customer/civil/${item.civilID}`
      );
      const customerData = response.data;
      item.customerData = customerData;
    }

    // Retrieve selling data
    for (let item of data) {
      const response = await axios.get(
        `https://app.smartco.live/selling/getOneSellingID/${item.id}`
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
    // Ensure req.body is an array for consistent processing
    let data = Array.isArray(req.body) ? req.body : [req.body];
    console.log("Received Data:", JSON.stringify(data, null, 2));

    // Iterate over each item in the data array
    for (let item of data) {
      const { id, civil_id } = item;
      console.log(`\nProcessing Item - ID: ${id}, Civil ID: ${civil_id}`);

      // ----- Fetch Customer Data -----
      try {
        const customerResponse = await axios.get(
          `https://app.smartco.live/api/customer/civil/${civil_id}`
        );
        const customerData = customerResponse.data;
        console.log("Customer Data:", JSON.stringify(customerData, null, 2));
        item.customerData = customerData;
      } catch (customerError) {
        console.error(`Error fetching customer data for Civil ID: ${civil_id}`, customerError);
        // Assign default values or handle as needed
        item.customerData = {};
      }

      // ----- Fetch Selling Data -----
      try {
        const sellingResponse = await axios.get(
          `https://app.smartco.live/selling/getOneSellingID/${id}`
        );
        const sellingDataArray = sellingResponse.data;
        console.log("Selling Data Response:", JSON.stringify(sellingDataArray, null, 2));

        // Check if sellingDataArray is an array with at least one element
        if (Array.isArray(sellingDataArray) && sellingDataArray.length > 0) {
          const sellingData = sellingDataArray[0];
          console.log("Processed Selling Data:", JSON.stringify(sellingData, null, 2));
          item.sellingData = sellingData;

          // ----- Format Dates -----
          const formattedDate = moment(sellingData.date).format("YYYY-MM-DD");
          item.date = formattedDate;
          item.statisticsDate = formattedDate;

          // ----- Format Selling Price -----
          const formatter = new Intl.NumberFormat("en-US", {
            minimumFractionDigits: 2,
          });
          item.formattedSellingPrice = formatter.format(Number(sellingData.price));
        } else {
          console.warn(`No selling data found for item ID: ${id}`);
          item.sellingData = {}; // Assign an empty object or handle as needed
        }
      } catch (sellingError) {
        console.error(`Error fetching selling data for ID: ${id}`, sellingError);
        item.sellingData = {}; // Assign an empty object or handle as needed
      }
    }

    // ----- Add Month Number Based on Index -----
    data = data.map((item, index) => {
      item.monthNumber = index + 1;
      return item;
    });

    // ----- Calculate Total Selling Price -----
    const totalPrice = data.reduce((total, item) => {
      const price = item.sellingData && item.sellingData.price
        ? Number(item.sellingData.price)
        : 0;
      return total + price;
    }, 0);

    // ----- Formatter for Prices -----
    const priceFormatter = new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
    });

    // ----- Register Handlebars Helpers -----
    // To prevent re-registering helpers on every request, check if they are already registered
    if (!Handlebars.helpers.indexPlusOne) {
      Handlebars.registerHelper("indexPlusOne", function (index) {
        return index + 1;
      });
    }

    if (!Handlebars.helpers.statusColor) {
      Handlebars.registerHelper("statusColor", function (status) {
        return status === "paid"
          ? "color: green !important; font-weight: bold !important; text-transform: uppercase !important;"
          : "color: red !important; font-weight: bold !important; text-transform: uppercase !important;";
      });
    }

    if (!Handlebars.helpers.formatPrice) {
      Handlebars.registerHelper("formatPrice", function (price) {
        return priceFormatter.format(Number(price));
      });
    }

    if (!Handlebars.helpers.advanceStatusColor) {
      Handlebars.registerHelper("advanceStatusColor", function (advance) {
        if (advance > 0) {
          return new Handlebars.SafeString(
            `<span style="color: green !important; font-weight: bold !important; text-transform: uppercase !important;">PAID</span>`
          );
        } else {
          return new Handlebars.SafeString(
            `<span style="color: red !important; font-weight: bold !important; text-transform: uppercase !important;">UNPAID</span>`
          );
        }
      });
    }

    // ----- Format Individual Prices -----
    data = data.map((item) => {
      const price = item.sellingData && item.sellingData.price
        ? Number(item.sellingData.price)
        : 0;
      item.price = priceFormatter.format(price);
      return item;
    });

    // ----- Format the Total Price -----
    const formattedPrice = priceFormatter.format(totalPrice);

    // ----- Calculate Total Paid Amount -----
    const totalPaidAmount = data.reduce((total, item) => {
      let paidAmount = 0;

      if (item.sellingData) {
        // Add advance if available
        paidAmount += parseFloat(item.sellingData.advance) || 0;

        // Add prices from customArray where status is 'paid'
        if (Array.isArray(item.sellingData.customArray)) {
          for (let customItem of item.sellingData.customArray) {
            if (customItem.status === "paid") {
              paidAmount += parseFloat(customItem.price) || 0;
            }
          }
        } else {
          console.warn(
            `customArray is missing or not an array for item ID: ${item.id}`
          );
        }
      }

      return total + paidAmount;
    }, 0);

    // ----- Format Total Paid Amount -----
    const formattedTotalPaidAmount = priceFormatter.format(totalPaidAmount);

    // ----- Calculate Unpaid Amount -----
    const totalUnpaidAmount = totalPrice - totalPaidAmount;
    const formattedTotalUnpaidAmount = priceFormatter.format(totalUnpaidAmount);
    console.log("Unpaid Amount:", formattedTotalUnpaidAmount);

    // ----- Read and Compile the HTML Template -----
    const templatePath = path.join(__dirname, "../template/overAllpaymentInvoicePdfTemplate.html");
    const templateSource = fs.readFileSync(templatePath, "utf8");
    const template = Handlebars.compile(templateSource);

    // ----- Generate HTML with Handlebars -----
    const html = template({
      data,
      formattedPrice,
      formattedTotalPaidAmount,
      formattedTotalUnpaidAmount,
      // You can add more formatted data here if needed
    });

    // ----- Convert HTML to PDF -----
    const pdfBuffer = await convertHTMLToPDF(html, "data.pdf");

    // ----- Send PDF as Response -----
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=overall_payment_invoice.pdf");
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Error generating Overall Payment Invoice PDF:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

async function convertHTMLToPDF(
  htmlContent,
  pdfFilePath,
  margins = { top: "10mm", right: "1mm", bottom: "10mm", left: "1mm" }
) {
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
}


module.exports = {
  convertToPDF,
  convertToPaymentInvoicePDF,
  convertToOverAllPaymentInvoicePDF,
};
