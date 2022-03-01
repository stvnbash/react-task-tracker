import { useState, useEffect } from 'react'
import { FaAppStore } from 'react-icons/fa';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Header from './components/Header';
import Tasks from './components/Tasks';
import AddTask from './components/AddTask';
import Footer from './components/Footer';
import About from './components/About';
import TaskDetails from './components/TaskDetails';

function App() {
  const [showAddTask, setShowAddTask] = useState(false);
  const [tasks, setTasks] = useState([])
  // const [tasks, setTasks] = useState([
  //   {
  //       id: 1,
  //       text: 'Doctors Appointment',
  //       day: 'Feb 5th at 2:30pm',
  //       reminder: true,
  //   },
  //   {
  //       id: 2,
  //       text: 'Meeting at School',
  //       day: 'Feb 6th at 1:30pm',
  //       reminder: true,
  //   },
  //   {
  //       id: 3,
  //       text: 'Food Shopping',
  //       day: 'Feb 5th at 2:30pm',
  //       reminder: false,
  //   }
  //   ])

  useEffect(() => {
    const getTasks = async () => {
      const tasksFromServer = await fetchTasks()
      setTasks(tasksFromServer)
    }

    getTasks()
  }, [])

  // Fetch Tasks
  const fetchTasks = async () => {
    const res = await fetch('http://localhost:5000/tasks')
    const data = await res.json()

    return data
  }

  // Fetch Task
  const fetchTask = async (id) => {
    const res = await fetch(`http://localhost:5000/tasks/${id}`)
    const data = await res.json()

    return data
  }

  // Add Task
  const addTask = async (task) => {
    const res = await fetch('http://localhost:5000/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(task)
    })

    const data = await res.json()

    setTasks([...tasks, data])

    // const id = Math.floor(Math.random() * 10000) + 1
    // console.log(id)
    // const newTask = {id, ...task}
    // setTasks([...tasks, newTask])
  }

  // Delete Task
  const deleteTask = async (id) => {
    await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'DELETE'
    })

    setTasks(tasks.filter((task) => task.id !== id))
  }

  // Toggle Reminder
  const toggleReminder = async (id) => {
    const taskToToggle = await fetchTask(id)
    const updatedTask = {...taskToToggle, reminder: !taskToToggle.reminder}

    const res = await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedTask)
    })

    const data = await res.json()

    setTasks(
      tasks.map((task) => 
        task.id === id ? { ...task, reminder: data.reminder } : task 
      )
    )
  }

  return (
    <Router>
      <div className="container">
        <Header onAdd={() => setShowAddTask(!showAddTask)} showAdd={showAddTask} />
        
        <Routes>
          <Route path="/" element={
            <>
              {showAddTask && <AddTask onAdd={addTask}/>}
              {tasks.length > 0 ? (
              <Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleReminder}/> 
              ) : ( 
                'No Tasks To Show' 
              )}
            </>
          } />
          <Route path='/about' element={<About />}/>
          <Route path='/task/:id' element={<TaskDetails />}/>
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
