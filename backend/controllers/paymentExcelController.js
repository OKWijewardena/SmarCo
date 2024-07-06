const ExcelJS = require('exceljs');

exports.paymentExcel = async (req, res) => {
  const paymentExcelData = req.body;
  console.log("Request body:", paymentExcelData);

  // Create a new workbook and worksheet
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Payment Excel Data Report');

  // Get the current date
  const currentDate = new Date().toLocaleDateString();

  // Add report information at the top
  worksheet.mergeCells('A3:K3');
  worksheet.getCell('A3').value = 'Payment Excel Report';
  worksheet.getCell('A3').font = { bold: true, size: 16 };

  worksheet.mergeCells('A2:K2');
  worksheet.getCell('A2').value = `Generated Date: ${currentDate}`;
  worksheet.getCell('A2').font = { bold: true, size: 14 };

  worksheet.mergeCells('A1:K1');
  worksheet.getCell('A1').value = 'Company Name: SMARTCO Pvt Ltd';
  worksheet.getCell('A1').font = { bold: true, size: 14 };

  // Add headers directly after the report information
  const headerRow = worksheet.addRow([
    'Id', 'Customer Name', 'Civil ID', 'Device Name', 'Emei Number', 'Price', 'Date'
  ]);

// Style the header row
headerRow.eachCell((cell) => {
    cell.font = { bold: true, size: 14, color: { argb: 'FFFFFFFF' } }; // White font color
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '752888' } }; // Background color #752888
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
  });

  // Define column widths
  worksheet.columns = [
    { key: '_id', width: 20 },
    { key: 'customerName', width: 20 },
    { key: 'civilID', width: 40 },
    { key: 'deviceName', width: 20 },
    { key: 'emiNumber', width: 20 },
    { key: 'price', width: 20 },
    { key: 'date', width: 40 }
  ];

  // Add rows with the data
  paymentExcelData.forEach(item => {
    worksheet.addRow({
      _id: item._id, 
      customerName: item.customerName, 
      civilID: item.civilID, 
      deviceName: item.deviceName, 
      emiNumber: item.emiNumber, 
      price: item.price, 
      date: item.date, 
    
    });
  });

  // Set the response headers
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=paymentExcelData.xlsx');

  // Write to buffer and send it as a response
  await workbook.xlsx.write(res);
  res.end();
};
