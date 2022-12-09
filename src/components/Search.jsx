import React, { useContext } from 'react'
import { useState } from 'react'
import { db } from '../firebase'
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore'
import { AuthContext } from '../context/AuthContext'

const Search = () => {
  const [username, setUsername] = useState('')
  const [user, setUser] = useState(null)
  const [err, setErr] = useState(false)
  const { currentUser } = useContext(AuthContext)
  const handleSelect = async () => {
    const combinedId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid
    try {
      const res = await getDoc(doc(db, 'chats', combinedId))
      if (!res.exists()) {
        //create a chats collection
        await setDoc(doc(db, 'chats', combinedId), { messages: [] })
      }
      //create user chat
      await updateDoc(doc(db, 'userChats', currentUser.uid), {
        [combinedId + '.userInfo']: {
          uid: user.uid,
          displayName: user.displayName,
          photoURL: user.photoURL,
        },
        [combinedId + '.date']: serverTimestamp(),
      })
      await updateDoc(doc(db, 'userChats', user.uid), {
        [combinedId + '.userInfo']: {
          uid: currentUser.uid,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL,
        },
        [combinedId + '.date']: serverTimestamp(),
      })
    } catch (error) {
      console.error(error)
    }
    setUser(null)
    setUsername('')
    //check whether the group ( chats in gr) exist, if not we will create
  }
  const handleSearch = async () => {
    const q = query(
      collection(db, 'users'),
      where('displayName', '==', username),
    )
    try {
      const querySnapshot = await getDocs(q)
      querySnapshot.forEach((doc) => {
        setUser(doc.data())
      })
    } catch (err) {
      setErr(true)
      console.error(err)
      console.log(err)
    }
  }
  const handleKey = (e) => {
    e.code === 'Enter' && handleSearch()
  }

  return (
    <div className="search">
      <div className="searchForm">
        <input
          type="text"
          placeholder="Find someone"
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={handleKey}
          value={username}
        />
      </div>
      {err && <span>User not Found</span>}
      {user && (
        <div className="userChat" onClick={handleSelect}>
          <img src={user.photoURL} alt="" />
          <div className="userChatInfo">
            <span>{user.displayName}</span>
            <p>last message</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Search
