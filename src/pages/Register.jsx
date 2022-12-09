import React from 'react'
import { useState } from 'react'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth, db, storage } from '../firebase'
import { getStorage } from 'firebase/storage'
import { doc, setDoc } from 'firebase/firestore'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { useNavigate, Link } from 'react-router-dom/dist'

const Register = () => {
  const [error, setError] = useState(false)
  const navigate = useNavigate()

  const handleSummit = async (e) => {
    e.preventDefault()
    const displayName = e.target[0].value
    const email = e.target[1].value
    const password = e.target[2].value
    const file = e.target[3].files[0]
    // const auth = getAuth()
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password)

      const date = new Date().getTime()
      const storageRef = ref(storage, `${displayName + date}`)

      await uploadBytesResumable(storageRef, file).then(() => {
        getDownloadURL(storageRef).then(async (downloadURL) => {
          try {
            //update profile
            await updateProfile(res.user, {
              displayName,
              photoURL: downloadURL,
            })
            //create user on firestore
            await setDoc(doc(db, 'users', res.user.uid), {
              uid: res.user.uid,
              displayName,
              email,
              photoURL: downloadURL,
            })
            //create emty user chats on firestores
            await setDoc(doc(db, 'userChats', res.user.uid), {})
            navigate('/')
          } catch (err) {
            console.log(err)
            setError(true)
          }
        })
      })
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
          <span className="title">Register</span>
          <input type="text" placeholder="Display name" />
          <input type="email" placeholder="email" />
          <input type="password" placeholder="password" />
          <input style={{ display: 'none' }} type="file" id="file" />
          <label htmlFor="file">
            <img src="../images/add.png" alt="" />
            <span>Add an avatar</span>
          </label>
          <button>Sign out</button>
          <p>
            You do have an account?
            <span>
              <Link to="/login">Login</Link>
            </span>
            {error && <span>Something went wrong</span>}
          </p>
        </form>
      </div>
    </div>
  )
}

export default Register
