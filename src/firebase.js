import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getDatabase } from 'firebase/database'

const firebaseConfig = {
  apiKey: 'AIzaSyDO_yDNIXVgkO4LZWGOCmPF7SPh_R5uzJM',
  authDomain: 'react-tennis-1d9a5.firebaseapp.com',
  projectId: 'react-tennis-1d9a5',
  storageBucket: 'react-tennis-1d9a5.appspot.com',
  messagingSenderId: '901060888131',
  appId: '1:901060888131:web:e296333431ced23efbb6f6',
  measurementId: 'G-Q96NG311ST',
}

const fb = initializeApp(firebaseConfig)
const auth = getAuth()
const db = getDatabase(fb)
export { fb, auth, db }
