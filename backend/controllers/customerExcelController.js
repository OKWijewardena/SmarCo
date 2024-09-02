const ExcelJS = require("exceljs");

exports.customerexcel = async (req, res) => {
  const customerData = req.body;
  console.log("Request body:", customerData);

  // Create a new workbook and worksheet
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Customer Report");

  // Get the current date
  const currentDate = new Date().toLocaleDateString();

  // Add report information at the top
  worksheet.mergeCells("A3:K3");
  worksheet.getCell("A3").value = "Customer Excel Report";
  worksheet.getCell("A3").font = { bold: true, size: 16 };

  worksheet.mergeCells("A2:K2");
  worksheet.getCell("A2").value = `Generated Date: ${currentDate}`;
  worksheet.getCell("A2").font = { bold: true, size: 14 };

  worksheet.mergeCells("A1:K1");
  worksheet.getCell("A1").value = "Company Name: SMARTCO Pvt Ltd";
  worksheet.getCell("A1").font = { bold: true, size: 14 };

  // Add headers directly after the report information
  const headerRow = worksheet.addRow([
    
    "Name",
    "Email",
    "Password",
    "Civil Id",
    "Nationality",
    "Address",
    "Paci Number",
    "Mobile",
    "Whatsapp No",
    "Telephone No",
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
    
    { key: "name", width: 20 },
    { key: "email", width: 40 },
    { key: "password", width: 20 },
    { key: "civil_id", width: 20 },
    { key: "nationality", width: 20 },
    { key: "address", width: 40 },
    { key: "paci_number", width: 20 },
    { key: "mobile", width: 20 },
    { key: "whatsapp_no", width: 20 },
    { key: "telephone_no", width: 20 },
  ];

  // Add rows with the data
  customerData.forEach((item) => {
    worksheet.addRow({
     
      name: item.name,
      email: item.email,
      password: item.password,
      civil_id: item.civil_id,
      nationality: item.nationality,
      address: item.address,
      paci_number: item.paci_number,
      mobile: item.mobile,
      whatsapp_no: item.whatsapp_no,
      telephone_no: item.telephone_no,
    });
  });

  // Set the response headers
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=customerdata.xlsx"
  );

  // Write to buffer and send it as a response
  await workbook.xlsx.write(res);
  res.end();
};
