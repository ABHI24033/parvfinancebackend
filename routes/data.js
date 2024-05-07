const express = require('express');
const router = express.Router();
const dotenv = require("dotenv");
const Image = require('../models/Images');
const multer = require('multer');
const Testimonials = require('../models/Testimonials');
const uuid4 = require('uuid4');
const path = require('path');
const SchoolLoanForm = require('../models/SchoolLoanForm');
const Notification = require('../models/Notification');
const mongoose = require('mongoose');
const GoldLoanForm = require('../models/GoldLoanForm');
const ProfessionalLoanForm = require('../models/ProfessionalLoanForm');
const Contacts = require('../models/Contacts');
const PersonalLoanForm = require('../models/PersonalLoanForm');
const HomeLoanForm = require('../models/HomeLoanForm');
const CarLoanForm = require('../models/CarLoanForm');
const BusinessLoanForm = require('../models/BusinessLoanForm');
const fs = require("fs");
const Blog = require('../models/Blog');
const Career = require('../models/Career');
// Import the AWS SDK
const AWS = require('aws-sdk');
const GalleryImages = require('../models/GalleryImages');
const { uploadImageAndGetUrl, deleteFilefromfirebase } = require("../utils/firebase");



let fileName;

// Ensure the 'uploads' directory exists
const uploadsPath = path.join(__dirname, '..', 'temp');
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}

// Multer setup for handling image uploads
const storage = multer.diskStorage({

  destination: function (req, file, cb) {
    // Specify the local destination path
    // cb(null, 'C:/Users/yashc/OneDrive/Desktop/Gravitonweb/loanwebsite/src/assets/uploads/');
    cb(null, uploadsPath);
  },
  filename: function (req, file, callback) {
    fileName = file.originalname;
    // const filename = fileName;
    const filename = "file_" + uuid4() + fileName;
    callback(null, filename);
  },

});

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
const storage2 = multer.diskStorage({

  destination: function (req, file, cb) {
    // Specify the local destination path
    // cb(null, 'C:/Users/yashc/OneDrive/Desktop/Gravitonweb/loanwebsite/src/assets/uploads/');
    cb(null, uploadsPath);
  },
  filename: function (req, file, callback) {
    fileName = file.originalname;
    const filename = fileName;
    callback(null, filename);
  },

});

const upload = multer({ storage: storageimage });
const upload2 = multer({ storage: storage2 })
const uploadimage = multer({ storage: storageimage })

router.get("/", (req, res) => {
  res.send("Backend runs successfully");
})

