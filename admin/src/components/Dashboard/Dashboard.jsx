import { useEffect, useState } from 'react'
import './Dashboard.css'
import EditStudentForm from '../EditStudentForm/EditStudentForm';
import AddStudentForm from '../AddStudentForm/AddStudentForm';
import TimeLogForm from '../TimeLogForm/TimeLogForm';
import { Table, Button, Title, Box, Modal, Group, Text, MantineProvider, Container } from '@mantine/core';
import { modals, ModalsProvider } from '@mantine/modals';
import { URL } from '../../constants';
import ImportStudents from '../ImportStudents/ImportStudents';


function Dashboard() {

  const [data, setData] = useState([]);
  const [showAddStudentForm, setShowAddStudentForm] = useState(false);
  const [showEditStudentForm, setShowEditStudentForm] = useState(false);
  const [showTimeLogForm, setShowTimeLogForm] = useState(false);
  const [showImportStudentsForm, setShowImportStudentsForm] = useState(true); // change this to false before pushing to main
  const [showDashboard, setShowDashboard] = useState(false); // change this to true before pushing to main
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    fetch(`${URL}/api/students`)
      .then(response => response.json())
      .then(data => {
        if(import.meta.env.MODE === 'development') {
          console.log(data)
        }
        setData(data)
      })
  }, []);

  const handleEdit = (index) => {
    setSelectedStudent(data[index]);
    handleDisplay('editStudent');
  };

  const handleTimeLog = (index) => {
    setSelectedStudent(data[index]);
    handleDisplay('timeLog');
  };

  const handleSave = (updatedStudent) => {
    const newData = [...data];
    const index = newData.findIndex(student => student.studentId === updatedStudent.studentId);
    newData[index] = updatedStudent;
    setData(newData);
    // send the updated data to the server
    fetch(`${URL}/api/students/${updatedStudent.studentId}`, {
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
    fetch(`${URL}/api/students/${studentId}`, {
      method: 'DELETE'
    })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.log(error))
  };

  const handleAddStudentSubmit = (newStudent) => {
    fetch(`${URL}/api/students`, {
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

  const openDeleteModal = (index) => 
    modals.openConfirmModal({
      title: 'Delete Student',
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete this student?
        </Text>
      ),
      labels: { cancel: 'Cancel', confirm: 'Delete' },
      confirmProps: { color: 'red', variant: 'filled', autoContrast: true },
      cancelProps: { color: 'black', variant: 'default', autoContrast: true },
      onCancel: () => console.log('canceled'),
      onConfirm: () => handleDelete(index),
    });

  const handleDisplay = (showState='') => {
    setShowAddStudentForm(false);
    setShowEditStudentForm(false);
    setShowTimeLogForm(false);
    setShowImportStudentsForm(false);
    setShowDashboard(false);
    switch(showState) {
      case 'addStudent':
        setShowAddStudentForm(true);
        break;
      case 'editStudent':
        setShowEditStudentForm(true);
        break;
      case 'timeLog':
        setShowTimeLogForm(true);
        break;
      case 'importStudents':
        setShowImportStudentsForm(true);
        break;
      default:
        setShowDashboard(true);
    }
  };

  const cancelView = () => {
    handleDisplay();
  };

  return (
    <Container size='xl'>
      <ModalsProvider>
        <Box sx={{ padding: '20px' }}>
          <Title order={1}>MLC Admin Home</Title>
          {showDashboard && (
            <Box>
              <Button onClick={() => handleDisplay('addStudent')} color="green" variant="filled" style={{}} className='btn-view-log' autoContrast>Add Student</Button>
              <Button onClick={() => handleDisplay('importStudents')} color="green" variant="filled" style={{}} className='btn-view-log' autoContrast>Import Students</Button>
              <Table striped>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Student ID</th>
                    <th>Classes</th>
                    <th>Total Time Logged (hours)</th>
                    {/* <th>Time Log</th> */}
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody className='students-body'>
                  {data.map((item, index) => {
                    const { studentName, studentId, classes, loginTimestamps } = item;
                    return (
                      <tr key={studentId}>
                        <td>{studentName}</td>
                        <td>{studentId}</td>
                        <td>{classes.join(", ")}</td>
                        <td>{((loginTimestamps.reduce((acc, curr) => curr.totalTime + acc, 0) / 3600)).toFixed(2)}</td>
                        {/* <td>
                        </td> */}
                        <td>
                          <Group>
                            <Button onClick={() => handleTimeLog(index)} className='btn-view-log' color="blue" variant="filled" autoContrast>Time Log</Button>
                            <Button onClick={() => handleEdit(index)} className='btn-edit' color="yellow" variant="filled" autoContrast>Edit Student</Button>
                            {/* <Button onClick={() => handleDelete(index)}>Delete</Button> */}
                            <Button onClick={() => openDeleteModal(index)} className='btn-delete' color="red" variant="filled" autoContrast>Delete</Button>
                          </Group>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </Box>
          )}
          {showTimeLogForm && (<TimeLogForm student={selectedStudent} onSave={handleSave} onCancel={cancelView} />)}
          {showEditStudentForm && (<EditStudentForm student={selectedStudent} onSave={handleSave} onCancel={cancelView} />)}
          {showAddStudentForm && (<AddStudentForm onSubmit={handleAddStudentSubmit} onCancel={cancelView} />)}
          {showImportStudentsForm && (<ImportStudents students={data} onCancel={cancelView} />) }


        {/*
          <Modal
          opened={showAddStudentForm}
          onClose={() => setShowAddStudentForm(false)}
          title="Add Student"
          centered
          size='auto'
          >
          <AddStudentForm onSubmit={handleAddStudentSubmit} onCancel={handleCancelAddStudent} />
          </Modal>
        */}

        {/*
          <Modal
            opened={showEditStudentForm}
            onClose={() => setShowEditStudentForm(false)}
            title="Edit Student"
            centered
            size='auto'
          >
            <EditStudentForm student={selectedStudent} onSave={handleSave} onCancel={() => setShowEditStudentForm(false)} />
          </Modal>
        */}

        {/*
          <Modal
            opened={showTimeLogForm}
            onClose={() => setShowTimeLogForm(false)}
            title="Time Log"
            centered
            size='auto'
          >
            <TimeLogForm student={selectedStudent} onSave={handleSave} onCancel={() => setShowTimeLogForm(false)} />
          </Modal>
        */}
        </Box>
      </ModalsProvider>
      </Container>
  )
}

export default Dashboard;