import React, { useState } from 'react';
import { Button, TextField, Typography, Box } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        const response = await fetch('http://localhost:3001/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        if (response.ok && response.headers.get("content-type").includes("application/json")) {
            const data = await response.json();
            console.log(data);
            navigate('/'); // Redirect to login after registration
        } else {
            console.error('Failed to register:', response.status);
        }
    };
    

    return (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh">
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '100%', maxWidth: 300 }}>
                <TextField label="Username" value={username} onChange={(e) => setUsername(e.target.value)} margin="normal" />
                <TextField label="Password" value={password} onChange={(e) => setPassword(e.target.value)} type="password" margin="normal" />
                <Button type="submit" variant="contained" style={{ marginTop: 20, backgroundColor: '#212121' }}>Register</Button>
                <Typography variant="body2" style={{ marginTop: 20 }}>
                    Already have an account? <Link to="/login">Login here</Link>
                </Typography>
            </form>
        </Box>
    );
}

export default Register;
