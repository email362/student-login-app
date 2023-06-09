const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
// const path = require('path');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
// mongoose.connect(process.env.MONGODB_URI);

const timeStamp = () => {
  return Number(Date.now());
};

const elapsedTime = (start, end) => {
  const totalSeconds = (end - start)/1000;
  return totalSeconds;
};

//await connect to database
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

const StudentSchema = new mongoose.Schema({
  studentId: String,
  classes: [String],
  lastLogin: Number,
  lastLogout: Number,
  lastClass: String,
  loginTimestamps: [{
    className: String,
    loginTime: Number,
    logoutTime: Number,
    totalTime: Number,
  }],
});

const Student = mongoose.model('Student', StudentSchema);

// grabs student by id and returns student object
app.get('/api/student', async (req, res) => {
  console.log(req.query);
  try {
    const student = await Student.findOne({"studentId": req.query.studentId});
    res.json(student);
  } catch(e) {
    console.log(e.message);
    res.status(404).send('Student not found');
  }
});

// handles login by updating lastLogin and lastClass
app.post('/api/login', async (req, res) => {
  const { studentId, className } = req.body;
  try {
    // console.log("student object", student);
    //set login time
    const loginTime = timeStamp();
    //update student login time
    const updatedStudent = await Student.findOneAndUpdate({ "studentId": studentId }, { "lastLogin": loginTime, "lastClass": className }, { new: true });
    console.log("updated student", updatedStudent);
    res.json(updatedStudent);
  } catch (e) {
    console.log(e.message);
    res.status(404).send('Student not found');
  }
  // list all students
  // const student = await Student.find().filter((s) => s.studentId === studentId)[0];
  // console.log(students);
  // console.log(studentId, student);

});

// handles logout by updating lastLogout, then calculating total time and updating loginTimestamps
app.post('/api/logout', async (req, res) => {
  const { studentId } = req.body;
  const student = await Student.findOne({ "studentId": studentId });
  console.log("last login value: ", student.lastLogin);
  const logoutTimeStamp = timeStamp();
  const totalTime = elapsedTime(student.lastLogin, logoutTimeStamp);
  const updatedStudent = await Student.findOneAndUpdate({ "studentId": studentId }, { "lastLogout": logoutTimeStamp, $push: { loginTimestamps: {"className": student.lastClass, "loginTime": student.lastLogin, "logoutTime": logoutTimeStamp, "totalTime": totalTime  } } }, { new: true });
  console.log("updated student", updatedStudent);
  res.json(updatedStudent);
});

// app.use(express.static('../student-login-frontend/dist'));

// //default homepage
// app.get('/', (req, res) => {
//   // send built folder
//   res.sendFile(path.join(__dirname, '..', 'student-login-frontend', 'dist', 'index.html'));
// });

// // catch all other routes
// app.get('*', (req, res) => {
//   // send built folder
//   res.sendFile(path.join(__dirname, '..', 'student-login-frontend', 'dist', 'index.html'));
// });

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server started on port ${PORT}`));  
});

