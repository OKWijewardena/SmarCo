const puppeteer = require("puppeteer");
const fs = require("fs");
const handlebars = require("handlebars");
const Handlebars = require("handlebars");
const path = require("path");
const moment = require("moment");
const stats = require("simple-statistics");
const axios = require("axios"); // Import axios

const convertToPDF = async (req, res) => {
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

  // Assuming your data is in the 'data' variable
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
  // Compile the template with handlebars
  const template = handlebars.compile(source);
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
  }); // Pass the total price to the template

  const pdf = await convertHTMLToPDF(html, "data.pdf");
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=data.pdf");
  res.send(pdf);
};

const convertToPaymentInvoicePDF = async (req, res) => {
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

  for (let item of data) {
    const response = await axios.get(
      `https://app.smartco.live/selling/getOneSellingID/${item.id}`
    );
    const sellingData = response.data;
    item.sellingData = sellingData;
  }

  for (let item of data) {
    const response = await axios.get(
      `https://app.smartco.live/selling/getbyCIDEMI/${item.civilID}/${item.emiNumber}`
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

  // Compile the template with handlebars
  const template = handlebars.compile(source);
  const html = template({ data, formattedPrice }); // Pass the total price and customer data to the template

  const pdf = await convertHTMLToPDF(html, "data.pdf");
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=data.pdf");
  res.send(pdf);
};

const convertToOverAllPaymentInvoicePDF = async (req, res) => {
  let data = Array.isArray(req.body) ? req.body : [req.body];
  console.log("boom", data);
  const { id, civil_id } = req.body;
  console.log("ID:", id);
  console.log("Civil ID:", civil_id);

  // Retrieve customer data
  for (let item of data) {
    const customerResponse = await axios.get(
      `https://app.smartco.live/api/customer/civil/${item.civil_id}`
    );
    const customerData = customerResponse.data;
    console.log(customerData);
    item.customerData = customerData;

    const sellingResponse = await axios.get(
      `https://app.smartco.live/selling/getOneSellingID/${item.id}`
    );
    const sellingData = sellingResponse.data;
    console.log(sellingData);
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

  // Assuming `data` is structured with `monthNumber` property added
  data = data.map((item, index) => {
    item.monthNumber = index + 1;
    return item;
  });
  
  // Calculate the total price first
  let totalPrice = data.reduce((total, item) => total + Number(item.sellingData.price), 0);

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

  data = data.map((item) => {
    item.price = formatter.format(Number(item.sellingData.price));
    return item;
  });

  // Format the total price into Kuwaiti Dinar currency format
  let formattedPrice = formatter.format(totalPrice);

  // Calculate total paid amount
  let totalPaidAmount = data.reduce((total, item) => {
    // Parse the advance payment, defaulting to 0 if not present
    let paidAmount = parseFloat(item.sellingData.advance || 0);
    
    // Check if customArray exists and is an array
    if (Array.isArray(item.sellingData.customArray)) {
      for (let customItem of item.sellingData.customArray) {
        if (customItem.status === "paid") {
          paidAmount += parseFloat(customItem.price || 0); // Ensure price is parsed correctly
        }
      }
    } else {
      console.warn('customArray is not an array or is undefined for item:', item);
    }
  
    return total + paidAmount;
  }, 0);

  // Format the total paid amount
  let formattedTotalPaidAmount = formatter.format(totalPaidAmount);

  // Calculate the unpaid amount
  const totalPaidAmountNumber = parseFloat(totalPaidAmount);
  const totalSellingPriceNumber = parseFloat(totalPrice);

  // Ensure values are numbers before calculating unpaid amount
  const totalUnpaidAmount = isNaN(totalSellingPriceNumber) || isNaN(totalPaidAmountNumber)
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
    formattedSellingPrice: data.length > 0 ? data[0].formattedSellingPrice : "",
  });

  const pdf = await convertHTMLToPDF(html, "data.pdf");
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=data.pdf");
  res.send(pdf);
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
