import React from 'react'
import { BrowserRouter as Router, Route, Routes, Redirect } from 'react-router-dom';
import Register from './components/Register';
import Todo from './components/HomePage';
import Login from './components/Login';
import Category from './components/Categorys';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route  path="/" element={<Register/>} />
        <Route  path="/todo/:sessionId" element={<Todo/>} />
        <Route  path="/login" element={<Login/>} />
        <Route  path="/categorys/:sessionId" element={<Category/>} />
        {/* Redirect to /register if the URL doesn't match any route */}
        {/* <Redirect to="/register" /> */}
      </Routes>
    </Router>

  )
}

export default App
