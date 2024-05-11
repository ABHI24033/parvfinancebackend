const express = require("express");
const router = express.Router();
const Users = require("../models/User.model");
const nodemailer = require('nodemailer');
const mustache = require('mustache');
const fs = require('fs');
const Employee = require("../models/Employee");

// Create a transporter using your Gmail credentials
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'parvmultiservices@gmail.com',
        pass: 'bijfijgfloicmwhn',
    },
});

async function sendMail(email, fullname) {
    try {
        const templatePath = 'index.html';
        const template = fs.readFileSync(templatePath, 'utf8');
        const htmlContent = mustache.render(template, { fullname });

        const mailOptions = {
            from: 'parvmultiservices@gmail.com',
            to: email,
            subject: 'Welcome Confirmation',
            html: htmlContent,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
    } catch (error) {
        console.error('Error sending email:', error);
        throw error; // Re-throw the error to be caught by the calling code
    }
}

router.post("/register", async (req, res) => {

    try {
        const { email, password, mobile_number, whats_app_number, full_name, current_profession, company_name,
            street, city, pincode, landmark, district, state, user_type } = req.body;

        const userExist = await Users.findOne({ email: req.body.email });
        if (userExist) {
            return res.status(400).json({ message: "User already exist" })
        }

        if (!email || !password) return res.status(400).json("email and password is required");
        const address = {
            street,
            landmark,
            city,
            district,
            pincode,
            state,
        }
        const newUser = new Users({
            email,
            password,
            address: address,
            mobile_number,
            whats_app_number,
            full_name,
            current_profession,
            company_name,
            approved:null,
            user_type,

        });

        const user = await newUser.save();
        await sendMail(email, full_name);

        res.status(201).json({ message: "user created successfully" });
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
})


router.post("/login", async (req, res) => {
    try {
        const { email, password, user_type } = req.body;

        if (!email || !password) return res.status(400).json("email and password is required");

        const user = await Users.findOne({ email });
        console.log("User--",user)

        if (user_type !== user.user_type) {
            return res.status(200).json({ message: "User not found" });
        }
        if (user) {
            if (password === user.password) {
                res.status(200).json({
                    user,
                    message: "User login successfully"
                });
            }
            else {
                res.status(401).json({ message: "password not matched" });
            }
        }
        else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

router.get("/getallconnectorUser",async(req,res)=>{
    try {
        const user=await Users.find({user_type:"Connector"});
        res.status(200).json({user,message:"User fetched successfully"});
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

router.put('/update_connector_status/:id', async (req, res) => {
    const itemId = req.params.id;
  
    try {
      // Find the item by ID and update the 'approved' field to true
      const updatedItem = await Users.findByIdAndUpdate(itemId, { approved: true }, { new: true });
      if (!updatedItem) {
        return res.status(404).json({ message: `Item with ID ${itemId} not found.` });
      }
  
      res.status(200).json(updatedItem);
    } catch (error) {
      console.error('Error updating item:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
router.put('/reject_connector_status/:id', async (req, res) => {
    const itemId = req.params.id;
  
    try {
      // Find the item by ID and update the 'approved' field to true
      const updatedItem = await Users.findByIdAndUpdate(itemId, { approved: false }, { new: true });
      if (!updatedItem) {
        return res.status(404).json({ message: `Item with ID ${itemId} not found.` });
      }
  
      res.status(200).json(updatedItem);
    } catch (error) {
      console.error('Error updating item:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
router.delete('/delete_connector/:id', async (req, res) => {
    const itemId = req.params.id;
    try {
      const updatedItem = await Users.findByIdAndDelete(itemId);
      if (!updatedItem) {
        return res.status(404).json({ message: `Item with ID ${itemId} not found.` });
      }
      res.status(200).json(updatedItem);
    } catch (error) {
      console.error('Error updating item:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

router.get("/getuserbyid/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const user = await Users.findById(id);
        console.log(user);
        res.status(201).json({ user, message: "User fetched successfully" });
    } catch (error) {
        res.status(500).json({ error, message: "Internal Server Error" });
    }
})



router.post("/add_employee", async (req, res) => {
    try {
        const { email, password, mobile_number, whats_app_number, full_name, current_profession, company_name,
            street, city, pincode, landmark, district, state, user_type } = req.body;

        const userExist = await Employee.findOne({ email: req.body.email });
        if (userExist) {
            return res.status(400).json({ message: "User already exist" })
        }

        if (!email || !password) return res.status(400).json("email and password is required");
        const address = {
            street,
            landmark,
            city,
            district,
            pincode,
            state,
        }
        const newUser = new Employee({
            email,
            password,
            address: address,
            mobile_number,
            whats_app_number,
            full_name,
            // current_profession,
            // company_name,
            user_type,

        });

        const user = await newUser.save();
        await sendMail(email, full_name);

        res.status(201).json({ message: "user created successfully" });
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

router.get("/get_employee", async (req, res) => {
    try {
        const users = await Users.find({user_type:"Employee"});
        res.status(200).json(users);
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

router.delete("/delete_employee/:id", async(req, res) => {
    const { id } = req.params;
    try {
        const deleteItem=await Employee.findByIdAndDelete(id);
        if(!deleteItem){
            res.status(404).send("No item found");
        }
        res.status(200).send("Item deleted successfully");
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
})

module.exports = router;

