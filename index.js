import express, { json } from 'express';
import { connect, Schema, model } from 'mongoose';
import cors from 'cors';
import { config } from 'dotenv';
import { join } from 'path';
import * as url from 'url';


config();

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const StudentSchema = new Schema({
  studentName: String,
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

const Student = model('Student', StudentSchema);

const app = express();

app.use(json());
app.use(cors());
app.use(express.static(__dirname + '/buildAdmin'));
console.log("dirname", __dirname);


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
    const conn = await connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};



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

app.get('/api/students', async (req, res) => {
  let students = null;
  try {
    students = await Student.find({});
    res.json(students);
  } catch {
    res.json({message:'Students not found'});
  }
});

app.get('/admin', (req, res) => {
  res.sendFile(join(__dirname, 'buildAdmin', 'index.html'));
});

//default homepage
app.get('/', (req, res) => {
  res.json({message: "Welcome to the student login API"});
});

// // catch all other routes
// app.get('*', (req, res) => {
//   // send built folder
//   res.sendFile(path.join(__dirname, '..', 'student-login-frontend', 'dist', 'index.html'));
// });

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
});

