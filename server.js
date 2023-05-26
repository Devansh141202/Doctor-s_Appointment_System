const express = require("express");
const app = express();
require('dotenv').config()
const dbConfig = require("./config/dbConfig");
app.use(express.json());
const userRoute = require("./routes/userRoute");
const adminRoute = require("./routes/adminRoute");
const doctorRoute = require("./routes/doctorsRoute");
const path = require("path");
const cors = require("cors");

const port = process.env.PORT || 5000;

app.use(cors());
app.use('/api/user', userRoute);
app.use('/api/admin', adminRoute);
app.use('/api/doctor', doctorRoute);
app.get('/api/', (req, res) => {
    try {
        return res.status(200).send({ message: "Welcome to Doctor's Appointment System API", success: true });
    }
    catch (error) {
        console.log(error);
        return res.status(200).send({ message: "Internal Server Error", success: false, error });
    }
});



if (process.env.NODE_ENV === 'production') {
    app.use('/'.express.static('client/build'));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client/build/index.html'));
    }
    );
}


app.listen(port, () => console.log(`Node server started at port ${port}`));
