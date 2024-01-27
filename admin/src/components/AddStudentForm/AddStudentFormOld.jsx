import React, { useState } from 'react';
import { TextInput, Button, Box, Paper, Grid, Title, Group, Divider } from '@mantine/core';

const AddStudentForm = ({ onSubmit, onCancel }) => {
  const [classes, setClasses] = useState(['']);

  const handleClassChange = (index, part, value) => {
    const newClasses = classes.map((classItem, i) => {
        if (index === i) {
            let parts = classItem.split('-');
            // Make sure the array has three parts, filling in with empty strings if necessary
            while (parts.length < 3) {
                parts.push('');
            }
            parts[part] = value; // Update the specific part (0 for name, 1 for section, 2 for professor)
            return parts.join('-'); // Rejoin the parts into a single string
        }
        return classItem;
    });
    console.log(newClasses);
    setClasses(newClasses);
  };

  const handleAddClass = () => {
    setClasses([...classes, '']);
  };

  const handleRemoveClass = (index) => {
    const newClasses = [...classes];
    newClasses.splice(index, 1);
    setClasses(newClasses);
  };

  const handleSubmit = (event) => {
    console.log('submitting');
    event.preventDefault();
    console.log(event.target.name.value);
    console.log(event.target.studentId.value);
    onSubmit({
      studentName: event.target.name.value,
      studentId: event.target.studentId.value,
      classes: classes.filter((c) => c !== ''),
    });
  };

  const splitClass = (classItem) => {
    let parts = classItem.split('-');
    while (parts.length < 3) {
      parts.push('');
    }
    return parts;
  };

  return (
    <Paper padding="md" withBorder>
      <form onSubmit={handleSubmit}>
        {/* <Title order={3} mb="md">Add Student</Title> */}
        <Grid>
          <Grid.Col span={6}>
            <TextInput
              label="Name"
              placeholder="Enter student's name"
              name="name"
              required
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <TextInput
              label="Student ID"
              placeholder="Enter student's ID"
              name="studentId"
              required
            />
          </Grid.Col>
        </Grid>

        <Title order={4} mt="md" mb="sm">Classes</Title>
        {classes.map((c, i) => {
          const [className, classSection, professor] = splitClass(c);
          return (
            <Box key={i} mb="sm">
              <Grid>
                <Grid.Col span={4}>
                  <TextInput
                    label="Class Name"
                    value={className}
                    onChange={(e) => handleClassChange(i, 0, e.target.value)}
                    required
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <TextInput
                    label="Class Section"
                    value={classSection}
                    onChange={(e) => handleClassChange(i, 1, e.target.value)}
                    required
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <TextInput
                    label="Professor"
                    value={professor}
                    onChange={(e) => handleClassChange(i, 2, e.target.value)}
                    required
                  />
                </Grid.Col>
              </Grid>
              <Group position="right" mt="md">
                <Button type="button" color="red" onClick={() => handleRemoveClass(i)}>
                  Remove Class
                </Button>
              </Group>
              {i < classes.length - 1 && <Divider />}
            </Box>
          );
        })}
        <Group position="right" mt="md">
          <Button type="button" onClick={handleAddClass}>
            Add Class
          </Button>
        </Group>

        <Group position="right" mt="md">
          <Button type="submit">Add Student</Button>
          <Button type="button" variant="default" onClick={onCancel}>
            Cancel
          </Button>
        </Group>
      </form>
    </Paper>
  );
};

export default AddStudentForm;