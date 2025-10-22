import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Home from './Home';
import Register from './Register';
import Login from './Login';
import Dashboard from './Dashboard';
import s from './style.module.css'
import Chat from "./Chat";

function App() {
    return (
        <Router>
            <nav>
                <Link to="/">Home</Link> |
                <Link to="/chat">Chat</Link> |
                <Link to="/register">Register</Link> |
                <Link to="/login">Login</Link> |
                <Link to="/dashboard">Dashboard</Link>
            </nav>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/chat" element={<Chat />} />
            </Routes>
        </Router>
    );
}

export default App;
