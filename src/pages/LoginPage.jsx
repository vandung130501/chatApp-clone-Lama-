import React from 'react'
import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { Link, useNavigate } from 'react-router-dom'
import { auth } from '../firebase'
const Login = () => {
  const [error, setError] = useState(false)
  const navigate = useNavigate()
  const handleSummit = async (e) => {
    e.preventDefault()
    const email = e.target[0].value
    const password = e.target[1].value
    // const auth = getAuth()
    try {
      await signInWithEmailAndPassword(auth, email, password)
      navigate('/')
    } catch (error) {
      setError(true)
      console.log(error)
    }
  }
  return (
    <div className="formContainer">
      <div className="formWrapper">
        <form onSubmit={handleSummit}>
          <span className="logo">Bongcaixanh</span>
          <span className="title">Login</span>

          <input type="email" placeholder="email" />
          <input type="password" placeholder="password" />
          <button>Sign out</button>
          <p>
            You don't have an account?
            <span>
              <Link to="/register">Register</Link>
            </span>
          </p>
        </form>
        {error && <span>Something went wrong</span>}
      </div>
    </div>
  )
}

export default Login
