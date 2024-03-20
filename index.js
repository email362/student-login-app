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
    console.log(process.env);
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
    const updatedStudent = await Student.findOneAndUpdate({ "studentId": studentId }, { "lastLogin": loginTime, "lastClass": className, $push: {loginTimestamps: {"className": className, "loginTime": loginTime, "logoutTime": loginTime, "totalTime": 0  } } }, { new: true });
    console.log("logged in student", {
      lastLogin: updatedStudent.lastLogin,
      lastClass: updatedStudent.lastClass,
      newTimestamp: updatedStudent.loginTimestamps[updatedStudent.loginTimestamps.length - 1]
    });
    res.json(updatedStudent);
  } catch (e) {
    console.log(e.message);
    res.status(404).send('Student not found');
  }
});

// handles logout by updating lastLogout, then calculating total time and updating loginTimestamps
app.post('/api/logout', async (req, res) => {
  const { studentId } = req.body;
  try {
    const student = await Student.findOne({ "studentId": studentId });
    const index = student.loginTimestamps.findIndex((timestamp) => timestamp.loginTime === student.lastLogin);
    if (index === -1) {
      throw new Error("Index not found");
    }
    const update = { $set: {} };
    const logoutTime = timeStamp();
    const totalTime = elapsedTime(student.loginTimestamps[index].loginTime, logoutTime);
    const filter = { "studentId": student.studentId };

    update.$set[`loginTimestamps.${index}.logoutTime`] = logoutTime;
    update.$set[`loginTimestamps.${index}.totalTime`] = totalTime;
    update.$set["lastLogout"] = logoutTime;
    
    const updatedStudent = await Student.findOneAndUpdate(filter, update, { new: true });

    console.log("logged out student", {
      timeStamp: updatedStudent.loginTimestamps[index],
      lastLogin: updatedStudent.lastLogin,
      lastLogout: updatedStudent.lastLogout
    });
    res.json(updatedStudent);
  } catch (e) {
    console.log(e.message);
    res.status(404).send('Student not found');
  }
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

app.post('/api/students', async (req, res) => {
  const { studentName, studentId, classes } = req.body;
  console.log(studentName, studentId, classes);
  // look for student by studentId
  let studentExists = true;
  // check if student exists
  try {
    const findStudentRequest = await Student.findOne({ studentId });
    studentExists = findStudentRequest !== null;
    console.log(`Is ${studentId} new? `,!studentExists);
  } catch (e) {
    console.log(e.message);
  }
  // if student exists, return error
  if (studentExists) {
    return res.json({status:"Failure",message:'Student already exists'});
  }
  // if student does not exist, create student
  try {
    const student = await Student.create({ studentName, studentId, classes });
    res.json({status:"Success", student});
  } catch {
    res.json({status:"Faliure",message:'Student not created'});
  }
});

app.delete('/api/students/:studentId', async (req, res) => {
  const { studentId } = req.params;
  console.log(studentId);
  try {
    const deleted = await Student.findOneAndDelete({ studentId });
    res.json({status:"Success", message:'Student deleted', deleted});
  } catch {
    res.json({status:"Faliure",message:'Student not deleted'});
  }
});

app.put('/api/students/:studentId', async (req, res) => {
  const { studentId } = req.params;
  const { studentName, classes, lastLogin, lastLogout, lastClass, loginTimestamps } = req.body;
  console.log(studentId, studentName, classes);
  try {
    const updated = await Student.findOneAndUpdate({ studentId }, { studentName, classes, lastLogin, lastLogout, lastClass, loginTimestamps }, { new: true });
    res.json({status:"Success", message:'Student updated', updated});
  } catch(e) {
    console.log("error",e.message);
    res.json({status:"Failure",message:'Student not updated'});
  }
});


app.get('/admin', async (req, res) => {
  res.sendFile(join(__dirname, 'buildAdmin', 'adminHome.html'));
});

//default homepage
app.get('/', async (req, res) => {
  res.json({message: "Welcome to the student login API"});
});

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
});

