const ExcelJS = require("exceljs");

exports.addexcel = async (req, res) => {
  const salesData = req.body;
  console.log("Request body:", salesData);

  // Create a new workbook and worksheet
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sheet 1");

  // Get the current date
  const currentDate = new Date().toLocaleDateString();

  // Add report information at the top
  worksheet.mergeCells("A1:K1");
  worksheet.getCell("A1").value = "Device Purchase Report";
  worksheet.getCell("A1").font = { bold: true, size: 16 };

  worksheet.mergeCells("A2:K2");
  worksheet.getCell("A2").value = `Generated Date: ${currentDate}`;
  worksheet.getCell("A2").font = { bold: true, size: 14 };

  worksheet.mergeCells("A3:K3");
  worksheet.getCell("A3").value = "Company Name: SMARTCO Pvt Ltd";
  worksheet.getCell("A3").font = { bold: true, size: 14 };

  // Add headers directly after the report information
  const headerRow = worksheet.addRow([
    
    "DeviceName",
    "Price",
    "Color",
    "Shop Name",
    "Model Number",
    "Storage",
    "Ram",
    "Warrenty",
    "Emei Number",
    "Purchase Date",
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
    
    { key: "deviceName", width: 20 },
    { key: "price", width: 10 },
    { key: "color", width: 20 },
    { key: "shopName", width: 20 },
    { key: "modelNumber", width: 20 },
    { key: "storage", width: 20 },
    { key: "ram", width: 20 },
    { key: "warrenty", width: 20 },
    { key: "emiNumber", width: 20 },
    { key: "purchaseDate", width: 20 },
  ];

  // Add rows with the data
  salesData.forEach((item) => {
    worksheet.addRow({
      
      deviceName: item.deviceName,
      price: item.price,
      color: item.color,
      shopName: item.shopName,
      modelNumber: item.modelNumber,
      storage: item.storage,
      ram: item.ram,
      warrenty: item.warrenty,
      emiNumber: item.emiNumber,
      purchaseDate: item.purchaseDate,
    });
  });

  // Set the response headers
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader("Content-Disposition", "attachment; filename=salesdata.xlsx");

  // Write to buffer and send it as a response
  await workbook.xlsx.write(res);
  res.end();
};
