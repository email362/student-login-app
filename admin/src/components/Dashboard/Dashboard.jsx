import { useEffect, useState } from 'react'
import './Dashboard.css'
import EditStudentForm from '../EditStudentForm/EditStudentForm';
import AddStudentForm from '../AddStudentForm/AddStudentForm';

function Dashboard() {

  const [data, setData] = useState([]);
  const [showAddStudentForm, setShowAddStudentForm] = useState(false);
  const [showEditStudentForm, setShowEditStudentForm] = useState(false);
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
  }

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
  }

  const handleDelete = (index) => {
    const newData = [...data];
    const studentId = newData[index].studentId;
    newData.splice(index, 1);
    setData(newData);
    // delete the student from the server
    fetch(`https://vivacious-jade-nightgown.cyclic.app/api/students`, {
      method: 'DELETE',
      body: JSON.stringify({ studentId })
    })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.log(error))
  }

  const handleInputChange = (event, index) => {
    const newData = [...data];
    newData[index].classes = event.target.value.split(",");
    setData(newData);
  }

  const handleAddStudent = () => {
    setShowAddStudentForm(true);
  }

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
  }

  const handleCancelAddStudent = () => {
    setShowAddStudentForm(false);
  }

  return (
    <>
      <h1>MLC Admin Home</h1>
      {(!showAddStudentForm && !showEditStudentForm) && (
        <div>
          <button onClick={handleAddStudent}>Add Student</button>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Student ID</th>
                <th>Classes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => {
                const {studentName, studentId, classes, isEditable} = item;

                return (
                  <tr key={studentId}>
                    <td>{studentName}</td>
                    <td>{studentId}</td>
                    <td>
                      {isEditable ? (
                        <input type="text" value={classes.join(",")} onChange={(event) => handleInputChange(event, index)} />
                      ) : (
                        classes.join(", ")
                      )}
                    </td>
                    <td>
                      <button onClick={() => handleEdit(index)}>Edit</button>
                      <button onClick={() => handleDelete(index)}>Delete</button>
                    </td>
                  </tr>
                )
              })}
            </tbody>

          </table>
        </div>
      )}
      {showAddStudentForm && ( 
        <AddStudentForm onSubmit={handleAddStudentSubmit} onCancel={handleCancelAddStudent} /> 
      )}
      {showEditStudentForm && (
        <EditStudentForm student={selectedStudent} onSave={handleSave} onCancel={() => setShowEditStudentForm(false)} />
      )}
    </>
  )
}

export default Dashboard