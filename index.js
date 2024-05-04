const express = require('express');
const app = express();
const { connectToMongo } = require('./db');
const cors = require('cors');
// const { firebaseapp } = require('./utils/firebase');
// const { Functions } = require('firebase-admin/functions');
// const functions = require('firebase-functions');


// app.use(cors());
app.use(cors({
    // origin: 'https://parvloan.firebaseapp.com/',
    origin: '*',
    // credentials: true // if you're using cookies or sessions  
}));
app.use((req, res, next) => {
    // res.setHeader('Access-Control-Allow-Origin', 'https://parvloan.firebaseapp.com/');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    // res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    // res.setHeader('Access-Control-Allow-Credentials', true); // if you're using cookies or sessions
    next();
  });

app.use(express.json());

app.use("/api/v1/", require('./routes/data'));
app.use("/api/v1/",require('./routes/user.route'));
app.use("/api/v1/",require('./routes/employee.route'));
app.use("/api/v1/",require('./routes/homeLoan.route'));

// app.use(express.static('temp'));
app.use(express.static('./tmp'));
// app.use('/temp', express.static('temp'));
app.use('/tmp', express.static('./tmp'));

// firebaseapp();
// app.use(firebaseapp);
connectToMongo();



// const port = process.env.PORT || 8000;
const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`listening at ${port}`);
})

// exports.api=functions.https.onRequest(app);
