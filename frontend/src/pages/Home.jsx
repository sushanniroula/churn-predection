import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { handelSuccess } from '../utils'

function Home() {
  const [loggedInUser, setLoggedInUser] = useState({token: '', user: ''})

  useEffect(()=>{
    const storedUser = JSON.parse(localStorage.getItem('loggedInUser')); // Parse JSON
    setLoggedInUser(storedUser);
  }, [])

  const navigate = useNavigate()

  const handleLogout = (e) => {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUser');
    handelSuccess('User Loggedout')
    setTimeout(() => {
      navigate('/login')
    }, 1000);
  }
  return (
    <div>
      <h1>{loggedInUser._id}</h1>
      <h1>{loggedInUser.email}</h1>


      <button onClick={handleLogout}>Logout</button>
      <ToastContainer/>
    </div>
  )
}

export default Home