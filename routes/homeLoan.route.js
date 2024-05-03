const express = require("express");
const router = express.Router();
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');
const Users = require("../models/User.model");
const nodemailer = require('nodemailer');
const mustache = require('mustache');
const fs = require('fs');
const Employee = require("../models/Employee");
const SaleriedHomeLoanFormModel = require("../models/SaleriedHomeLoanForm.model");
const BusinessHomeLoanForm = require("../models/BusinessHomeLoanForm");
const { uploadImageAndGetUrl,deleteFilefromfirebase } = require("../utils/firebase");

// const filepath="boat.jpeg"
// const del= deleteFilefromfirebase(filepath);
// console.log("deleted iem ",del);

const uploadsPath = path.join(__dirname, '..', 'temp');
const storageimage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Specify the local destination path
    // cb(null, 'C:/Users/yashc/OneDrive/Desktop/Gravitonweb/loanwebsite/src/assets/uploads/');
    cb(null, uploadsPath);
  },
  filename: function (req, file, callback) {
    fileName = file.originalname;
    const filename = fileName;
    // const filename = "file_" + uuid4() + fileName;
    callback(null, filename);
  },
});
const upload = multer({ storage: storageimage });

router.post("/saleried_home_loan", async (req, res) => {
  try {
    // Extact data from req.body
    const { dividendArr, dividendArr1, dividendArr2, dividendArr3, formData, connector_id } =
      req.body;

    const userdetails = {
      fname: formData.fname,
      mname: formData.mname,
      lname: formData.lname,
      email: formData.email,
      phone: formData.phone,
      // address: formData.address,
      // business_address: formData.business_address,
      purpose_of_loan: formData.purpose_of_loan,
      fathers_name: formData.fathers_name,
      mothers_name: formData.mothers_name,
      marital_status: formData.marital_status,
      spouse_name: formData.spouse_name,
      alternate_number: formData.alternate_number,
      date_of_birth: formData.date_of_birth,
      pancard_number: formData.pancard_number,
      permanent_address: formData.permanent_address,
      residential_address: formData.residential_address,
      landmark: formData.landmark,
      village: formData.village,
      city: formData.city,
      state: formData.state,
      pincode: formData.pincode,
    };

    const coapplicantdetails = {
      co_fname: formData.co_fname,
      co_mname: formData.co_mname,
      co_lname: formData.co_lname,
      co_email: formData.co_email,
      co_phone: formData.co_phone,
      // co_address: formData.co_address,
      // co_business_address: formData.co_business_address,
      co_purpose_of_loan: formData.co_purpose_of_loan,
      co_fathers_name: formData.co_fathers_name,
      co_mothers_name: formData.co_mothers_name,
      co_marital_status: formData.co_marital_status,
      co_spouse_name: formData.co_spouse_name,
      co_alternate_number: formData.co_alternate_number,
      co_date_of_birth: formData.co_date_of_birth,
      co_pancard_number: formData.co_pancard_number,
      co_permanent_address: formData.co_permanent_address,
      // co_residential_address: formData.co_residential_address,
      co_land_mark: formData.co_land_mark,
      co_village: formData.co_village,
      co_city: formData.co_city,
      co_state: formData.co_state,
      co_pincode: formData.co_pincode,
      co_relation: formData.co_relation,
    };
    // Create a new user document
    const newForm = new SaleriedHomeLoanFormModel({
      userID: formData.userID,
      userbankingdeatails: dividendArr || [],
      userloanpaymentdetails: dividendArr1 || [],
      coapplicantbankingdetails: dividendArr2 || [],
      coapplicantloanpaymentdetails: dividendArr3 || [],
      userdetails: userdetails,
      coapplicantdetails: coapplicantdetails,
      connector_id,
    });

    // Save the new user document
    await newForm.save();

    res.status(200).send({ id: newForm._id });
  } catch (error) {
    console.error("Error creating new user:", error);
    res.status(500).send("Internal Server Error");
  }
});
router.post("/saleried_home_loan_uploadFiles/:id",
  upload.fields([
    { name: "first_month_salary", maxCount: 1 },
    { name: "second_month_salary", maxCount: 1 },
    { name: "third_month_salary", maxCount: 1 },
    { name: "itr", maxCount: 1 },
    { name: "bank_statement", maxCount: 1 },
    { name: "address_proof", maxCount: 1 },
    { name: "adhar_front", maxCount: 1 },
    { name: "adhar_back", maxCount: 1 },
    { name: "pancard", maxCount: 1 },
    { name: "applicant_photo", maxCount: 1 },
    // property details
    { name: 'ownership_proof', maxCount: 1 },
    { name: 'mutation_copy', maxCount: 1 },
    { name: 'land_revenue', maxCount: 1 },
    { name: 'lpc', maxCount: 1 },
    { name: 'thirteen_year_chaindeed', maxCount: 1 },
    { name: 'propety_map', maxCount: 1 },
    // { name: "income_proof", maxCount: 1 },
    // { name: "registration_proof", maxCount: 1 },
  ]),
  // upload.any(),
  async (req, res) => {
    // console.log(req.files);
    try {
      // const s3 = new AWS.S3();
      const formid = req.params.id;

      if (!mongoose.Types.ObjectId.isValid(formid)) {
        return res.status(400).send("Invalid formid");
      }

      // let response = {};

      // Safely access 'images' field
      // response = req.files ? req.files.name.map((file) => file.filename) : [];

      // console.log(response);  

      // Safely access 'documents' field
      // response.documents = files.documents ? files.documents.map((file) => file.filename) : [];

      const form = await SaleriedHomeLoanFormModel.findById(formid);

      if (!form) {
        return res.status(404).send("Form does not found");
      }
      const uploadPromises = [];
      for (const fieldName in req.files) {
        const files = req.files[fieldName];
        for (const file of files) {
          // console.log("file :-", file);
          const random = Math.random().toString().substr(2, 6);
          const destinationFileName = `salariedhomeloan/${random}${file.originalname}`;
          const uploadfile = await uploadImageAndGetUrl(file?.path, destinationFileName);

          // uploadPromises.push(abhi);
          uploadPromises.push({ fieldName: fieldName, url: uploadfile, path:destinationFileName });

          fs.unlink(file.path, (err) => {
            if (err) {
              console.error('Error deleting file:', err);
            } else {
              console.log('File deleted successfully:');
            }
          })
        }
      }
      // Wait for all the files to be uploaded to S3
      const uploadedPromises = await Promise.all(uploadPromises);

      // Update the form document with S3 file details and save
      for (const uploadedFile of uploadedPromises) {
        console.log("uploaded File ::::", uploadedFile.url);
        form.files.push({
          fieldName: uploadedFile.fieldName, // replace with your field name
          url: uploadedFile.url,
          // fileName: uploadedFile.Key.split('/').pop(), // get the filename from S3 key
          path: uploadedFile.path, // S3 file URL
          // originalFileName: uploadedFile.originalname, // or modify based on your requirements
        });
      }
      await form.save();

      res.status(200).send({ message: "Form submitted successfully", id: formid });
    } catch (error) {
      console.error("Error adding files to user:", error);
      res.status(500).send("Internal Server Error");
    }
  }
);
router.get("/getAllSalariedHomeLoanForm/:id", async (req, res) => {
  try {
    const salariedLoanForm = await SaleriedHomeLoanFormModel.find({ userID: req.params.id });
    res.status(200).send({ data: salariedLoanForm });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
})
router.get("/getAllSalariedHomeLoanForm", async (req, res) => {
  try {
    const personalLoanForm = await SaleriedHomeLoanFormModel.find();
    res.status(200).send({ data: personalLoanForm });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
})
router.put('/approve_salaried_home_loan/:id', async (req, res) => {
  const itemId = req.params.id;

  try {
    // Find the item by ID and update the 'approved' field to true
    const updatedItem = await SaleriedHomeLoanFormModel.findByIdAndUpdate(itemId, { approved: true }, { new: true });

    if (!updatedItem) {
      return res.status(404).json({ message: `Item with ID ${itemId} not found.` });
    }

    res.status(200).json(updatedItem);
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
router.put('/reject_salaried_home_loan/:id', async (req, res) => {
  const itemId = req.params.id;

  try {
    // Find the item by ID and update the 'approved' field to true
    const updatedItem = await SaleriedHomeLoanFormModel.findByIdAndUpdate(itemId, { approved: false }, { new: true });

    if (!updatedItem) {
      return res.status(404).json({ message: `Item with ID ${itemId} not found.` });
    }

    res.status(200).json(updatedItem);
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
router.delete("/deletesalariedhomeloan/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const Data = await SaleriedHomeLoanFormModel.findById(id);
    // console.log("Car loan data", carData);
    Data.files.forEach(async (file) => {
      // console.log("file", file);
      const filepath = file?.path;
      const deletefromfirebase= await deleteFilefromfirebase(filepath);
      console.log("deletefromfirebase", deletefromfirebase);
    });
    await SaleriedHomeLoanFormModel.findByIdAndDelete(id);
    res.status(200).json({ message: "deleted" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
})
router.get("/Personaldownload/:id", async (req, res) => {
  // console.log("Hi")
  try {
    const fileid = req.params.id;
    // const formtype = req.params.form;

    const form = await PersonalLoanForm.findOne({
      files: { $elemMatch: { _id: fileid } },
    });

    const matchingFile = form.files.find(
      (file) => file._id.toString() === fileid
    );
    // Define the file path based on your uploads directory
    const filePath = matchingFile.path + matchingFile.originalFileName;

    // console.log("filePath = ",filePath,formtype)

    // Send the file as a response
    res.download(filePath, (err) => {
      if (err) {
        console.error("Error downloading file:", err);
      }
    });
  } catch (error) {
    console.log(error)
    res.status(500).send("Error while downloading the file");
  }
});


router.post("/business_home_loan_form", async (req, res) => {

  try {
    // Extact data from req.body
    const {
      dividendArr,
      dividendArr1,
      dividendArr2,
      dividendArr3,
      dividendArr4,
      dividendArr5,
      dividendArr6,
      // selectedLanguage,
      formData,
      connector_id,
    } = req.body;

    const userdetails = {
      // name: formData.name,
      // email: formData.email,
      // phone: formData.phone,
      // user_loan_type: formData.user_loan_type,
      // address: formData.address,
      // business_address: formData.business_address,
      // user_salaried: formData.employment_type,
      // monthly_salary: formData.monthly_salary,
      // yearly_income: formData.yearly_income

      fname: formData.fname,
      mname: formData.mname,
      lname: formData.lname,
      email: formData.email,
      phone: formData.phone,
      // address: formData.address,
      // business_address: formData.business_address,
      purpose_of_loan: formData.purpose_of_loan,
      fathers_name: formData.fathers_name,
      mothers_name: formData.mothers_name,
      marital_status: formData.marital_status,
      spouse_name: formData.spouse_name,
      alternate_number: formData.alternate_number,
      date_of_birth: formData.date_of_birth,
      pancard_number: formData.pancard_number,
      permanent_address: formData.permanent_address,
      residential_address: formData.residential_address,
      landmark: formData.landmark,
      village: formData.village,
      city: formData.city,
      state: formData.state,
      pincode: formData.pincode,
    }

    const coapplicantdetails = {
      co_fname: formData.co_fname,
      co_mname: formData.co_mname,
      co_lname: formData.co_lname,
      co_email: formData.co_email,
      co_phone: formData.co_phone,
      // address: formData.address,
      // business_address: formData.business_address,
      co_purpose_of_loan: formData.co_purpose_of_loan,
      co_fathers_name: formData.co_fathers_name,
      co_mothers_name: formData.co_mothers_name,
      co_marital_status: formData.co_marital_status,
      co_alternate_number: formData.co_alternate_number,
      co_date_of_birth: formData.co_date_of_birth,
      co_pancard_number: formData.co_pancard_number,
      co_permanent_address: formData.co_permanent_address,
      // co_residential_address: formData.co_residential_address,
      co_land_mark: formData.co_land_mark,
      co_village: formData.co_village,
      co_city: formData.co_city,
      co_state: formData.co_state,
      co_pincode: formData.co_pincode,
      co_relation: formData.co_relation,
    }
    // Create a new user document
    const newForm = new BusinessHomeLoanForm({
      userID: formData.userID,
      userbankingdetails: dividendArr || [],
      userloanpaymentdetails: dividendArr1 || [],
      coapplicantbankingdetails: dividendArr2 || [],
      coapplicantloanpaymentdetails: dividendArr3 || [],
      guarantordetails: dividendArr4 || [],
      guarantorbankdetails: dividendArr5 || [],
      guarantorloandetails: dividendArr6 || [],
      // selectedLanguage: selectedLanguage,
      userdetails: userdetails,
      coapplicantdetails: coapplicantdetails,
      connector_id,
    });

    // Save the new user document
    await newForm.save();

    res.status(200).send({ id: newForm._id });
  } catch (error) {
    console.error('Error creating new user:', error);
    res.status(500).send('Internal Server Error');
  }
})

// router.post('/businessformUploadfiles/:id', upload.fields([
router.post('/business_home_loan_form_uploadFiles/:id',
  // upload.any()
  upload.fields([
    { name: "first_month_bank_statement", maxCount: 1 },
    { name: "second_month_bank_statement", maxCount: 1 },
    { name: "third_month_bank_statement", maxCount: 1 },
    { name: "itr", maxCount: 1 },
    // { name: "bank_statement", maxCount: 1 },
    { name: "address_proof", maxCount: 1 },
    { name: "adhar_front", maxCount: 1 },
    { name: "adhar_back", maxCount: 1 },
    { name: "pancard", maxCount: 1 },
    { name: "applicant_photo", maxCount: 1 },
    { name: 'vintage_proof', maxCount: 1 },
    { name: "form_three", maxCount: 1 },
    { name: "trade_licence", maxCount: 1 },
    { name: "business_registration_certificate", maxCount: 1 },

    { name: 'income_proof', maxCount: 1 },
    { name: 'registration_proof', maxCount: 1 },
    { name: 'last_two_year_six', maxCount: 1 },
    { name: 'last_two_year_as', maxCount: 1 },
    { name: 'co_three_month_salary', maxCount: 1 },
    { name: 'co_income_proof', maxCount: 1 },
    { name: 'co_itr', maxCount: 1 },
    { name: 'co_registration_proof', maxCount: 1 },
    { name: 'co_last_two_year_six', maxCount: 1 },
    { name: 'co_last_two_year_as', maxCount: 1 },
    { name: 'guar_three_month_salary', maxCount: 1 },
    { name: 'guar_last_two_year_six', maxCount: 1 },
    { name: 'guar_last_two_year_as', maxCount: 1 },
    { name: 'guar_income_proof', maxCount: 1 },
    { name: 'guar_itr', maxCount: 1 },

    { name: 'guar_registration_proof', maxCount: 1 },
// property detail
    { name: 'ownership_proof', maxCount: 1 },
    { name: 'mutation_copy', maxCount: 1 },
    { name: 'land_revenue', maxCount: 1 },
    { name: 'lpc', maxCount: 1 },
    { name: 'thirteen_year_chaindeed', maxCount: 1 },
    { name: 'propety_map', maxCount: 1 },
  ])
  , async (req, res) => {

    console.log(req.files);
    try {
      const formid = req.params.id;

      if (!mongoose.Types.ObjectId.isValid(formid)) {
        return res.status(400).send('Invalid formid');
      }

      // Find the user by its _id
      const form = await BusinessHomeLoanForm.findById(formid);

      if (!form) {
        return res.status(404).send('form does not found');
      }

      const uploadPromises = [];
      for (const fieldName in req.files) {
        const files = req.files[fieldName];
        for (const file of files) {
          // console.log("file :-", file);
          const random = Math.random().toString().substr(2, 6);
          const destinationFileName = `businesshomeloan/${random}${file.originalname}`;
          const uploadfile = await uploadImageAndGetUrl(file?.path, destinationFileName);

          // uploadPromises.push(abhi);
          uploadPromises.push({ fieldName: fieldName, url: uploadfile, path:destinationFileName });

          fs.unlink(file.path, (err) => {
            if (err) {
              console.error('Error deleting file:', err);
            } else {
              console.log('File deleted successfully:');
            }
          })
        }
      }
      // Wait for all the files to be uploaded to S3
      const uploadedPromises = await Promise.all(uploadPromises);

      // Update the form document with S3 file details and save
      for (const uploadedFile of uploadedPromises) {
        console.log("uploaded File ::::", uploadedFile.url);
        form.files.push({
          fieldName: uploadedFile.fieldName, // replace with your field name
          url: uploadedFile.url,
          // fileName: uploadedFile.Key.split('/').pop(), // get the filename from S3 key
          path: uploadedFile.path, // S3 file URL
          // originalFileName: uploadedFile.originalname, // or modify based on your requirements
        });
      }
      await form.save();
      res.status(200).send({ message: "Form submitted successfully", id: formid });
    } catch (error) {
      console.error('Error adding files to user:', error);
      res.status(500).send('Internal Server Error');
    }
  });

router.get("/getAllBusinessHomeLoanForms/:id", async (req, res) => {

  try {
    const goldloanform = await BusinessHomeLoanForm.find({ userID: req.params.id });
    res.status(200).send({ data: goldloanform });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
})
router.get("/getAllBusinessHomeLoanForms", async (req, res) => {

  try {
    const businessLoanForm = await BusinessHomeLoanForm.find();
    res.status(200).send({ data: businessLoanForm });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
})
router.put('/approve_business_home_loan/:id', async (req, res) => {
  const itemId = req.params.id;

  try {
    // Find the item by ID and update the 'approved' field to true
    const updatedItem = await BusinessHomeLoanForm.findByIdAndUpdate(itemId, { approved: true }, { new: true });

    if (!updatedItem) {
      return res.status(404).json({ message: `Item with ID ${itemId} not found.` });
    }

    res.status(200).json(updatedItem);
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
router.put('/reject_business_home_loan/:id', async (req, res) => {
  const itemId = req.params.id;

  try {
    // Find the item by ID and update the 'approved' field to true
    const updatedItem = await BusinessHomeLoanForm.findByIdAndUpdate(itemId, { approved: false }, { new: true });

    if (!updatedItem) {
      return res.status(404).json({ message: `Item with ID ${itemId} not found.` });
    }

    res.status(200).json(updatedItem);
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
router.delete("/deletebusinesshomeloan/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const Data = await BusinessHomeLoanForm.findById(id);
    // console.log("Car loan data", carData);
    Data.files.forEach(async (file) => {
      // console.log("file", file);
      const filepath = file?.path;
      const deletefromfirebase= await deleteFilefromfirebase(filepath);
      console.log("deletefromfirebase", deletefromfirebase);
    });
    await BusinessHomeLoanForm.findByIdAndDelete(id);
    res.status(200).json({ message: "deleted" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
})

module.exports = router;