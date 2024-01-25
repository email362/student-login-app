import { useState, Fragment } from 'react';
import { TextInput, Button, Title, Box, Group, Stack, Paper, Card, Grid, Divider, ActionIcon } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';

function EditStudentForm({ student, onSave, onCancel }) {
    const [name, setName] = useState(student.studentName);
    const [studentId, setStudentId] = useState(student.studentId);
    const [classes, setClasses] = useState(student.classes);

    const handleClassChange = (index, part, value) => {
        const newClasses = classes.map((classItem, i) => {
            if (index === i) {
                let parts = classItem.split('-');
                if(parts.length > 3) {
                    parts = parts.slice(0, 3);
                }
                console.log({
                    classes,
                    index,
                    part,
                    value,
                    parts
                });
                // Make sure the array has three parts, filling in with empty strings if necessary
                while (parts.length < 3) {
                    parts.push('');
                }
                parts[part] = value; // Update the specific part (0 for name, 1 for section, 2 for professor)
                console.log('new parts', parts);
                return parts.join('-'); // Rejoin the parts into a single string
            }
            return classItem;
        });
        console.log(newClasses);
        setClasses(newClasses);
    };

    const handleAddClass = () => {
        setClasses([...classes, '--']); // Initialize with three empty parts separated by '-'
    };

    const handleRemoveClass = (index) => {
        const newClasses = [...classes];
        newClasses.splice(index, 1);
        setClasses(newClasses);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const removeEmptyClasses = classes.filter((cls) => cls !== '');
        const updatedStudent = { ...student, studentName: name, studentId, classes: removeEmptyClasses };
        console.log(updatedStudent);
        onSave(updatedStudent);
    };

    const splitClass = (classItem) => {
        return classItem.split('-');
    };

    return (
        <Paper padding="md">
            {/* <Title order={2}>Edit Student</Title> */}
            <form onSubmit={handleSubmit}>
                <Stack spacing="md">
                    <TextInput
                        label="Name"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                    />
                    <TextInput
                        label="Student ID"
                        value={studentId}
                        onChange={(event) => setStudentId(event.target.value)}
                    />

                    <Box>
                        <Title order={4}>Classes</Title>
                        {classes.map((classItem, index) => {
                            const [className, classSection, professor] = splitClass(classItem);
                            return (
                                <Fragment key={index}>
                                    <Card withBorder shadow="sm" p="md" mb="md">
                                        <Grid>
                                            <Grid.Col span={4}>
                                                <TextInput
                                                    label="Class Name"
                                                    value={className}
                                                    onChange={(event) => handleClassChange(index, 0, event.target.value)}
                                                />
                                            </Grid.Col>
                                            <Grid.Col span={4}>
                                                <TextInput
                                                    label="Class Section"
                                                    value={classSection}
                                                    onChange={(event) => handleClassChange(index, 1, event.target.value)}
                                                />
                                            </Grid.Col>
                                            <Grid.Col span={4}>
                                                <TextInput
                                                    label="Professor"
                                                    value={professor}
                                                    onChange={(event) => handleClassChange(index, 2, event.target.value)}
                                                />
                                            </Grid.Col>
                                            <Grid.Col span={12} style={{alignItems:'end', display:'flex'}}>
                                                <Button style={{alignSelf:'center'}} color="red" onClick={() => handleRemoveClass(index)}><IconTrash /></Button>
                                            </Grid.Col>
                                        </Grid>
                                    </Card>
                                    {index < classes.length - 1 && <Divider my="sm" />}
                                </Fragment>
                            );
                        })}
                        <Button type="button" onClick={handleAddClass} color="green" variant="filled" autoContrast>Add Class</Button>
                    </Box>
                    <Group position="right" mt="md">
                        <Button type="submit" color="blue" variant="filled" autoContrast>Save</Button>
                        <Button type="button" color="black" variant="default" autoContrast onClick={onCancel}>Cancel</Button>
                    </Group>
                </Stack>
            </form>
        </Paper>
    );
}

export default EditStudentForm;