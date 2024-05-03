const express=require('express');
const router=express.Router();
const multer=require('multer');
// const path=require('path')
const xlsx=require('xlsx');
const EmployeeData = require('../models/EmployeeData');
// const {storageimage}=
// const Employee=require('../models/employee');

// const router = express.Router();
// const uploadsPath = path.join(__dirname, '..', 'temp');
// const storageimage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       // Specify the local destination path
//       // cb(null, 'C:/Users/yashc/OneDrive/Desktop/Gravitonweb/loanwebsite/src/assets/uploads/');
//       cb(null, uploadsPath);
//     },
//     filename: function (req, file, callback) {
//     //   fileName = file.originalname;
//       const filename = file.originalname;
//       // const filename = "file_" + uuid4() + fileName;
//       callback(null, filename);
//     },
//   });
//   console.log("Hello");

const upload = multer({ storage:  multer.memoryStorage()  });

router.post('/upload_data', upload.single('file'), async (req, res) => {
    if (!req.file) {
      return res.status(400).send('No file uploaded');
    }
  
    try {
      // Read the Excel file
      const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
  
      // Convert the Excel data to JSON
      const jsonData = xlsx.utils.sheet_to_json(sheet, { header: 1 });
  
      // Extract headers and rows
      const headers = jsonData[0];
      const rows = jsonData.slice(1);
  
      // Convert rows to objects using headers
      const data = rows.map((row) => {
        const obj = {};
        headers.forEach((header, idx) => {
          obj[header] = row[idx];
        });
        return obj;
      });
  
      // Insert the data into MongoDB
      await EmployeeData.insertMany(data);
  
      res.status(200).send('Data uploaded and stored successfully');
    } catch (error) {
      console.error('Error processing file:', error);
      res.status(500).send('Internal Server Error');
    }
  });


  router.get('/get_employee_data', async (req, res) => {
    try {
        const data = await EmployeeData.find({});
        res.status(200).json(data);
    } catch (error) {
        res.status(400).json("No data found")
    }
  });
  
// export default router;
module.exports=router;