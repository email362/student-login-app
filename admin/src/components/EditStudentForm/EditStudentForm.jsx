import { useState, Fragment } from 'react';
import { TextInput, Text, Button, Title, Box, Group, Stack, Paper, Card, Grid, Divider, ActionIcon, Checkbox } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { randomId } from '@mantine/hooks';


function getClassName(classItem) {
    try {
        let classRegex = /\b[A-Z]+ \d+\b/;
        if (classItem.match(classRegex) == null) {
            return '';
        }
        let className = classItem.match(classRegex)[0];
        // console.log({ class: classItem, className });
        return className;
    } catch (error) {
        console.log("class name error:", error);
        return '';
    }
}

function getClassSection(classItem) {
    try {
        let sectionRegex = /-\d{2}-/;
        if (classItem.match(sectionRegex) == null) {
            return '';
        }
        let section = classItem.match(sectionRegex)[0].replace(/-/g, '');
        // console.log({ class: classItem, section });
        return section;
    } catch (error) {
        console.log("class section error:", error);
        return '';
    }
}

function getProfessor(classItem) {
    try {
        let nameRegex = /[A-Za-z]+(?:-[A-Za-z]+)?$/;
        if (classItem.match(nameRegex) == null) {
            return '';
        }
        let professor = classItem.match(nameRegex)[0];
        // console.log({ class: classItem, professor });
        return professor;
    } catch (error) {
        console.log("class name error:", error);
        return '';
    }
}

function EditStudentForm({ student, onSave, onCancel }) {
    // (() => {
    // getProfessor('CSE 1100-01-Gonzales-Rios');
    // getClassName('CSE 1100-01-Professor');
    // getClassSection('CSE 1100-01-Professor');
    // })();

    const handleAddClass = () => {
        const newClass = {
            className: '',
            section: '',
            professor: ''
        };
        form.insertListItem('classes', newClass);
        // console.log(form.values.classes);
    };

    const handleSubmit = () => {
        // console.log("edit student saved!");
        // console.log("original student:", student);
        // console.log("pre-transformation", form.values.classes);
        const transformedClasses = form.values.classes.map((classItem) => {
            return `${classItem.className}-${classItem.section}-${classItem.professor}`;
        });
        // console.log("post-transformation", transformedClasses);
        const updatedStudent = { ...student, studentName: form.values.name, studentId: form.values.studentId, classes: transformedClasses };
        // console.log("updated student:", updatedStudent);
        onSave(updatedStudent);
    };

    const formattedClasses = student.classes.map((classItem) => {
        return {
            className: getClassName(classItem),
            section: getClassSection(classItem),
            professor: getProfessor(classItem)
        };
    });


    const form = useForm({
        initialValues: {
            name: student.studentName,
            studentId: student.studentId,
            classes: formattedClasses
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
        // const className = getClassName(classItem);
        // const section = getClassSection(classItem);
        // const professor = getProfessor(classItem);

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
                        {...form.getInputProps('name')}
                    />
                    <TextInput
                        label="Student ID"
                        {...form.getInputProps('studentId')}
                        readOnly
                    />
                </Stack>
                <Box>
                    <Title order={4}>Classes</Title>
                    {classes.length ? classes : <Text>No classes added</Text>}
                </Box>
                <Group position="right" mt="md" justify="space-between">
                    <Button type="button" color="green" variant="filled" autoContrast onClick={handleAddClass}>Add Class</Button>
                    <Box>
                        <Button type="submit" color="blue" variant="filled" autoContrast mr={"sm"}>Save</Button>
                        <Button type="button" color="black" variant="default" autoContrast onClick={onCancel}>Cancel</Button>
                    </Box>
                </Group>
            </form>
        </Paper>
    )
}

export default EditStudentForm;