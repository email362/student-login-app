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
  loginTimestamps: [{
    className: String,
    loginTime: Date,
    logoutTime: Date,
  }],
});

const Student = mongoose.model('Student', StudentSchema);

app.post('/api/login', async (req, res) => {
  const studentId = req.body.studentId;
  const student = await Student.findOne({ "studentId": studentId });
  // list all students
  // const student = await Student.find().filter((s) => s.studentId === studentId)[0];
  // console.log(students);
  // console.log(studentId, student);

  if (!student) {
    return res.status(404).send('Student not found');
  }

  res.json(student);
});

app.post('/api/log-time', async (req, res) => {
  const { studentId, className, loginTime, logoutTime } = req.body;
  const updatedStudent = await Student.findOneAndUpdate({ studentId }, {
    $push: {
      loginTimestamps: { className, loginTime, logoutTime },
    },
  }, { new: true });

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

