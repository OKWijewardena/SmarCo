const ExcelJS = require("exceljs");

exports.upcomingPaymentExcel = async (req, res) => {
  const { data, statistics } = req.body;
  console.log("Request body:", req.body);

  // Determine the title based on the statuses
  const statuses = data.map((item) => item.status);
  const uniqueStatuses = [...new Set(statuses)];
  const currentMonth = new Date().toLocaleString("default", { month: "long" });

  let reportTitle = `${currentMonth} - Upcoming Payment Report`;

  if (uniqueStatuses.length === 1) {
    reportTitle = `${currentMonth} - Upcoming Payment ${uniqueStatuses[0]} Report`;
  } else if (uniqueStatuses.length > 1 && uniqueStatuses.length < 4) {
    reportTitle = `${currentMonth} - Upcoming Payment ${uniqueStatuses.join(
      " and "
    )} Report`;
  }

  // Create a new workbook and worksheet
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sales Excel Data Report");

  // Get the current date
  const currentDate = new Date().toLocaleDateString();

  // Add report information at the top
  worksheet.mergeCells("A3:K3");
  worksheet.getCell("A3").value = reportTitle;
  worksheet.getCell("A3").font = { bold: true, size: 16 };

  worksheet.mergeCells("A2:K2");
  worksheet.getCell("A2").value = `Generated Date: ${currentDate}`;
  worksheet.getCell("A2").font = { bold: true, size: 14 };

  worksheet.mergeCells("A1:K1");
  worksheet.getCell("A1").value = "Company Name: SMARTCO Pvt Ltd";
  worksheet.getCell("A1").font = { bold: true, size: 14 };

  // Add statistics information
  worksheet.mergeCells("A4:K4");
  worksheet.getCell(
    "A4"
  ).value = `Total Receivable: ${statistics.totalAmountForMonth} over ${statistics.totalTransactions} transactions`;
  worksheet.getCell("A4").font = { bold: true, size: 14 };

  worksheet.mergeCells("A5:K5");
  worksheet.getCell(
    "A5"
  ).value = `Total Paid: ${statistics.totalPaid} over ${statistics.totalPaidTransactions} transactions`;
  worksheet.getCell("A5").font = { bold: true, size: 14 };

  worksheet.mergeCells("A6:K6");
  worksheet.getCell(
    "A6"
  ).value = `Total Unpaid: ${statistics.totalUnpaid} over ${statistics.totalUnpaidTransactions} transactions`;
  worksheet.getCell("A6").font = { bold: true, size: 14 };

  worksheet.mergeCells("A7:K7");
  worksheet.getCell(
    "A7"
  ).value = `Total Due Today: ${statistics.totalDueToday} over ${statistics.totalDueTodayTransactions} transactions`;
  worksheet.getCell("A7").font = { bold: true, size: 14 };

  worksheet.mergeCells("A8:K8");
  worksheet.getCell(
    "A8"
  ).value = `Total Overdue: ${statistics.totalOverdue} over ${statistics.totalOverdueTransactions} transactions`;
  worksheet.getCell("A8").font = { bold: true, size: 14 };

  // Add headers directly after the report information
  const headerRow = worksheet.addRow([
    "Id",
    "Device Name",
    "EMEI Number",
    "Civil ID",
    "Customer Name",
    "Phone",
    "Months",
    "Selling Price",
    "Total Payable",
    "Date",
    "Amount",
    "Status",
  ]);

  // Style the header row
  headerRow.eachCell((cell) => {
    cell.font = { bold: true, size: 14, color: { argb: "FFFFFFFF" } }; // White font color
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "752888" },
    }; // Background color #752888
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
  });

  // Define column widths
  worksheet.columns = [
    { key: "_id", width: 20 },
    { key: "deviceName", width: 20 },
    { key: "emiNumber", width: 40 },
    { key: "civilID", width: 20 },
    { key: "customerName", width: 20 },
    { key: "customerMobile", width: 20 },
    { key: "months", width: 40 },
    { key: "price", width: 20 },
    { key: "totalPayableBalance", width: 20 },
    { key: "currentMonthDate", width: 40 },
    { key: "currentMonthAmount", width: 20 },
    { key: "status", width: 40 },
  ];

  // Add rows with the data
  data.forEach((item) => {
    worksheet.addRow({
      _id: item._id,
      deviceName: item.deviceName,
      emiNumber: item.emiNumber,
      civilID: item.civilID,
      customerName: item.customerName,
      customerMobile: item.customerMobile,
      months: item.months,
      price: item.price,
      totalPayableBalance: item.totalPayableBalance,
      currentMonthDate: item.currentMonthDate,
      currentMonthAmount: item.currentMonthAmount,
      status: item.status,
    });
  });

  // Set the response headers
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=salesExcelData.xlsx"
  );

  // Write to buffer and send it as a response
  await workbook.xlsx.write(res);
  res.end();
};
