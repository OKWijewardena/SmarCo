const ExcelJS = require("exceljs");

exports.employeeandadminexcel = async (req, res) => {
  const employeeandadminData = req.body;
  console.log("Request body:", employeeandadminData);

  // Create a new workbook and worksheet
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Employee And Admin Report");

  // Get the current date
  const currentDate = new Date().toLocaleDateString();

  // Add report information at the top
  worksheet.mergeCells("A3:K3");
  worksheet.getCell("A3").value = "Employee And Admin Excel Report";
  worksheet.getCell("A3").font = { bold: true, size: 16 };

  worksheet.mergeCells("A2:K2");
  worksheet.getCell("A2").value = `Generated Date: ${currentDate}`;
  worksheet.getCell("A2").font = { bold: true, size: 14 };

  worksheet.mergeCells("A1:K1");
  worksheet.getCell("A1").value = "Company Name: SmartCo Pvt Ltd";
  worksheet.getCell("A1").font = { bold: true, size: 14 };

  // Add headers directly after the report information
  const headerRow = worksheet.addRow([
    
    "name",
    "email",
    "password",
    "address",
    "phone",
    "role",
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
    { key: "address", width: 20 },
    { key: "phone", width: 20 },
    { key: "role", width: 40 },
  ];

  // Add rows with the data
  employeeandadminData.forEach((item) => {
    worksheet.addRow({
      
      name: item.name,
      email: item.email,
      password: item.password,
      address: item.address,
      phone: item.phone,
      role: item.role,
    });
  });

  // Set the response headers
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=employeeandadminData.xlsx"
  );

  // Write to buffer and send it as a response
  await workbook.xlsx.write(res);
  res.end();
};
