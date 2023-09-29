import { useState } from 'react';

function EditStudentForm({ student, onSave, onCancel }) {
    const [name, setName] = useState(student.studentName);
    const [studentId, setStudentId] = useState(student.studentId);
    const [classes, setClasses] = useState(student.classes);

    const handleClassChange = (index, value) => {
        const newClasses = [...classes];
        newClasses[index] = value;
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
        event.preventDefault();
        const updatedStudent = { ...student, studentName: name, studentId, classes };
        onSave(updatedStudent);
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
                    {classes.map((classItem, index) => (
                        <div key={index}>
                            <input type="text" value={classItem} onChange={(event) => handleClassChange(index, event.target.value)} />
                            <button type="button" onClick={() => handleRemoveClass(index)}>Remove</button>
                        </div>
                    ))}
                    <button type="button" onClick={handleAddClass}>Add Class</button>
                </label>
                <button type="submit">Save</button>
                <button type="button" onClick={onCancel}>Cancel</button>
            </form>
        </div>
    );
}

export default EditStudentForm;