import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { handelError, handelSuccess } from '../utils'

function Login() {
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

  const handleLogin = async (e)=>{
    e.preventDefault()

    const { email, password } = userInputInfo
    if(!email || !password) {
      return handelError('All fields are required!')
    }

    try {
      const url = "http://localhost:3000/auth/login"
      const response = await fetch(url, {
        method: "POST",
        headers: {
          'content-Type': 'application/json'
        },
        body: JSON.stringify(userInputInfo)
      })
      const result = await response.json();
      const { accessToken, refreshToken, user, error } = result;
      if(accessToken){
        handelSuccess('Account Logged in!')
        localStorage.setItem('token', accessToken)
        localStorage.setItem('loggedInUser', JSON.stringify(user))
        setTimeout(() => {
          navigate('/home')
        }, 1000);
      }else if(error){
        handelError(error.message);
      }
    } catch (err) {
      handelError(err.message)
    }
  }  

  return (
    <div className='container'>
      <h1>Login</h1>
      <form action="" onSubmit={handleLogin}>
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
        <button type="submit">Login</button>
        <span>Do not have an account?
          <Link to="/signup">Sign Up</Link>
        </span>
      </form>
      <ToastContainer />
    </div>
  )
}

export default Login