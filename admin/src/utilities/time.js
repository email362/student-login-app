/**
 * Converts a date object to an input date string (YYYY-MM-DD).
 *
 * @param {Date} date - The date object to convert.
 * @returns {string} The input date string.
 */
export function convertToInputDate(date) {
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
export function convertToInputTime(date) {
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
export function secondsToHoursMinutesSeconds(seconds) {
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
export function hoursMinutesSecondsToSeconds(hours, minutes, seconds) {
    return (Number(hours) * 3600) + (Number(minutes) * 60) + Number(seconds);
}

/**
 * Parses a string in the format "hours:minutes:seconds" into an object with separate properties for hours, minutes, and seconds.
 * @param {string} hoursMinutesSeconds - The string to parse.
 * @returns {{hours: string, minutes: string, seconds: string}} - An object with separate properties for hours, minutes, and seconds.
 */
export function parseHoursMinutesSeconds(hoursMinutesSeconds) {
    const [hours, minutes, seconds] = hoursMinutesSeconds.split(':');
    return { hours, minutes, seconds };
}

/**
 * Creates a new Date object from a date and time string.
 * @param {string} date - The date string in the format "YYYY-MM-DD".
 * @param {string} time - The time string in the format "HH:MM:SS".
 * @returns {Date} A new Date object representing the given date and time.
 */
export function createDateTime(date, time) {
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
export function getTotalTime(loginTime, logoutTime) { 
    const loginDateTime = createDateTime(loginTime.date, loginTime.time);
    const logoutDateTime = createDateTime(logoutTime.date, logoutTime.time);
    const totalTime = logoutDateTime - loginDateTime;
    // console.log(totalTime);
    return totalTime/1000;
}