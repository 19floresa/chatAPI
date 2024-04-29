import React, { useState, useEffect } from 'react';
import { Box, Grid, Paper, Card, TextField, InputAdornment, Typography, Avatar, List, ListItem, ListItemAvatar, ListItemText, ListItemButton, Divider } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SendIcon from '@mui/icons-material/Send';
import io from 'socket.io-client';
import axios from 'axios';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

function Messages() {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const navigate = useNavigate();
    const socket = io('http://localhost:3001', {
        query: { sessionId: sessionStorage.getItem('sessionId') }
    });

    const userSideBg = '#9E9E9E';
    const searchBoxBg = '#EEEEEE';
    const selectedUserHighlight = '#212121';
    const userTextColor = '#FFFFFF';
    const messageAreaBg = '#E0E0E0';
    const barBg = '#F5F5F5';
    const avatarBgColor = '#EEEEEE';
    const avatarTextColor = '#424242';
    const messageCardBg = '#212121';
    const messageTextColor = '#FFFFFF';

    useEffect(() => {
        const loggedInUserId = sessionStorage.getItem('loggedInUserId');
        const loggedInUsername = sessionStorage.getItem('loggedInUsername');

        if (!loggedInUserId || !loggedInUsername) {
            navigate('/login');
        }

        socket.on('messageReceived', (message) => {
            if (message.senderId === selectedUser?._id || message.receiverId === selectedUser?._id) {
                setMessages(prevMessages => [...prevMessages, message]);
            }
        });

        return () => {
            socket.off('messageReceived');
        };
    }, [selectedUser, navigate]);

    useEffect(() => {
        async function fetchUsers() {
            try {
                const response = await axios.get('http://localhost:3001/retrieveAllUsers');
                if (response.data && response.data.users) {
                    setUsers(response.data.users);
                    if (!selectedUser && response.data.users.length > 0) {
                        setSelectedUser(response.data.users[0]);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch users:', error);
            }
        }
        fetchUsers();
    }, []);

    useEffect(() => {
        let intervalId;
    
        const fetchMessages = async () => {
            if (selectedUser) {
                try {
                    const response = await axios.post('http://localhost:3001/messagesBetween', {
                        userId: sessionStorage.getItem('loggedInUserId'),
                        otherUserId: selectedUser._id
                    });
                    if (response.data && response.data.messages) {
                        setMessages(response.data.messages.map(msg => ({
                            ...msg,
                            sender: msg.userId,
                            content: msg.msg
                        })));
                    }
                } catch (error) {
                    console.error('Failed to fetch messages:', error);
                }
            }
        };
    
        fetchMessages();
    
        intervalId = setInterval(fetchMessages, 3000);
    
        return () => {
            clearInterval(intervalId);
        };
    }, [selectedUser]);
    

    const handleSendMessage = async () => {
        if (!selectedUser || !newMessage) return;

        const messageData = {
            cardId: sessionStorage.getItem('loggedInUserId'),
            msg: newMessage,
            other_user: selectedUser._id
        };

        try {
            const response = await axios.post('http://localhost:3001/push', messageData);
            const newMsg = {
                senderId: sessionStorage.getItem('loggedInUserId'),
                senderUsername: sessionStorage.getItem('loggedInUsername'),
                content: newMessage,
                receiverId: selectedUser._id,
                receiverUsername: selectedUser.username
            };

            setMessages(prevMessages => [...prevMessages, newMsg]);
            setNewMessage('');
            socket.emit('sendMessage', newMsg);
        } catch ( error) {
            console.error('Failed to send message:', error);
        }
    };

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:3001/logout', { userId: sessionStorage.getItem('loggedInUserId') });
            socket.disconnect();
            sessionStorage.clear();
            navigate('/');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const handleLogoutAll = async () => {
        try {
            await axios.post('http://localhost:3001/logoutAll');
            socket.emit('logoutAll');
            navigate('/');
        } catch (error) {
            console.error('Logout All failed:', error);
        }
    };

    return (
        <Box sx={{ flexGrow: 1, height: '100vh' }}>
            <Grid container spacing={0} sx={{ height: '100%' }}>
                <Grid item xs={12} md={3}>
                    <Card sx={{ bgcolor: userSideBg, height: '100%' }}>
                        <Box sx={{ padding: '16px' }}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                placeholder="Search Users"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
                                    style: { backgroundColor: searchBoxBg },
                                }}
                                sx={{ height: 40, marginBottom: '16px' }}
                            />
                        </Box>
                        <Box sx={{ overflow: 'auto', flexGrow: 1 }}>
                            <List component="nav" aria-label="mailbox folders" sx={{ padding: 0, width: '100%' }}>
                                {users.map((user, index) => (
                                    <ListItemButton
                                        key={user._id}
                                        selected={selectedUser && user._id === selectedUser._id}
                                        onClick={() => setSelectedUser(user)}
                                        sx={{
                                            bgcolor: (selectedUser && user._id === selectedUser._id) ? selectedUserHighlight : 'transparent',
                                            '&.Mui-selected': {
                                                bgcolor: selectedUserHighlight,
                                                color: 'white',
                                                '&:hover': {
                                                    bgcolor: selectedUserHighlight,
                                                },
                                            },
                                            height: '72px',
                                        }}
                                    >
                                        <ListItemAvatar>
                                            <Avatar sx={{ bgcolor: avatarBgColor, color: avatarTextColor }}>
                                                {user.username[0]}
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText 
                                            primary={user.username}
                                            primaryTypographyProps={{ style: { color: userTextColor } }}
                                        />
                                    </ListItemButton>
                                ))}
                            </List>
                        </Box>
                        <Box sx={{ padding: '16px', display: 'flex', justifyContent: 'center' }}>
                            <Button 
                                variant="contained" 
                                color="primary" 
                                onClick={() => handleLogout()}
                                sx={{ marginRight: 2 }}
                            >
                                Logout
                            </Button>
                            <Button 
                                variant="contained" 
                                color="secondary" 
                                onClick={() => handleLogoutAll()}
                            >
                                Logout All Users
                            </Button>
                        </Box>
                    </Card>
                </Grid>
                <Grid item xs={12} md={9}>
                    <Card sx={{ height: '100%' }}>
                        <Paper elevation={3} style={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: messageAreaBg }}>
                            <Box sx={{ 
                                bgcolor: barBg, 
                                display: 'flex', 
                                alignItems: 'center', 
                                padding: '16px', 
                                height: '55.9px', 
                                justifyContent: 'space-between'
                            }}>
                                <Typography variant="h5">
                                    {selectedUser ? selectedUser.username : "Select a user"}
                                </Typography>
                                <Typography variant="h6" style={{ textAlign: 'right' }}>
                                    Logged in as: {sessionStorage.getItem('loggedInUsername')}
                                </Typography>
                            </Box>
                            <div style={{ flexGrow: 1, overflow: 'auto', display: 'flex', flexDirection: 'column-reverse' }}>
                                {messages.map((msg, index) => (
                                    <Box key={index} sx={{
                                        display: 'inline-block',
                                        maxWidth: 'fit-content',
                                        marginLeft: msg.sender === sessionStorage.getItem('loggedInUserId') ? 'auto' : '10px',
                                        marginRight: msg.sender === sessionStorage.getItem('loggedInUserId') ? '10px' : 'auto',
                                        marginBottom: '10px',
                                        bgcolor: messageCardBg,
                                        padding: '10px',
                                        borderRadius: '4px',
                                        textAlign: msg.sender === sessionStorage.getItem('loggedInUserId') ? 'right' : 'left'
                                    }}>
                                        <Typography variant="body1" style={{ color: messageTextColor, fontSize: '1.8rem' }}>
                                            {msg.content}
                                        </Typography>
                                    </Box>
                                ))}
                            </div>
                            <Box sx={{ bgcolor: barBg, padding: '16px' }}>
                                <TextField
                                    fullWidth
                                    value={newMessage}
                                    onChange={e => setNewMessage(e.target.value)}
                                    variant="outlined"
                                    placeholder="Type a message..."
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <SendIcon onClick={handleSendMessage} style={{ cursor: 'pointer' }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Box>
                        </Paper>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
    
}

export default Messages;
