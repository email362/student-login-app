import { useEffect, useState } from 'react'
import './Dashboard.css'

function Dashboard() {

  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('https://vivacious-jade-nightgown.cyclic.app/api/students')
      .then(response => response.json())
      .then(data => {
        console.log(data)
        setData(data)
      })
  }, []);

  return (
    <>
      <h1>MLC Admin Home</h1>
      <div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Student ID</th>
              <th>Classes</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => {
              const {studentName, studentId} = item
              return (
                <tr>
                  <td>{studentName}</td>
                  <td>{studentId}</td>
                  <td>{item.classes.join(", ")}</td>
                  <td>
                    <button onClick={() => console.log("edit", this)}>Edit</button>
                    <button onClick={() => console.log("delete", this)}>Delete</button>
                  </td>

                </tr>
              )
            })}
          </tbody>

        </table>
      </div>
    </>
  )
}

export default Dashboard