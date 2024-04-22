import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Messages from './Messages';
import Login from './Login';
import Register from './Register';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/messages" element={<Messages />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
