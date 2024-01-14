import { useEffect, useState } from 'react'
import './Dashboard.css'
import EditStudentForm from '../EditStudentForm/EditStudentForm';
import AddStudentForm from '../AddStudentForm/AddStudentForm';
import TimeLogForm from '../TimeLogForm/TimeLogForm';
import { Table, Button, Title, Box, Modal, Group, Text, MantineProvider, Container } from '@mantine/core';
import { modals, ModalsProvider } from '@mantine/modals';


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
      confirmProps: { color: 'red' },
      onCancel: () => console.log('canceled'),
      onConfirm: () => handleDelete(index),
    });

  // const openDeleteModal = () =>
  //   modals.openConfirmModal({
  //     title: 'Delete your profile',
  //     centered: true,
  //     labels: { confirm: 'Delete account', cancel: "No don't delete it" },
  //     confirmProps: { color: 'red' },
  //     onCancel: () => console.log('Cancel'),
  //     onConfirm: () => console.log('Confirmed'),
  //   });

  return (
    <Container size='xl'>
      <ModalsProvider>
        <Box sx={{ padding: '20px' }}>
          <Title order={1}>MLC Admin Home</Title>
          {!showAddStudentForm && !showEditStudentForm && !showTimeLogForm && (
            <Box>
              <Button onClick={handleAddStudent} className='btn-view-log'>Add Student</Button>
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
                            <Button onClick={() => handleTimeLog(index)} className='btn-view-log'>Time Log</Button>
                            <Button onClick={() => handleEdit(index)} className='btn-edit'>Edit</Button>
                            {/* <Button onClick={() => handleDelete(index)}>Delete</Button> */}
                            <Button onClick={() => openDeleteModal(index)} className='btn-delete'>Delete</Button>
                          </Group>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </Box>
          )}
          {showTimeLogForm && (<TimeLogForm student={selectedStudent} onSave={handleSave} onCancel={() => setShowTimeLogForm(false)} />)}
          {showEditStudentForm && (<EditStudentForm student={selectedStudent} onSave={handleSave} onCancel={() => setShowEditStudentForm(false)} />)}
          {showAddStudentForm && (<AddStudentForm onSubmit={handleAddStudentSubmit} onCancel={handleCancelAddStudent} />)}

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