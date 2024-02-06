import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { Button, FileButton, FileInput, Group, Text, Table } from '@mantine/core';


function parseName(name) {
    const fullName = name.split(','); // split the name into an array
    const lastName = fullName[0].trim(); // get the first element and remove any leading or trailing spaces
    const firstName = fullName[1].trim(); // get the second element and remove any leading or trailing spaces
    return `${firstName} ${lastName}`; // return the first and last name in the correct order
};

async function readFile (file, callback = data => data) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = e.target.result;
            resolve(callback(data));
        };
        reader.onerror = (e) => {
            reject(new Error("Failed to read file"));
        };
        reader.readAsArrayBuffer(file);
    });
};

function ImportStudents({ onImport = () => console.log('onImport function called'), students = null, onCancel }) {
    const [file, setFile] = useState(null);
    const [error, setError] = useState(null);
    const [table, setTable] = useState(null);
    const [fileName, setFileName] = useState(null);
    const [matchedStudents, setMatchedStudents] = useState([]);
    const [importedStudents, setImportedStudents] = useState([]);

    function parseExcel(data) {
        const workbook = XLSX.read(data);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        let sheetJSON = XLSX.utils.sheet_to_json(sheet);
        sheetJSON = sheetJSON.map((student) => {
            const { ID, Name } = student;
            const studentName = parseName(Name);
            let found = false;
            let nameMatch = true;
            let hasClass = false;
            let match = students.find((s) => s.studentId === student.ID);
            if (match) {
                found = true;
                nameMatch = match.studentName === studentName;
                if (nameMatch) {
                    console.log(match.classes, fileName, match.classes.includes(fileName));
                }
                hasClass = match.classes.includes(fileName);
            }
            const parsedStudent = { ID, Name: studentName, found, nameMatch, hasClass};
            console.log("Parsed Student", parsedStudent);
            return parsedStudent;
        });
        return sheetJSON;
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFile(file);
            setError(null);
        }
    };

    const handleImport = () => {
        if (file) {
            try {
                readFile(file, parseExcel).then((sheetToJSON) => {
                    setImportedStudents(sheetToJSON);
                    setMatchedStudents((prevVal) => {
                        let matchedStudents = [];
                        for (const student of sheetToJSON) {
                            let match = students.find((s) => s.studentId === student.ID);
                            if (match) {
                                matchedStudents.push({ ...student, ...match });
                            }
                        }
                        return matchedStudents;
                    });
                    console.log("Data", sheetToJSON);
                });
            } catch (error) {
                console.error(error);
            }
        } else {
            setError('Please select a file');
        }
    };

    // function that produces jsx for the matched students
    const matchedStudentsJSX = () => {
        let jsx = [];
        if (matchedStudents.length > 0) {
            // console.log("Matched Students", matchedStudents);
            for (const student of matchedStudents) {
                const { ID, studentName, Name, classes } = student;
                const classesStr = classes.join(',');
                jsx.push(
                    <div key={ID}>
                        <Text>{`${ID} ${studentName} ${Name}`}</Text>
                        <Text>Classes: {classesStr}</Text>
                    </div>
                );
            }
        }
        return jsx;
    }

    const rows = importedStudents.map((student) => (
        <Table.Tr key={student.ID}>
          <Table.Td>{student.ID}</Table.Td>
          <Table.Td>{student.Name}</Table.Td>
        </Table.Tr>
    ));

    useEffect(() => {
        setFileName(file ? file.name.split('.')[0] : null);
    }, [file]);

    return (
        <div>
            <Group justify='center'>
                <Button onClick={onCancel}>Cancel</Button>
                <FileButton onChange={setFile} accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">
                    {(props) => <Button {...props}>Upload File</Button>}
                </FileButton>
                <Button onClick={handleImport} disabled={file ? false : true}>Import Students</Button>
            </Group>
            {file && (
                <Text size="sm" ta="center" mt="sm">
                    Picked file: {file.name}
                </Text>
            )}
            {/* <input type="file" onChange={handleFileChange} /> */}
            {error && <p>{error}</p>}
            <Text>Name of Class: {fileName}</Text>
            <Text>Found Students:</Text>
            {/* {(matchedStudents.length > 0) && matchedStudentsJSX()} */}
            <Table stickyHeader striped verticalSpacing={"md"} captionSide='top' withTableBorder highlightOnHover>
                <Table.Caption>{file ? `Students found from ${file.name}` : `Upload a class file to show students here`}</Table.Caption>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>ID</Table.Th>
                        <Table.Th>Name</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
            </Table>
        </div>
    );
}

export default ImportStudents;