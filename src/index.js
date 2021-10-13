import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDO_yDNIXVgkO4LZWGOCmPF7SPh_R5uzJM",
  authDomain: "react-tennis-1d9a5.firebaseapp.com",
  projectId: "react-tennis-1d9a5",
  storageBucket: "react-tennis-1d9a5.appspot.com",
  messagingSenderId: "901060888131",
  appId: "1:901060888131:web:e296333431ced23efbb6f6",
  measurementId: "G-Q96NG311ST"
};
initializeApp(firebaseConfig)

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
