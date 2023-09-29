import React, { useState } from 'react';

const AddStudentForm = ({ onSubmit, onCancel }) => {
  const [classes, setClasses] = useState(['']);

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
    onSubmit({
      name: event.target.name.value,
      studentId: event.target.studentId.value,
      classes: classes.filter((c) => c !== ''),
    });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" name="name" />
        </label>
        <label>
          Student ID:
          <input type="text" name="studentId" />
        </label>
        {classes.map((c, i) => (
          <div key={i}>
            <label>
              Class {i + 1}:
              <input
                type="text"
                value={c}
                onChange={(e) => handleClassChange(i, e.target.value)}
              />
            </label>
            <button type="button" onClick={() => handleRemoveClass(i)}>
              Remove Class
            </button>
          </div>
        ))}
        <button type="button" onClick={handleAddClass}>
          Add Class
        </button>
        <button type="submit">Add Student</button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default AddStudentForm;