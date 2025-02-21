import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { handelError, handelSuccess } from '../utils'

function Signup() {
  const [userInputInfo, setUserInputInfo] = useState({
    email: '',
    password: ''
  })
  const navigate = useNavigate()
  const handleChange = (e)=>{
    const { name, value } = e.target
    const userDetails = { ...userInputInfo }
    userDetails[name] = value
    setUserInputInfo(userDetails)
  }

  const handleSignup = async (e)=>{
    e.preventDefault()

    const { email, password } = userInputInfo
    if(!email || !password) {
      return handelError('All fields are required!')
    }

    try {
      const url = "http://localhost:3000/auth/register"
      const response = await fetch(url, {
        method: "POST",
        headers: {
          'content-Type': 'application/json'
        },
        body: JSON.stringify(userInputInfo)
      })
      const result = await response.json();
      const { accessToken, refreshToken, error } = result;
      if(accessToken){
        handelSuccess('Account created!')
        setTimeout(() => {
          navigate('/login')
        }, 1000);
      }else if(error){
        handelError(error.message);
      }
    } catch (err) {
      handelError(message)
    }
  }  

  return (
    <div className='container'>
      <h1>Sign Up</h1>
      <form action="" onSubmit={handleSignup}>
        <div>
          <label htmlFor="email">Email</label>
          <input 
            type="email"
            name="email"
            autoFocus
            value={userInputInfo.email}
            placeholder='Enter your email.....'
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input 
            type="password"
            name="password"
            value={userInputInfo.password}
            placeholder='Enter your password.....'
            onChange={handleChange}
          />
        </div>
        <button type="submit">Signup</button>
        <span>Already have an account?
          <Link to="/login">Login</Link>
        </span>
      </form>
      <ToastContainer />
    </div>
  )
}

export default Signup