import './App.css'
import axios from 'axios';
import { useEffect, useState } from 'react';

function App() {
  const [students, setStudents] = useState([]);

  const [name, setName] = useState([]);
  const [course, setCourse] = useState([]);
  const [age, setAge] = useState([]);
  const [message, setMessage] = useState([]);

  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    axios
      .get('http://localhost:5000/students')
      .then((response) => {
        setStudents(response.data);
      });
  }, []);

  async function handleCreate(event) {
    event.preventDefault();
    setMessage('');

    if (!name.trim || !course.trim || !age) {
      setMessage('Complete all fields');
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/students`,
        {
          name: name.trim(),
          course: course.trim(),
          age: Number(age)
        }
      );

      setStudents((currentStudents) => [
        ...currentStudents,
        response.data.student
      ]);

      setName('');
      setCourse('');
      setAge('');
      setMessage(response.data.message);
    }
    catch (error) {
      console.error('Create error: ', error);
      setMessage('Unable to create student');
    }
  }

  async function handleDelete(id) {
    setMessage('');

    try {
      const response = await axios.delete(
        `http://localhost:5000/students/${id}`
      );

      setStudents((currentStudents) =>
        currentStudents.filter((student) => student._id !== id)
      );

      setMessage(response.data.message);
    }
    catch (error) {
      console.error('Delete error: ', error);
      setMessage('Unable to delete student')
    }
  }

  // async function handleDelete(id) {
  //   setMessage('');

  //   try {
  //     const response = await axios.delete(
  //       `http://localhost:5000/students/${id}`
  //     )
  //   }
  // }

  function handleUpdate(student) {
    setUpdatingId(student._id);
    setName(student.name);
    setCourse(student.course);
    setAge(String(student.age));
    setMessage('');
  }

  function resetForm() {
    setName('');
    setCourse('');
    setAge('');
    setUpdatingId(null);
  }

  return (
    <div>
      <h1>Student Management System</h1>
      {/* <p>Connecting to the server...</p> */}
      {/* <h2>Students</h2> */}

      <form onSubmit={handleCreate}>
        {/* <h2>ADD STUDENT</h2> */}

        <h2>{updatingId ? 'Edit Student' : 'Add Student'}</h2>

        <input
          type='text'
          placeholder='Name'
          value={name}
          onChange={(event) => setName(event.target.value)}
        />

        <br /> <br />

        <input
          type='text'
          placeholder='Course'
          value={course}
          onChange={(event) => setCourse(event.target.value)}
        />

        <br /> <br />

        <input
          type='number'
          placeholder='Age'
          value={age}
          onChange={(event) => setAge(event.target.value)}
        />

        <br /> <br />
        {/* <button type='submit'>ADD STUDENT</button> */}
        <button type='submit'>{updatingId ? 'UPDATE STUDENT' : 'ADD STUDENT'}</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Course</th>
            <th>Age</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) =>
            <tr key={student._id}>
              <td>{student.name}</td>
              <td>{student.course}</td>
              <td>{student.age}</td>
              <td>
                <button type='button' onClick={() => handleUpdate(student)}>EDIT</button>
                <button type='button' onClick={() => handleDelete(student._id)}>DELETE</button>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {students.length === 0 && <p>No students yet.</p>}

      {message && (
        <p className='status-message'>{message}</p>
      )}

      {/* {students.map((student) => (
        <div key={student.id}>
          <p>Name: {student.name}</p>
          <p>Course: {student.course}</p>
          <p>Age: {student.age}</p>
        </div>
      ))} */}
    </div>
  );

  // return (
  //   <div>
  //     <h1>Studet Management System</h1>
  //     <h2>Add Student</h2>
  //     <input placeholder='Name'/>
  //     <br/> <br/>
  //     <input placeholder='Course'/>
  //     <br/> <br/>
  //     <input placeholder='Age'/>
  //     <br/> <br/>
  //     <button>Add Student</button>
  //     <h2>Students</h2>
  //     <p>No students yet.</p>
  //   </div>
  // );
}

export default App;
