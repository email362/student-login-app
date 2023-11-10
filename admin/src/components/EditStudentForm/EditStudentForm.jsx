import { useState } from 'react';

function EditStudentForm({ student, onSave, onCancel }) {
    const [name, setName] = useState(student.studentName);
    const [studentId, setStudentId] = useState(student.studentId);
    const [classes, setClasses] = useState(student.classes);

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
        onSave(updatedStudent);
    };

    const splitClass = (classItem) => {
        return classItem.split('-');
    };

    return (
        <div>
            <h2>Edit Student</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Name:
                    <input type="text" value={name} onChange={(event) => setName(event.target.value)} />
                </label>
                <label>
                    Student ID:
                    <input type="text" value={studentId} onChange={(event) => setStudentId(event.target.value)} />
                </label>
                <label>
                    Classes:
                    {classes.map((classItem, index) => {
                        const [className, classSection, professor] = splitClass(classItem);
                        return (
                            <div key={index} style={{display:"flex", alignItems: 'center', marginBottom: '10px'}}>
                                <label>Class Name:</label>
                                <input
                                    type="text"
                                    value={className}
                                    onChange={(event) => handleClassChange(index, 0, event.target.value)}
                                    style={{ marginRight: '5px' }}
                                />
                                <label>Class Section:</label>
                                <input
                                    type="text"
                                    value={classSection}
                                    onChange={(event) => handleClassChange(index, 1, event.target.value)}
                                    style={{ marginRight: '5px' }}
                                />
                                <label>Professor:</label>
                                <input
                                    type="text"
                                    value={professor}
                                    onChange={(event) => handleClassChange(index, 2, event.target.value)}
                                    style={{ marginRight: '5px' }}
                                />
                                <button type="button" onClick={() => handleRemoveClass(index)}>Remove</button>
                            </div>
                        );
                    })}
                    <button type="button" onClick={handleAddClass}>Add Class</button>
                </label>
                <button type="submit">Save</button>
                <button type="button" onClick={onCancel}>Cancel</button>
            </form>
        </div>
    );
}

export default EditStudentForm;