import { useEffect, useState } from 'react'
import EditStudentForm from '../EditStudentForm/EditStudentForm';
import AddStudentForm from '../AddStudentForm/AddStudentForm';
import TimeLogForm from '../TimeLogForm/TimeLogForm';
import { Table, Button, Title, Box, Modal, Group, Text, MantineProvider, Container, TextInput } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { modals, ModalsProvider } from '@mantine/modals';
import { URL } from '../../constants';
import { IconTrash, IconSearch } from '@tabler/icons-react';
import './Dashboard.css'


function Dashboard() {

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [showAddStudentForm, setShowAddStudentForm] = useState(false);
  const [showEditStudentForm, setShowEditStudentForm] = useState(false);
  const [showTimeLogForm, setShowTimeLogForm] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchVal, setSearchVal] = useState('');
  const [debounced] = useDebouncedValue(searchVal, 200);

  useEffect(() => {
    fetch(`${URL}/api/students`)
      .then(response => response.json())
      .then(data => {
        if (import.meta.env.MODE === 'development') console.log('data', data);
        setData(data)
      })
  }, []);

  const handleEdit = (index) => {
    setSelectedStudent(filteredData[index]);
    setShowEditStudentForm(true);
  };

  const handleTimeLog = (index) => {
    setSelectedStudent(filteredData[index]);
    setShowTimeLogForm(true);
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
    const studentId = filteredData[index].studentId;
    const newData = data.filter(student => student.studentId !== studentId);
    // delete the student from the server
    fetch(`${URL}/api/students/${studentId}`, {
      method: 'DELETE'
    })
      .then(response => response.json())
      .then(data => {
        console.log('success', studentId)
        setData(newData);
      })
      .catch(error => {
        console.log(error)
        alert('Failed to delete student');
      })
  };

  const handleAddStudent = () => {
    setShowAddStudentForm(true);
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
        if (res.status === "Success") {
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
  
  const handleSearch = () => {
    if (debounced) {
      setFilteredData(data.filter(student => student.studentName.toLowerCase().includes(debounced.toLowerCase()) || student.studentId.toLowerCase().includes(debounced.toLowerCase())));
    } else {
      setFilteredData(data);
    }
  }

  useEffect(() => {
    handleSearch();
  }, [debounced, data]);

  return (
    <Container size='xl'>
      <ModalsProvider>
        <Box sx={{ padding: '20px' }}>
          <Title order={1}>MLC Admin Home</Title>
          {!showAddStudentForm && !showEditStudentForm && !showTimeLogForm && (
            <Box>
              <Box display={"flex"} justify="flex-start">
                <Button onClick={handleAddStudent} color="green" variant="filled" style={{}} className='btn-view-log' autoContrast>Add Student</Button>
                <TextInput
                  placeholder="Search"
                  size="sm"
                  leftSection={<IconSearch />}
                  styles={{ section: { pointerEvents: 'none' } }}
                  mb="sm"
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                />
              </Box>
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
                  {filteredData.map((item, index) => {
                    const { studentName, studentId, classes, loginTimestamps } = item;
                    let timePerClassMap = new Map();
                    loginTimestamps.forEach((timestamp) => {
                      // console.log('timestamp', timestamp);
                      if (timePerClassMap.has(timestamp.className)) {
                        timePerClassMap.set(timestamp.className, timePerClassMap.get(timestamp.className) + timestamp.totalTime);
                      } else {
                        timePerClassMap.set(timestamp.className, timestamp.totalTime);
                      }
                    });
                    const formattedTimePerClass = Array.from(timePerClassMap).map(([className, totalTime]) => {
                      return `${className}: ${(totalTime / 3600).toFixed(2)}`;
                    });
                    return (
                      <tr key={studentId}>
                        <td>{studentName}</td>
                        <td>{studentId}</td>
                        <td>{classes.join(", ")}</td>
                        {/*<td>{((loginTimestamps.reduce((acc, curr) => curr.totalTime + acc, 0) / 3600)).toFixed(2)}</td>*/}
                        <td>{formattedTimePerClass.length ? formattedTimePerClass.join(", ") : "No Time Logged"}</td>
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