router.post("/uploadImage", uploadimage.single("file"), async (req, res) => {
  console.log("testing");
  try {
    // const s3 = new AWS.S3();
    // console.log(req.file);
    // upload Image on Firebase Storage
    const date = new Date().getTime();
    const destinationFileName = `carousel/${date}${req.file.originalname}`;
    uploadImageAndGetUrl(req.file.path, destinationFileName).then(async (url) => {
      // console.log(url);
      const image = new Image({
        fileName: req.file.originalname,  // Save the S3 key in the database
        path: destinationFileName,
        url: url,
        // key: s3Key,  // Save the S3 URL in the database
        body: {
          heading: req.body.body.heading,
          description: req.body.body.description,
        }
      });
      await image.save();
      fs.unlink(req.file.path, (err) => {
        if (err) {
          console.error('Error deleting file:', err);
        } else {
          console.log('File deleted successfully:');
        }
      });
    });


    // });


    res.status(201).send({
      // id: image._id,
      // s3Url: data.Location,
      message: "Image uploaded successfully",
    });
    // console.log('File uploaded successfully. S3 URL:', data.Location);
    // Now you can use data.Location as the public URL of your file
    // }
    // });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error by Abhisek kuamr");
  }
});
// deleting uploaded image
router.delete("/deleteImage/:id", async (req, res) => {
  try {
    // const s3 = new AWS.S3();
    const imageId = req.params.id;
    // Find the image by its id
    const image = await Image.findById(imageId);
    if (!image) {
      return res.status(404).send("Image not found");
    }
    const imagePath = image?.path;
    await deleteFilefromfirebase(imagePath);
    await Image.findByIdAndDelete(imageId);
    res.status(200).send({ message: "Image deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});
// router.use('/getImages', express.static(path.join(__dirname, 'uploads')));
router.get("/getImages", async (req, res) => {
  try {
    const images = await Image.find({});
    res.status(200).send({ images: images });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/careers", async (req, res) => {
  // console.log("Hii");
  try {
    const { name, email, password, phone, message } = req.body;
    if (!name || !email || !password || !phone || !message)
      return res.status(400).json("Missing fields");

    const object = {
      name: name,
      email: email,
      phone: phone,
      password: password,
      message: message,
    };

    const careers = new Career(object);

    await careers.save();
    res.status(201).send({ message: "Thank you for connecting with us!" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});
router.get("/careers", async (req, res) => {
  try {
    const careers = await Career.find({});
    res.status(200).send(careers);
  } catch (error) {
    res.status(500).json("Internal Server Error");
  }
})
router.delete("/delete_career/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // const career =
    await Career.findByIdAndDelete(id);
    res.status(200).send({ message: "Deleted Successfully" });
  } catch (error) {
    res.status(500).json("Internal Server Error");
  }
})

router.post("/uploadTestimonials", async (req, res) => {
  try {
    const { name, testimonial } = req.body;
    if (!name || !testimonial) return res.status(400).json("Missing fields");

    const currenttestimonial = new Testimonials({
      name: name,
      testimonial: testimonial,
    });

    await currenttestimonial.save();
    res.status(201).send({ message: "testimonial uploaded succesfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/getTestimonials", async (req, res) => {
  try {
    const images = await Testimonials.find({});

    res.status(200).send({ images: images });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});
// deleting testimonial
router.delete("/deleteTestimonial/:id", async (req, res) => {
  try {
    const testimonialId = req.params.id;
    // Find the testimonial by its id
    const testimonial = await Testimonials.findById(testimonialId);
    if (!testimonial) {
      return res.status(404).send("Testimonial not found");
    }
    // Delete the testimonial from the database
    await Testimonials.findByIdAndDelete(testimonialId);
    res.status(200).send({ message: "Testimonial deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});


router.post("/sendNotification", async (req, res) => {
  try {
    const { content, notificationSeen, email, subject } = req.body;
    // if (!content || !notificationSeen || !email || !subject)
    //   return res.status(400).json("Missing fields");

    const notification = new Notification({
      content: content,
      // notificationSeen: notificationSeen,
      email: email,
      subject: subject,
    });

    await notification.save();
    res.status(201).send({ message: "notification uploaded succesfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/notification/:id", async (req, res) => {
  try {
    await Notification.find(
      { _id: req.params.id },
      { $set: { notificationSeen: true } }
    );

    res.status(200).send({ message: "Notification seen successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/getNotification", async (req, res) => {
  try {
    const notifications = await Notification.find({});
    res.status(200).send({ notifications: notifications });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// deleting Notification
router.delete("/deleteNotification/:id", async (req, res) => {
  try {
    const notifictaionId = req.params.id;
    // Find the Notification by its id
    const notification = await Notification.findById(notifictaionId);
    if (!notification) {
      return res.status(404).send("Testimonial not found");
    }
    // Delete the Notification from the database
    await Notification.findByIdAndDelete(notifictaionId);
    res.status(200).send({ message: "Testimonial deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});


router.post("/schoolLoanForm", async (req, res) => {
  try {
    // Extact data from req.body
    const { dividendArr, dividendArr1, dividendArr2, dividendArr3, formData, connector_id } =
      req.body;

    const collegeSchooldetails = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      conract_person: formData.conract_person,
      website_link: formData.website_link,
      sclclg_managed: formData.sclclg_managed,
      business_address: formData.business_address,
    };

    const annualfeescollection = {
      school_clg: formData.school_clg,
      transport: formData.transport,
      hostel: formData.hostel,
    };
    // Create a new user document
    const newForm = new SchoolLoanForm({
      trustees: dividendArr || [],
      institutes: dividendArr1 || [],
      students: dividendArr2 || [],
      studenthotel: dividendArr3 || [],
      collegeSchooldetails: collegeSchooldetails,
      annualfeescollection: annualfeescollection,
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

router.get("/getAllSchoolForms/:id", async (req, res) => {
  try {

    const schoolloanform = await SchoolLoanForm.find({ userID: req.params.id });
    res.status(200).send({ data: schoolloanform });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});
router.get("/getAllSchoolForms", async (req, res) => {
  try {

    const schoolloanform = await SchoolLoanForm.find();
    res.status(200).send({ data: schoolloanform });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/uploadfiles/:id",
  upload.fields([
    { name: "three_month_salary", maxCount: 1 },
    { name: "itr", maxCount: 1 },
    { name: "income_proof", maxCount: 1 },
    { name: "registration_proof", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const formid = req.params.id;

      if (!mongoose.Types.ObjectId.isValid(formid)) {
        return res.status(400).send("Invalid formid");
      }

      // Find the user by its _id
      const form = await SchoolLoanForm.findById(formid);

      if (!form) {
        return res.status(404).send("form does not found");
      }
      // ================================================================
      const uploadPromises = [];
      for (const fieldName in req.files) {
        const files = req.files[fieldName];
        for (const file of files) {
          // console.log("file :-", file);
          const random = Math.random().toString().substr(2, 6);
          const destinationFileName = `schoolloan/${random}${file.originalname}`;
          const uploadfile = await uploadImageAndGetUrl(file?.path, destinationFileName);
          uploadPromises.push({ fieldName: fieldName, url: uploadfile, path: destinationFileName });

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
        // console.log("uploaded File ::::", uploadedFile.url);
        form.files.push({
          fieldName: uploadedFile.fieldName, // replace with your field name
          url: uploadedFile.url,
          // fileName: uploadedFile.Key.split('/').pop(), // get the filename from S3 key
          path: uploadedFile.path, // S3 file URL
          // originalFileName: uploadedFile.originalname, // or modify based on your requirements
        });
      }
      await form.save();
      // =====================================================================================
      // Update the files array in the form document
      // for (const fieldName in req.files) {
      //   const files = req.files[fieldName];
      //   // Map uploaded files to the desired format and push them into the form.files array
      //   files.forEach((file) => {
      //     form.files.push({
      //       fieldName: fieldName,
      //       fileName: file.filename,
      //       path: file.destination,
      //       originalFileName: file.originalname,
      //     });
      //   });
      // }
      // // Save the updated form document
      // await form.save();

      res.status(200).send({ message: "Form submitted successfully" });
    } catch (error) {
      console.error("Error adding files to user:", error);
      res.status(500).send("Internal Server Error");
    }
  }
);

router.get("/Schooldownload/:id", async (req, res) => {
  // console.log("Hi")
  try {
    const fileid = req.params.id;
    // const formtype = req.params.form;

    const form = await SchoolLoanForm.findOne({
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
// approved functonality
router.put('/approve_school_loan/:id', async (req, res) => {
  const itemId = req.params.id;

  try {
    // Find the item by ID and update the 'approved' field to true
    const updatedItem = await SchoolLoanForm.findByIdAndUpdate(itemId, { approved: true }, { new: true });

    if (!updatedItem) {
      return res.status(404).json({ message: `Item with ID ${itemId} not found.` });
    }

    res.status(200).json(updatedItem);
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
router.put('/reject_school_loan/:id', async (req, res) => {
  const itemId = req.params.id;

  try {
    // Find the item by ID and update the 'approved' field to true
    const updatedItem = await SchoolLoanForm.findByIdAndUpdate(itemId, { approved: false }, { new: true });

    if (!updatedItem) {
      return res.status(404).json({ message: `Item with ID ${itemId} not found.` });
    }

    res.status(200).json(updatedItem);
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
router.delete("/deleteschoolloan/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const Data = await SchoolLoanForm.findById(id);
    // console.log("Car loan data", carData);
    Data.files.forEach(async (file) => {
      // console.log("file", file);
      const filepath = file?.path;
      const deletefromfirebase = await deleteFilefromfirebase(filepath);
      console.log("deletefromfirebase", deletefromfirebase);
    });
    await SchoolLoanForm.findByIdAndDelete(id);
    res.status(200).json({ message: "deleted" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
})


router.post("/goldLoanForm", async (req, res) => {
  try {
    // Extact data from req.body
    const {
      name,
      email,
      phone,
      application_no,
      dob,
      adhar_no,
      voter_id,
      address,
      business_address,
      pan_no,
      spouse_name,
      spouse_dob,
      connector_id,
    } = req.body;

    // Create a new user document
    const newForm = new GoldLoanForm({
      name,
      email,
      phone,
      application_no,
      dob,
      adhar_no,
      voter_id,
      address,
      business_address,
      pan_no,
      spouse_name,
      spouse_dob,
      connector_id,
    });

    // Save the new user document
    await newForm.save();

    res.status(200).send({ message: "Form submitted successfully" });
  } catch (error) {
    console.error("Error creating new user:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/getAllGoldForms/:id", async (req, res) => {
  try {
    const goldloanform = await GoldLoanForm.find({ userID: req.params.id });
    res.status(200).send({ data: goldloanform });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});
router.get("/getAllGoldForms", async (req, res) => {
  try {
    const goldloanform = await GoldLoanForm.find();
    res.status(200).send({ data: goldloanform });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/Golddownload/:id", async (req, res) => {
  // console.log("Hi")
  try {
    const fileid = req.params.id;
    // const formtype = req.params.form;

    const form = await GoldLoanForm.findOne({
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
// approve functionlanility
router.put('/approve_gold_loan/:id', async (req, res) => {
  const itemId = req.params.id;

  try {
    // Find the item by ID and update the 'approved' field to true
    const updatedItem = await GoldLoanForm.findByIdAndUpdate(itemId, { approved: true }, { new: true });

    if (!updatedItem) {
      return res.status(404).json({ message: `Item with ID ${itemId} not found.` });
    }

    res.status(200).json(updatedItem);
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
router.put('/reject_gold_loan/:id', async (req, res) => {
  const itemId = req.params.id;

  try {
    // Find the item by ID and update the 'approved' field to true
    const updatedItem = await GoldLoanForm.findByIdAndUpdate(itemId, { approved: false }, { new: true });

    if (!updatedItem) {
      return res.status(404).json({ message: `Item with ID ${itemId} not found.` });
    }

    res.status(200).json(updatedItem);
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
router.delete("/deletegoldloan/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await GoldLoanForm.findByIdAndDelete(id);
    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server error" });
  }
})


router.post("/professionalLoanForm", async (req, res) => {
  try {
    // Extact data from req.body
    const {
      dividendArr,
      dividendArr1,
      dividendArr2,
      dividendArr3,
      formData,
      loanType,
      connector_id,
    } = req.body;

    const userdetails = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      degree: formData.degree,
      address: formData.address,
      business_address: formData.business_address,
    };

    const coapplicantdetails = {
      co_name: formData.co_name,
      co_email: formData.co_email,
      co_phone: formData.co_phone,
      co_address: formData.co_address,
      co_business_address: formData.co_business_address,
    };
    // Create a new user document
    const newForm = new ProfessionalLoanForm({
      userbankingdeatails: dividendArr || [],
      userloanpaymentdetails: dividendArr1 || [],
      coapplicantbankingdetails: dividendArr2 || [],
      coapplicantloanpaymentdetails: dividendArr3 || [],
      userdetails: userdetails,
      coapplicantdetails: coapplicantdetails,
      loanType: loanType,
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

router.post("/prfessionalformUploadfiles/:id",
  upload.fields([
    { name: "three_month_salary", maxCount: 1 },
    { name: "itr", maxCount: 1 },
    { name: "income_proof", maxCount: 1 },
    { name: "registration_proof", maxCount: 1 },
  ]),
  async (req, res) => {
    console.log(req.files);
    try {
      const formid = req.params.id;

      if (!mongoose.Types.ObjectId.isValid(formid)) {
        return res.status(400).send("Invalid formid");
      }

      // Find the user by its _id
      const form = await ProfessionalLoanForm.findById(formid);

      if (!form) {
        return res.status(404).send("form does not found");
      }
      const uploadPromises = [];
      for (const fieldName in req.files) {
        const files = req.files[fieldName];
        for (const file of files) {
          const random = Math.random().toString().substr(2, 6);
          const destinationFileName = `professionalloan/${random}${file.originalname}`;
          const uploadfile = await uploadImageAndGetUrl(file?.path, destinationFileName);
          uploadPromises.push({ fieldName: fieldName, url: uploadfile, path: destinationFileName });

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

      res.status(200).send({ message: "Form submitted successfully" });
    } catch (error) {
      console.error("Error adding files to user:", error);
      res.status(500).send("Internal Server Error");
    }
  }
);

router.get("/getAllProfessionalForms/:id", async (req, res) => {
  try {
    const goldloanform = await ProfessionalLoanForm.find({ userID: req.params.id });
    res.status(200).send({ data: goldloanform });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});
router.get("/getAllProfessionalForms/", async (req, res) => {
  try {
    const professionalLoanForm = await ProfessionalLoanForm.find();
    res.status(200).send({ data: professionalLoanForm });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/Professionaldownload/:id", async (req, res) => {
  // console.log("Hi")
  try {
    const fileid = req.params.id;
    // const formtype = req.params.form;

    const form = await ProfessionalLoanForm.findOne({
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

router.put('/approve_professional_loan/:id', async (req, res) => {
  const itemId = req.params.id;

  try {
    // Find the item by ID and update the 'approved' field to true
    const updatedItem = await ProfessionalLoanForm.findByIdAndUpdate(itemId, { approved: true }, { new: true });

    if (!updatedItem) {
      return res.status(404).json({ message: `Item with ID ${itemId} not found.` });
    }

    res.status(200).json(updatedItem);
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
router.put('/reject_professional_loan/:id', async (req, res) => {
  const itemId = req.params.id;

  try {
    // Find the item by ID and update the 'approved' field to true
    const updatedItem = await ProfessionalLoanForm.findByIdAndUpdate(itemId, { approved: false }, { new: true });

    if (!updatedItem) {
      return res.status(404).json({ message: `Item with ID ${itemId} not found.` });
    }

    res.status(200).json(updatedItem);
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
router.delete("/deleteprofessionalloan/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const Data = await ProfessionalLoanForm.findById(id);
    // console.log("Car loan data", carData);
    Data.files.forEach(async (file) => {
      // console.log("file", file);
      const filepath = file?.path;
      const deletefromfirebase = await deleteFilefromfirebase(filepath);
      console.log("deletefromfirebase", deletefromfirebase);
    });
    await ProfessionalLoanForm.findByIdAndDelete(id);
    res.status(200).json({ message: "deleted" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
})


router.post("/contacts", async (req, res) => {
  // console.log("Hii");
  try {
    const { name, email, phone, message } = req.body;
    if (!name || !email || !phone || !message)
      return res.status(400).json("Missing fields");

    const object = {
      name: name,
      email: email,
      phone: phone,
      message: message,
    };

    const contacts = new Contacts(object);

    await contacts.save();
    res.status(201).send({ message: "Thank you for connecting with us!" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get('/getAllContacts', async (req, res) => {
  try {
    const contacts = await Contacts.find({});
    res.status(201).send({ data: contacts });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
})
router.delete('/contact_delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // const deleteItem=
    await Contacts.findByIdAndDelete(id);
    res.status(201).send({ message: "Deleted Successfully" });
    // const contacts = await Contacts.find({});
    // res.status(201).send({ data: contacts });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
})

router.post("/personalLoanForm", async (req, res) => {
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
    const newForm = new PersonalLoanForm({
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

router.post("/personalformUploadfiles/:id",
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
    // { name: "income_proof", maxCount: 1 },
    // { name: "registration_proof", maxCount: 1 },
  ]),
  async (req, res) => {
    console.log(req.files);
    try {
      // const s3 = new AWS.S3();
      const formid = req.params.id;

      if (!mongoose.Types.ObjectId.isValid(formid)) {
        return res.status(400).send("Invalid formid");
      }

      const form = await PersonalLoanForm.findById(formid);

      if (!form) {
        return res.status(404).send("Form does not found");
      }

      const uploadPromises = [];
      for (const fieldName in req.files) {
        const files = req.files[fieldName];
        for (const file of files) {
          // console.log("file :-", file);
          const random = Math.random().toString().substr(2, 6);
          const destinationFileName = `persoanlloan/${random}${file.originalname}`;
          const uploadfile = await uploadImageAndGetUrl(file?.path, destinationFileName);

          // uploadPromises.push(abhi);
          uploadPromises.push({ fieldName: fieldName, url: uploadfile, path: destinationFileName });

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
        // console.log("uploaded File ::::", uploadedFile.url);
        form.files.push({
          fieldName: uploadedFile.fieldName, // replace with your field name
          url: uploadedFile.url,
          // fileName: uploadedFile.Key.split('/').pop(), // get the filename from S3 key
          path: uploadedFile.path, // S3 file URL
          // originalFileName: uploadedFile.originalname, // or modify based on your requirements
        });
      }
      await form.save();
      // ================================

      res.status(200).send({ message: "Form submitted successfully", id: formid });
    } catch (error) {
      console.error("Error adding files to user:", error);
      res.status(500).send("Internal Server Error");
    }
  }
);

router.get("/getAllPersonalForms/:id", async (req, res) => {
  try {
    const goldloanform = await PersonalLoanForm.find({ userID: req.params.id });
    res.status(200).send({ data: goldloanform });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});
router.get("/getAllPersonalForms", async (req, res) => {
  try {
    const personalLoanForm = await PersonalLoanForm.find();
    res.status(200).send({ data: personalLoanForm });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});
router.put('/approve_persoanl_loan/:id', async (req, res) => {
  const itemId = req.params.id;

  try {
    // Find the item by ID and update the 'approved' field to true
    const updatedItem = await PersonalLoanForm.findByIdAndUpdate(itemId, { approved: true }, { new: true });

    if (!updatedItem) {
      return res.status(404).json({ message: `Item with ID ${itemId} not found.` });
    }

    res.status(200).json(updatedItem);
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
router.put('/reject_persoanl_loan/:id', async (req, res) => {
  const itemId = req.params.id;

  try {
    // Find the item by ID and update the 'approved' field to true
    const updatedItem = await PersonalLoanForm.findByIdAndUpdate(itemId, { approved: false }, { new: true });

    if (!updatedItem) {
      return res.status(404).json({ message: `Item with ID ${itemId} not found.` });
    }

    res.status(200).json(updatedItem);
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
router.delete("/deletepersonalloan/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const Data = await PersonalLoanForm.findById(id);
    // console.log("Car loan data", carData);
    Data.files.forEach(async (file) => {
      // console.log("file", file);
      const filepath = file?.path;
      const deletefromfirebase = await deleteFilefromfirebase(filepath);
      console.log("deletefromfirebase", deletefromfirebase);
    });
    await PersonalLoanForm.findByIdAndDelete(id);
    res.status(200).json({ message: "deleted" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});
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

router.post("/homeLoanForm", async (req, res) => {

  try {
    // Extact data from req.body
    const {
      // selectedLanguage,
      // formData,
      userID,
      employment_type,
      personalloanform_businessloanform_id
    } = req.body;
    // console.log(formData);
    const userdetails = {
      userID,
      employment_type,
      personalloanform_businessloanform_id,
    }
    // const userdetails = {
    //   userID: formData.userID,
    //   employment_type: formData.employment_type,
    //   personalloanform_businessloanform_id: formData.personalloanform_businessloanform_id,
    // }

    // Create a new user document
    const newForm = new HomeLoanForm(userdetails);

    // Save the new user document
    await newForm.save();

    res.status(200).send({ id: newForm._id });
  } catch (error) {
    console.error('Error creating new user:', error);
    res.status(500).send('Internal Server Error');
  }
})
router.post('/homeloanformUploadfiles/:id', upload.fields([
  { name: 'ownership_proof', maxCount: 1 },
  { name: 'mutation_copy', maxCount: 1 },
  { name: 'land_revenue', maxCount: 1 },
  { name: 'lpc', maxCount: 1 },
  { name: 'thirteen_year_chaindeed', maxCount: 1 },
  { name: 'propety_map', maxCount: 1 },
]), async (req, res) => {

  // console.log(req.files);
  try {
    const formid = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(formid)) {
      return res.status(400).send('Invalid formid');
    }

    // Find the user by its _id
    const form = await HomeLoanForm.findById(formid);

    if (!form) {
      return res.status(404).send('form does not found');
    }

    // const uploadPromises = [];

    // Upload each file to S3
    // for (const fieldName in req.files) {
    //   const files = req.files[fieldName];

    // for (const file of files) {
    //   const params = {
    //     Bucket: 'gravitonweb',
    //     Key: `${file.fieldname + "/" + file.filename}`, // Change the key to your desired S3 path
    //     Body: fs.createReadStream(file.path),
    //   };

    //   const uploadPromise = s3.upload(params).promise();
    //   uploadPromises.push(uploadPromise);
    // }
    // }

    // Wait for all uploads to complete
    // const uploadedFiles = await Promise.all(uploadPromises);

    // Delete files from the temp folder after successful upload
    for (const fieldName in req.files) {
      const files = req.files[fieldName];

      files.forEach(file => {
        form.files.push({
          fieldName: fieldName,
          fileName: file.filename,
          path: file.destination,
          originalFileName: file.originalname,
        });
      });

      // for (const file of files) {
      //   require('fs').unlinkSync(file.path);
      // }
    }

    // console.log(uploadedFiles);

    // Update the form document with S3 file details and save
    // for (const uploadedFile of uploadedFiles) {
    //   form.files.push({
    //     fieldName: uploadedFile.Key.split('/')[0], // replace with your field name
    //     fileName: uploadedFile.Key.split('/').pop(), // get the filename from S3 key
    //     path: uploadedFile.Location, // S3 file URL
    //     originalFileName: uploadedFile.originalname, // or modify based on your requirements
    //   });
    // }

    await form.save();

    res.status(200).send({ message: "Form submitted successfully", id: formid });
  } catch (error) {
    console.error('Error adding files to user:', error);
    res.status(500).send('Internal Server Error');
  }
});
router.get("/getAllHomeLoanForms/:id", async (req, res) => {

  try {
    const goldloanform = await HomeLoanForm.find({ userID: req.params.id });
    res.status(200).send({ data: goldloanform });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
})
router.get("/getAllHomeLoanForms", async (req, res) => {

  try {
    const homeLoanForm = await HomeLoanForm.find();
    res.status(200).send({ data: homeLoanForm });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
})
router.get("/Homedownload/:id", async (req, res) => {
  // console.log("Hi")
  try {
    const fileid = req.params.id;
    // const formtype = req.params.form;

    const form = await HomeLoanForm.findOne({
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
router.put('/approve_home_loan/:id', async (req, res) => {
  const itemId = req.params.id;

  try {
    // Find the item by ID and update the 'approved' field to true
    const updatedItem = await HomeLoanForm.findByIdAndUpdate(itemId, { approved: true }, { new: true });

    if (!updatedItem) {
      return res.status(404).json({ message: `Item with ID ${itemId} not found.` });
    }

    res.status(200).json(updatedItem);
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
router.put('/reject_home_loan/:id', async (req, res) => {
  const itemId = req.params.id;

  try {
    // Find the item by ID and update the 'approved' field to true
    const updatedItem = await HomeLoanForm.findByIdAndUpdate(itemId, { approved: false }, { new: true });

    if (!updatedItem) {
      return res.status(404).json({ message: `Item with ID ${itemId} not found.` });
    }

    res.status(200).json(updatedItem);
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post("/carLoanForm", async (req, res) => {

  try {
    // Extact data from req.body
    const {
      dividendArr,
      dividendArr1,
      dividendArr2,
      dividendArr3,
      formData,
      connector_id,
    } = req.body;

    const userdetails = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      business_address: formData.business_address
    }

    const coapplicantdetails = {
      co_name: formData.co_name,
      co_email: formData.co_email,
      co_phone: formData.co_phone,
      co_address: formData.co_address,
      co_business_address: formData.co_business_address,
    }

    // Create a new user document
    const newForm = new CarLoanForm({
      userbankingdetails: dividendArr || [],
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
    console.error('Error creating new user:', error);
    res.status(500).send('Internal Server Error');
  }
})
router.post('/carformUploadfiles/:id', upload.fields([
  { name: 'three_month_salary', maxCount: 1 },
  { name: 'itr', maxCount: 1 },
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
]), async (req, res) => {

  // const pdfc=await uploadPDFonCloudinary();
  console.log(req.files);

  try {
    const formid = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(formid)) {
      return res.status(400).send('Invalid formid');
    }

    // Find the user by its _id
    const form = await CarLoanForm.findById(formid);

    if (!form) {
      return res.status(404).send('form does not found');
    }


    // Update the files array in the form document
    // ================================================
    const uploadPromises = [];
    for (const fieldName in req.files) {
      // console.log(fieldName);
      const files = req.files[fieldName];
      for (const file of files) {
        // console.log("file :-", file);
        const random = Math.random().toString().substr(2, 6);
        const destinationFileName = `carloan/${random}${file.originalname}`;
        const imageupload = await uploadImageAndGetUrl(file?.path, destinationFileName);

        // uploadPromises.push(abhi);
        uploadPromises.push({ fieldName: fieldName, url: imageupload, path: destinationFileName });

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
    console.log("uploaded promesis", uploadedPromises);

    // Update the form document with forebase storage file details and save
    for (const uploadedFile of uploadedPromises) {
      form.files.push({
        fieldName: uploadedFile.fieldName, // replace with your field name
        url: uploadedFile.url,
        path: uploadedFile.path, // S3 file URL
      });
    }
    await form.save();
    // ========================================================
    // }
    // Send a response to the client
    res.status(200).send({ message: 'Form submitted successfully' });
  } catch (error) {
    console.error('Error adding files to user:', error);
    res.status(500).send('Internal Server Error');
  }
});
router.get("/getAllCarLoanForms/:id", async (req, res) => {

  try {
    const goldloanform = await CarLoanForm.find({ userID: req.params.id });
    res.status(200).send({ data: goldloanform });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
})
router.get("/getAllCarLoanForms", async (req, res) => {

  try {
    const carLoanForms = await CarLoanForm.find();
    res.status(200).send({ data: carLoanForms });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
})
router.get("/Cardownload/:id", async (req, res) => {
  // console.log("Hi")
  try {
    const fileid = req.params.id;
    // const formtype = req.params.form;

    const form = await CarLoanForm.findOne({
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
router.put('/approve_car_loan/:id', async (req, res) => {
  const itemId = req.params.id;

  try {
    // Find the item by ID and update the 'approved' field to true
    const updatedItem = await CarLoanForm.findByIdAndUpdate(itemId, { approved: true }, { new: true });

    if (!updatedItem) {
      return res.status(404).json({ message: `Item with ID ${itemId} not found.` });
    }

    res.status(200).json(updatedItem);
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
router.put('/reject_car_loan/:id', async (req, res) => {
  const itemId = req.params.id;

  try {
    // Find the item by ID and update the 'approved' field to true
    const updatedItem = await CarLoanForm.findByIdAndUpdate(itemId, { approved: false }, { new: true });

    if (!updatedItem) {
      return res.status(404).json({ message: `Item with ID ${itemId} not found.` });
    }

    res.status(200).json(updatedItem);
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
router.delete("/deletecarloan/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const carData = await CarLoanForm.findById(id);
    // console.log("Car loan data", carData);
    carData.files.forEach(async (file) => {
      // console.log("file", file);
      const filepath = file?.path;
      const deletefromfirebase = await deleteFilefromfirebase(filepath);
      console.log("deletefromfirebase", deletefromfirebase);
    });
    await CarLoanForm.findByIdAndDelete(id);
    res.status(200).json({ message: "deleted" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
})

router.post("/businessLoanForm", async (req, res) => {

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
    const newForm = new BusinessLoanForm({
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
router.post('/businessformUploadfiles/:id',
  // upload.any(),
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
  ]),
  async (req, res) => {

    console.log(req.files);
    try {
      const formid = req.params.id;

      if (!mongoose.Types.ObjectId.isValid(formid)) {
        return res.status(400).send('Invalid formid');
      }

      // Find the user by its _id
      const form = await BusinessLoanForm.findById(formid);

      if (!form) {
        return res.status(404).send('form does not found');
      }

      const uploadPromises = [];
      for (const fieldName in req.files) {
        const files = req.files[fieldName];
        for (const file of files) {
          // console.log("file :-", file);
          const random = Math.random().toString().substr(2, 6);
          const destinationFileName = `businessloan/${random}${file.originalname}`;
          const uploadfile = await uploadImageAndGetUrl(file?.path, destinationFileName);

          // uploadPromises.push(abhi);
          uploadPromises.push({ fieldName: fieldName, url: uploadfile, path: destinationFileName });

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
          path: uploadedFile.path, // S3 file URL
        });
      }
      await form.save();

      res.status(200).send({ message: "Form submitted successfully", id: formid });
    } catch (error) {
      console.error('Error adding files to user:', error);
      res.status(500).send('Internal Server Error');
    }
  });
router.get("/getAllBusinessLoanForms/:id", async (req, res) => {

  try {
    const goldloanform = await BusinessLoanForm.find({ userID: req.params.id });
    res.status(200).send({ data: goldloanform });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
})
router.get("/getAllBusinessLoanForms", async (req, res) => {

  try {
    const businessLoanForm = await BusinessLoanForm.find();
    res.status(200).send({ data: businessLoanForm });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
})
router.put('/approve_business_loan/:id', async (req, res) => {
  const itemId = req.params.id;

  try {
    // Find the item by ID and update the 'approved' field to true
    const updatedItem = await BusinessLoanForm.findByIdAndUpdate(itemId, { approved: true }, { new: true });

    if (!updatedItem) {
      return res.status(404).json({ message: `Item with ID ${itemId} not found.` });
    }

    res.status(200).json(updatedItem);
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
router.put('/reject_business_loan/:id', async (req, res) => {
  const itemId = req.params.id;

  try {
    // Find the item by ID and update the 'approved' field to true
    const updatedItem = await BusinessLoanForm.findByIdAndUpdate(itemId, { approved: false }, { new: true });

    if (!updatedItem) {
      return res.status(404).json({ message: `Item with ID ${itemId} not found.` });
    }

    res.status(200).json(updatedItem);
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
router.delete("/deletebusinessloan/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const Data = await BusinessLoanForm.findById(id);
    Data.files.forEach(async (file) => {
      const filepath = file?.path;
       await deleteFilefromfirebase(filepath);
    });
    await BusinessLoanForm.findByIdAndDelete(id);
    res.status(200).json({ message: "deleted" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
})

// to create the blogs
router.post("/sendblog", async (req, res) => {

  try {
    const { heading, description, category } = req.body;
    if (!heading || !description || !category)
      return res.status(400).json("Missing fields");

    const object = {
      heading: heading,
      description: description,
      category: category,
    };

    const blog = new Blog(object);

    await blog.save();
    res.status(201).send({ id: blog._id });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});


// router.post("/uploadImage/:id", upload2.single("image"), async (req, res) => {
//   try {

//     const blogid = req.params.id;

//     if (!mongoose.Types.ObjectId.isValid(blogid)) {
//       return res.status(400).send('Invalid formid');
//     }

//     // Find the user by its _id
//     const blog = await Blog.findById(blogid);

//     if (!blog) {
//       return res.status(404).send('blog does not found');
//     }

//     // Update the files array in the form document
//     // Map uploaded files to the desired format and push them into the form.files array
//     blog.image = {
//       path: `${req.file.destination}${req.file.filename}`,
//       originalFileName: req.file.originalname,
//     }
//     // Save the updated form document
//     await blog.save();

//     res
//       .status(201)
//       .send({ message: "blog uploaded succesfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Internal Server Error");
//   }
// });


// Blog post api start

router.post("/uploadImage/:id", upload2.single("image"), async (req, res) => {
  try {
    const s3 = new AWS.S3();

    const blogId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      return res.status(400).send('Invalid formid');
    }

    // Find the blog by its _id
    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).send('Blog not found');
    }

    // Generate a unique key for the S3 object
    const s3Key = `${uuid4()}${req.file.originalname}`;

    // Configure the S3 upload parameters
    const params = {
      Bucket: 'gravitonweb',
      Key: s3Key,
      Body: fs.createReadStream(req.file.path),  // Assuming 'buffer' contains the file data
      ACL: 'public-read',  // Set ACL to public-read if you want the uploaded files to be publicly accessible
    };

    // Upload the image to S3
    s3.upload(params, async (err, data) => {
      if (err) {
        console.error('Error uploading file to S3:', err);
        return res.status(500).send("Internal Server Error");
      } else {
        // Update the image field in the blog document with S3 URL
        blog.image = {
          key: s3Key,
          path: data.Location, // S3 URL
          originalFileName: req.file.originalname,
        };

        // Save the updated blog document
        await blog.save();

        // Delete the local file after upload
        fs.unlink(req.file.path, (err) => {
          if (err) {
            console.error('Error deleting file:', err);
          } else {
            console.log('File deleted successfully:');
          }
        });

        // Send success response with S3 URL
        res.status(201).send({
          message: "Blog uploaded successfully",
          s3Url: data.Location,
        });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// deleting Blog
router.delete("/deleteBlog/:id", async (req, res) => {
  try {
    const s3 = new AWS.S3();
    const blogId = req.params.id;
    console.log("blogId = ", blogId)
    // Find the image by its id
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).send("Image not found");
    }

    // Delete the image from the local file system
    const deleteParams = {
      Bucket: "gravitonweb",
      Key: blog.image.key,
      body: blog.image.body,
    };

    s3.deleteObject(deleteParams, async (err, data) => {
      if (err) {
        console.error('Error deleting file from S3:', err);
      } else {
        await Blog.findByIdAndDelete(blogId);
        res.status(200).send({ message: "Image deleted successfully" });
      }
    });
    // Delete the image from the database
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});


router.get("/getBlogs", async (req, res) => {
  try {
    const blogs = await Blog.find({});
    res.status(200).send({ data: blogs });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
})


router.get("/Businessdownload/:id", async (req, res) => {
  // console.log("Hi")
  try {
    const fileid = req.params.id;
    // const formtype = req.params.form;

    const form = await BusinessLoanForm.findOne({
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

router.post('/upload_gallery_images', upload.array('images', 10), async (req, res) => {
  const files = req.files;
  // console.log("Gallery", files);

  if (!files || files.length === 0) {
    return res.status(400).send('No images uploaded.');
  }

  // =================================
  const uploadPromises = [];
  // for (const fieldName in req.files) {
  // const files = req.files[fieldName];
  for (const file of files) {
    // console.log("file :-", file);
    const random = Math.random().toString().substr(2, 6);
    const destinationFileName = `galleryImages/${random}${file.originalname}`;
    const uploadfile = await uploadImageAndGetUrl(file?.path, destinationFileName);

    // uploadPromises.push(abhi);
    uploadPromises.push({ filename: file.filename, url: uploadfile, path: destinationFileName });

    fs.unlink(file.path, (err) => {
      if (err) {
        console.error('Error deleting file:', err);
      } else {
        console.log('File deleted successfully:');
      }
    })
  }
  // }
  // Wait for all the files to be uploaded to S3
  const uploadedPromises = await Promise.all(uploadPromises);

  // Update the form document with S3 file details and save
  for (const uploadedFile of uploadedPromises) {
    // console.log("uploaded File ::::", uploadedFile.url);
    // form.files.push({
    const data = await new GalleryImages({
      filename: uploadedFile.filename, // replace with your field name
      url: uploadedFile.url,
      // fileName: uploadedFile.Key.split('/').pop(), // get the filename from S3 key
      path: uploadedFile.path, // S3 file URL
      // originalFileName: uploadedFile.originalname, // or modify based on your requirements
    });
    console.log(data);
    await data.save();
  }
  // await form.save();

  // =================================

  // Store image metadata in MongoDB
  // const images = files.map((file) => ({
  //   filename: file.filename,
  //   originalname: file.originalname,
  //   mimetype: file.mimetype,
  //   size: file.size,
  // }));

  try {
    // await GalleryImages.insertMany(uploadedPromises);
    res.status(201).send({
      message: 'Images uploaded successfully!',
      // files: images,
    });
  } catch (error) {
    res.status(500).send('Error storing image metadata.');
  }
});
router.get('/getAllGalleryImages', async (req, res) => {
  try {
    const images = await GalleryImages.find({})
    res.status(200).send(images)
  } catch (error) {
    res.status(500).send("Error while fetching the file");
  }
})
router.delete("/delete_image/:id", async (req, res) => {
  try {
    const { id } = req.params; 
    const image = await GalleryImages.findById(id)
    const filepath = image?.path;
     await deleteFilefromfirebase(filepath);
    await GalleryImages.findByIdAndDelete(id);
    res.status(200).json({message:"image deleted successfully"});
  } catch (error) {
    res.status(500).send("Error while deleting the file");
  }
})
module.exports = router;
