import { useEffect, useState } from 'react'
import './Dashboard.css'
import EditStudentForm from '../EditStudentForm/EditStudentForm';
import AddStudentForm from '../AddStudentForm/AddStudentForm';
import TimeLogForm from '../TimeLogForm/TimeLogForm';

function Dashboard() {

  const [data, setData] = useState([]);
  const [showAddStudentForm, setShowAddStudentForm] = useState(false);
  const [showEditStudentForm, setShowEditStudentForm] = useState(false);
  const [showTimeLogForm, setShowTimeLogForm] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    fetch('https://vivacious-jade-nightgown.cyclic.app/api/students')
      .then(response => response.json())
      .then(data => {
        console.log(data)
        setData(data)
      })
  }, []);

  const handleEdit = (index) => {
    setSelectedStudent(data[index]);
    setShowEditStudentForm(true);
  };

  const handleTimeLog = (index) => {
    setSelectedStudent(data[index]);
    setShowTimeLogForm(true);
  };

  const handleSave = (updatedStudent) => {
    const newData = [...data];
    const index = newData.findIndex(student => student.studentId === updatedStudent.studentId);
    newData[index] = updatedStudent;
    setData(newData);
    // send the updated data to the server
    fetch(`https://vivacious-jade-nightgown.cyclic.app/api/students/${updatedStudent.studentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedStudent)
    })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.log(error))
    setShowEditStudentForm(false);
    setShowTimeLogForm(false);
    
  };

  const handleDelete = (index) => {
    const newData = [...data];
    const studentId = newData[index].studentId;
    newData.splice(index, 1);
    setData(newData);
    // delete the student from the server
    fetch(`https://vivacious-jade-nightgown.cyclic.app/api/students/${studentId}`, {
      method: 'DELETE'
    })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.log(error))
  };

  const handleInputChange = (event, index) => {
    const newData = [...data];
    newData[index].classes = event.target.value.split(",");
    setData(newData);
  };

  const handleAddStudent = () => {
    setShowAddStudentForm(true);
  };

  const handleAddStudentSubmit = (newStudent) => {
    // const form = event.target;
    // console.log(form);
    // const studentName = form.elements['name'].value;
    // const studentId = form.elements['studentId'].value;
    // const classes = form.elements['classes'].value.split(',');
    // const newStudent = { studentName, studentId, classes };
    fetch('https://vivacious-jade-nightgown.cyclic.app/api/students', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newStudent)
    })
      .then(response => response.json())
      .then(res => {
        if(res.status === "Success") {
          setData([...data, res.student]);
        }
        setShowAddStudentForm(false);
      })
      .catch(error => {
        console.log(error)
        setShowAddStudentForm(false);
      })
  };

  const handleCancelAddStudent = () => {
    setShowAddStudentForm(false);
  };

  return (
    <div className='admin-panel'>
      <h1 className='title'>MLC Admin Home</h1>
      {(!showAddStudentForm && !showEditStudentForm && !showTimeLogForm) && (
        // <div className='container'>
        <>
          <button className='btn-view-log' onClick={handleAddStudent}>Add Student</button>
          <table className='students-table'>
            <thead className='students-head'>
              <tr>
                <th>Name</th>
                <th>Student ID</th>
                <th>Classes</th>
                <th>Total Time Logged (hours)</th>
                <th>Time Log</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className='students-body'>
              {data.map((item, index) => {
                const isEditable = false;
                const {studentName, studentId, classes, loginTimestamps} = item;

                return (
                  <tr className='student-row' key={studentId}>
                    <td className='student-name'>{studentName}</td>
                    <td className='student-id'>{studentId}</td>
                    <td className='classes'>
                      {isEditable ? (
                        <input type="text" value={classes.join(",")} onChange={(event) => handleInputChange(event, index)} />
                      ) : (
                        classes.join(", ")
                      )}
                    </td>
                    <td className='total-time-logged'>{((loginTimestamps.reduce((acc,curr) => curr.totalTime + acc,0)/3600)).toFixed(2)}</td>
                    <td className='time-log'>
                      <button className='btn-view-log' onClick={() => handleTimeLog(index)}>Time Log</button>
                    </td>
                    <td>
                      <button className='btn-edit' onClick={() => handleEdit(index)}>Edit</button>
                      <button className='btn-delete' onClick={() => handleDelete(index)}>Delete</button>
                    </td>
                  </tr>
                )
              })}
            </tbody>

          </table>
        </>
      )}
      {showAddStudentForm && ( 
        <AddStudentForm onSubmit={handleAddStudentSubmit} onCancel={handleCancelAddStudent} /> 
      )}
      {showEditStudentForm && (
        <EditStudentForm student={selectedStudent} onSave={handleSave} onCancel={() => setShowEditStudentForm(false)} />
      )}
      {showTimeLogForm && (
        <TimeLogForm student={selectedStudent} onSave={handleSave}  onCancel={() => setShowTimeLogForm(false)} />
      )}
    </div>
  )
}

export default Dashboard;