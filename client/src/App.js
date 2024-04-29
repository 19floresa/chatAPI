import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SocketProvider } from './SocketContext';
import Messages from './Messages';
import Login from './Login';
import Register from './Register';

function App() {
    return (
        <Router>
            <SocketProvider>
                <div className="App">
                    <Routes>
                        <Route path="/" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/messages" element={<Messages />} />
                    </Routes>
                </div>
            </SocketProvider>
        </Router>
    );
}

export default App;
