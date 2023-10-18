import React, { useState } from 'react';
import './TimeLogForm.css';

function TimeLogForm({ student, onSave, onCancel }) {
    const [timeStamps, setTimeStamps] = useState(student.loginTimestamps);
    // const [timeIn, setTimeIn] = useState(student.timeIn);
    // const [timeOut, setTimeOut] = useState(student.timeOut);
    // const [hours, setHours] = useState(student.hours);

    // const handleDateChange = (index, value) => {
    //     const newDate = [...date];
    //     newDate[index] = value;
    //     setDate(newDate);
    // };

    // const handleTimeInChange = (index, value) => {
    //     const newTimeIn = [...timeIn];
    //     newTimeIn[index] = value;
    //     setTimeIn(newTimeIn);
    // };

    // const handleTimeOutChange = (index, value) => {
    //     const newTimeOut = [...timeOut];
    //     newTimeOut[index] = value;
    //     setTimeOut(newTimeOut);
    // };

    // const handleHoursChange = (index, value) => {
    //     const newHours = [...hours];
    //     newHours[index] = value;
    //     setHours(newHours);
    // };



    // const handleRemoveTimeLog = (index) => {
    //     const newDate = [...date];
    //     const newTimeIn = [...timeIn];
    //     const newTimeOut = [...timeOut];
    //     const newHours = [...hours];
    //     newDate.splice(index, 1);
    //     newTimeIn.splice(index, 1);
    //     newTimeOut.splice(index, 1);
    //     newHours.splice(index, 1);
    //     setDate(newDate);
    //     setTimeIn(newTimeIn);
    //     setTimeOut(newTimeOut);
    //     setHours(newHours);
    // };

    // const handleSubmit = (event) => {
    //     event.preventDefault();
    //     const updatedStudent = { ...student, date, timeIn, timeOut, hours };
    //     onSave(updatedStudent);
    // };

    const handleRemoveTimeLog = (index) => {
        const newTimeStamps = [...timeStamps];
        newTimeStamps.splice(index, 1);
        setTimeStamps(newTimeStamps);
        console.log(newTimeStamps);
    };

    const handleClassChange = (event) => {
        const updatedClass = event.target.value;
        
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const docs = document.querySelectorAll('div[data-id]');
        let updatedTimeStamps = [];
        docs.forEach((doc) => {
            const id = doc.getAttribute('data-id');
            const className = doc.querySelector('select.class-value').value;
            const loginTime = Number(doc.querySelector('input.login-time-value').value);
            const logoutTime = Number(doc.querySelector('input.logout-time-value').value);
            const totalTime = Number(doc.querySelector('input.total-time-value').value);
            updatedTimeStamps.push({ className, loginTime, logoutTime, totalTime });
        });
        setTimeStamps(updatedTimeStamps);
        const updatedStudent = { ...student, loginTimestamps: updatedTimeStamps };
        console.log(JSON.stringify(updatedStudent));
        onSave(updatedStudent);
    };

    return (
        <div>
            <h2>Time Log</h2>
            <h4>{student.studentName}</h4>

            <form onSubmit={handleSubmit}>
                {timeStamps.map((timeLog, index) => (
                    <div key={timeLog._id || Date.now() + "" + student.studentId} data-id={timeLog._id || Date.now() + "" + student.studentId} className='timelog-entry'>
                        <label>
                            Class:
                            <select className="class-value" defaultValue={JSON.stringify(timeLog.className)}>
                                {student.classes.length > 0 && (student.classes.map((classItem, index) => (
                                    <option key={index} value={classItem}>
                                        {classItem}
                                    </option>
                                )))}
                                {student.classes.length === 0 && (<option value={timeLog.className}>{timeLog.className}</option>)}
                            </select>
                        </label>
                        <label>
                            Login:
                            <input type="number" className="login-time-value" defaultValue={timeLog.loginTime} />
                        </label>
                        <label>
                            Logout:
                            <input type="number" className="logout-time-value" defaultValue={timeLog.logoutTime} />
                        </label>
                        <label>
                            Total Time:
                            <input type="number" className="total-time-value" defaultValue={timeLog.totalTime} />
                        </label>
                        <button type="button" onClick={() => handleRemoveTimeLog(index)}>Delete</button>
                    </div>
                ))}
                <button type="button" onClick={() => setTimeStamps([...timeStamps, { className: '', loginTime: 0, logoutTime: 0, totalTime: 0 }])}>Add Time Log</button>
                <button type="submit">Save</button>
                <button type="button" onClick={onCancel}>Cancel</button>    
            </form>
            {/* {student.loginTimestamps.map((timeLog, index) => (
                <div key={index} className='timelog-row'>
                    <p>Class: {timeLog.className}</p>
                    <p>Login: {timeLog.loginTime}</p>
                    <p>Logout: {timeLog.logoutTime}</p>
                    <p>Total Time: {timeLog.totalTime} seconds</p>
                </div>)
            )}
            <button type="button" onClick={onCancel}>Cancel</button> */}
        </div>
    );
}

export default TimeLogForm;