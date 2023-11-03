import React, { useState } from 'react';
import './TimeLogForm.css';

/**
 * Converts a date object to an input date string (YYYY-MM-DD).
 *
 * @param {Date} date - The date object to convert.
 * @returns {string} The input date string.
 */
function convertToInputDate(date) {
    const dateObj = new Date(date);
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1;
    const day = dateObj.getDate();
    return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
}

/**
 * Converts a date object to a string in the format of 'hh:mm:ss'.
 * @param {Date} date - The date object to convert.
 * @returns {string} The formatted time string.
 */
function convertToInputTime(date) {
    const dateObj = new Date(date);
    const hours = dateObj.getHours();
    const minutes = dateObj.getMinutes();
    const seconds = dateObj.getSeconds();
    return `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
}

/**
 * Converts seconds to hours, minutes, and seconds format.
 * @param {number} seconds - The total number of seconds to be converted.
 * @returns {string} The formatted time string in the format of "hh:mm:ss".
 */
function secondsToHoursMinutesSeconds(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds - (hours * 3600)) / 60);
    const secondsLeft = Math.round(seconds - (hours * 3600) - (minutes * 60));
    return `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${secondsLeft < 10 ? '0' + secondsLeft : secondsLeft}`;
}

/**
 * Converts hours, minutes, and seconds to total seconds.
 *
 * @param {number} hours - The number of hours.
 * @param {number} minutes - The number of minutes.
 * @param {number} seconds - The number of seconds.
 * @returns {number} The total number of seconds.
 */
function hoursMinutesSecondsToSeconds(hours, minutes, seconds) {
    return (Number(hours) * 3600) + (Number(minutes) * 60) + Number(seconds);
}

/**
 * Parses a string in the format "hours:minutes:seconds" into an object with separate properties for hours, minutes, and seconds.
 * @param {string} hoursMinutesSeconds - The string to parse.
 * @returns {{hours: string, minutes: string, seconds: string}} - An object with separate properties for hours, minutes, and seconds.
 */
function parseHoursMinutesSeconds(hoursMinutesSeconds) {
    const [hours, minutes, seconds] = hoursMinutesSeconds.split(':');
    return { hours, minutes, seconds };
}

/**
 * Creates a new Date object from a date and time string.
 * @param {string} date - The date string in the format "YYYY-MM-DD".
 * @param {string} time - The time string in the format "HH:MM:SS".
 * @returns {Date} A new Date object representing the given date and time.
 */
function createDateTime(date, time) {
    const [year, month, day] = date.split('-');
    const [hours, minutes, seconds] = time.split(':').length === 2 ? [...time.split(':'), '00'] : time.split(':');
    return new Date(year, month - 1, day, hours, minutes, seconds);
}

/**
 * Calculates the total time between a login and logout time.
 * @param {Object} loginTime - The login time object containing date and time properties.
 * @param {Object} logoutTime - The logout time object containing date and time properties.
 * @returns {number} - The total time in seconds.
 */
function getTotalTime(loginTime, logoutTime) { 
    const loginDateTime = createDateTime(loginTime.date, loginTime.time);
    const logoutDateTime = createDateTime(logoutTime.date, logoutTime.time);
    const totalTime = logoutDateTime - loginDateTime;
    // console.log(totalTime);
    return totalTime/1000;
}

/**
 * A form component for logging time stamps of a student.
 * @param {Object} props - The component props.
 * @param {Object} props.student - The student object.
 * @param {Function} props.onSave - The function to save the time log.
 * @param {Function} props.onCancel - The function to cancel the time log.
 * @returns {JSX.Element} - The TimeLogForm component.
 */
function TimeLogForm({ student, onSave, onCancel }) {
    const [timeStamps, setTimeStamps] = useState(student.loginTimestamps);
    // console.log(timeStamps);

    /**
     * Removes a time log from the list of time stamps.
     * @param {number} index - The index of the time log to remove.
     */
    const handleRemoveTimeLog = (index) => {
        const newTimeStamps = [...timeStamps];
        newTimeStamps.splice(index, 1);
        setTimeStamps(newTimeStamps);
        // console.log(newTimeStamps);
    };

    /**
     * Handles the change event of the class select input.
     * @param {Object} event - The event object.
     */
    const handleClassChange = (event) => {
        const updatedClass = event.target.value;
        // rest of the function code
    };

    /**
     * Handles changes to the time stamp inputs and calculates the total time.
     * @param {Event} event - The event object.
     */
    const handleTimeStampChange = (event) => {
        const parentDiv = event.target.parentNode.parentNode;
        // const id = parentDiv.getAttribute('data-id');
        // console.log(event.target.value);
        // console.log(event.target.className);
        let loginObj = {
            date: event.target.className === 'login-date-value' ? event.target.value : String(parentDiv.querySelector('label input.login-date-value').value),
            time: event.target.className === 'login-time-value' ? event.target.value : String(parentDiv.querySelector('label input.login-time-value').value),
        };
        let logoutObj = {
            date: event.target.className === 'logout-date-value' ? event.target.value : String(parentDiv.querySelector('label input.logout-date-value').value),
            time: event.target.className === 'logout-time-value' ? event.target.value : String(parentDiv.querySelector('label input.logout-time-value').value)
        };

        const totalTime = getTotalTime(loginObj, logoutObj);
        const formattedTotalTime = secondsToHoursMinutesSeconds(totalTime);
        parentDiv.querySelector('label input.total-time-value').value = formattedTotalTime;
    };

    /**
     * Handles the form submission for the TimeLogForm component.
     * @param {Event} event - The form submission event.
     */
    const handleSubmit = (event) => {
        event.preventDefault();
        const docs = document.querySelectorAll('div[data-id]');
        let updatedTimeStamps = [];
        docs.forEach((doc) => {
            // const id = doc.getAttribute('data-id');
            const className = doc.querySelector('select.class-value').value;
            const loginTime = doc.querySelector('input.login-time-value').value;
            const loginDate = doc.querySelector('input.login-date-value').value;
            const logoutTime = doc.querySelector('input.logout-time-value').value;
            const logoutDate = doc.querySelector('input.logout-date-value').value;
            const totalTime = doc.querySelector('input.total-time-value').value;

            const { hours, minutes, seconds } = parseHoursMinutesSeconds(totalTime);
            const newTotalTime = hoursMinutesSecondsToSeconds(hours, minutes, seconds);
            const loginUnixTime = createDateTime(loginDate, loginTime).getTime();
            const logoutUnixTime = createDateTime(logoutDate, logoutTime).getTime();

            const updatedTimeLog = {
                className,
                loginTime: loginUnixTime,
                logoutTime: logoutUnixTime,
                totalTime: newTotalTime
            };

            // console.log(updatedTimeLog);
            updatedTimeStamps.push(updatedTimeLog);

        });
        setTimeStamps(updatedTimeStamps);
        const updatedStudent = { ...student, loginTimestamps: updatedTimeStamps };
        // console.log(JSON.stringify(updatedStudent));
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
                            <select className="class-value" defaultValue={timeLog.className}>
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
                            <input type='date' className="login-date-value" defaultValue={convertToInputDate(timeLog.loginTime)} onChange={handleTimeStampChange} />
                            <input type='time' className="login-time-value" defaultValue={convertToInputTime(timeLog.loginTime)} onChange={handleTimeStampChange} />
                        </label>
                        <label>
                            Logout:
                            <input type='date' className="logout-date-value" defaultValue={convertToInputDate(timeLog.logoutTime)} onChange={handleTimeStampChange} />
                            <input type='time' className="logout-time-value" defaultValue={convertToInputTime(timeLog.logoutTime)} onChange={handleTimeStampChange} />
                        </label>
                        <label>
                            Total Time:
                            <input type="text" readOnly className="total-time-value" defaultValue={secondsToHoursMinutesSeconds(timeLog.totalTime)} />
                        </label>
                        <button type="button" onClick={() => handleRemoveTimeLog(index)}>Delete</button>
                    </div>
                ))}
                <button type="button" onClick={() => setTimeStamps([...timeStamps, { className: '', loginTime: 0, logoutTime: 0, totalTime: 0 }])}>Add Time Log</button>
                <button type="submit">Save</button>
                <button type="button" onClick={onCancel}>Cancel</button>    
            </form>
        </div>
    );
}

export default TimeLogForm;