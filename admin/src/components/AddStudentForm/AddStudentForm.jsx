import React, { useState } from 'react';
import { TextInput, Button, Card, Box, Text, Paper, Grid, Title, Group, Stack, Divider } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { randomId } from '@mantine/hooks';
import { URL } from '../../constants';

const studentExists = async (studentId) => {
    let response = null;
    let json = null;
    try {
        response = await fetch(`${URL}/api/student?studentId=${studentId}`);
    } catch (respErr) {
        console.log("response error", respErr);
    }
    try {
        json = await response.json();
    } catch (jsonErr) {
        console.log("json error", jsonErr);
    }
    return (json == null ? false : true);
}

const AddStudentForm = ({ onSubmit, onCancel }) => {

    const handleAddClass = () => {
        const newClass = {
            className: '',
            section: '',
            professor: ''
        };
        form.insertListItem('classes', newClass);
    };

    const handleSubmit = () => {
        studentExists(form.values.studentId)
            .then((duplicateStudent) => {
                if (!duplicateStudent) {
                    console.log("New student ready to add!");
                    const transformedClasses = form.values.classes.map((classItem) => {
                        return `${classItem.className}-${classItem.section}-${classItem.professor}`;
                    });
                    const newStudent = {
                        studentName: form.values.name,
                        studentId: form.values.studentId,
                        classes: transformedClasses
                    };
                    onSubmit(newStudent);
                } else {
                    window.alert(`Sorry student ID: ${form.values.studentId} already exists!`);
                }
            });
    };

    const form = useForm({
        initialValues: {
            name: '',
            studentId: '',
            classes: [{ className: '', section: '', professor: '' }]
        },
        validate: {
            name: (value) => (value.length < 2 ? 'Name must have at least 2 letters' : null),
            studentId: (value) => (value.length < 9 ? 'Student ID must have at least 9 digits' : null),
            classes: {
                className: (value) => /\b[A-Z]+ \d+\b/.test(value) ? null : 'Class name must be in the format ABC 1234',
                section: (value) => /^\d{2}$/.test(value) ? null : 'Section must be a 2-digit number',
                professor: (value) => /^[A-Za-z]+(?:-[A-Za-z]+)?$/.test(value) ? null : 'Professor name must be in the format First-Last or First-Last-Last'
            }
        },
    });

    const classes = form.values.classes.map((classItem, index) => {
        return (
            <Card withBorder shadow="sm" p="md" mb="md" key={index}>
                <Grid>
                    <Grid.Col span={4}>
                        <TextInput
                            label="Class Name"
                            {...form.getInputProps(`classes.${index}.className`)}
                        />
                    </Grid.Col>
                    <Grid.Col span={4}>
                        <TextInput
                            label="Class Section"
                            {...form.getInputProps(`classes.${index}.section`)}
                        />
                    </Grid.Col>
                    <Grid.Col span={4}>
                        <TextInput
                            label="Professor"
                            {...form.getInputProps(`classes.${index}.professor`)}
                        />
                    </Grid.Col>
                    <Grid.Col span={12} style={{ alignItems: 'end', display: 'flex' }}>
                        <Button style={{ alignSelf: 'center' }} color="red" onClick={() => form.removeListItem('classes', index)}><IconTrash /></Button>
                    </Grid.Col>
                </Grid>
            </Card>
        );
    });

    return (
        <Paper padding="md">
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack spacing="md">
                    <TextInput
                        label="Name"
                        placeholder="Enter student's name"
                        name="name"
                        required
                        {...form.getInputProps('name')}
                    />
                    <TextInput
                        label="Student ID"
                        placeholder="Enter student's ID"
                        name="studentId"
                        required
                        {...form.getInputProps('studentId')}
                    />
                </Stack>
                <Box>
                    <Title order={4} mt="md" mb="sm">Classes</Title>
                    {classes.length ? classes : <Text>No classes added</Text>}
                </Box>
                <Group position="right" mt="md" justify='space-between'>
                    <Button type="button" color="green" variant="filled" autoContrast onClick={handleAddClass}>Add Class</Button>
                    <Box>
                        <Button type="submit" color="blue" variant="filled" autoContrast mr={"sm"}>Add Student</Button>
                        <Button type="button" color="black" variant="default" autoContrast onClick={onCancel}>Cancel</Button>
                    </Box>
                </Group>
            </form>
        </Paper>
    );
};

export default AddStudentForm;