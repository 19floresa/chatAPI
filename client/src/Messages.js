import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemText, Divider, Box, Grid, Paper, Card, TextField,
    InputAdornment, Typography, Avatar, ListItemAvatar, ListItemButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

function Messages() {
    const users = ["User1", "User2", "User3", "User4", "User5"];
    const [selectedUser, setSelectedUser] = useState(users[0]);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const location = useLocation();
    const cardId = location.state?.cardId; 

    const userSideBg = '#9E9E9E';
    const searchBoxBg = '#EEEEEE';
    const selectedUserHighlight = '#212121';
    const userTextColor = '#FFFFFF';
    const messageAreaBg = '#E0E0E0';
    const barBg = '#F5F5F5';
    // const messageTextColor = '#212121';
    const avatarBgColor = '#EEEEEE';
    const avatarTextColor = '#424242';
    const messageCardBg = '#212121'; // Background color for the message cards
    const messageTextColor = '#FFFFFF'; // Text color for the messages in the cards


    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/selectMessages`, {
                    params: { cardId: cardId }
                });
                setMessages(response.data.result);
            } catch (error) {
                console.error('Failed to fetch messages:', error);
            }
        };

        if (cardId) {
            fetchMessages();
        }
    }, [cardId]);

    const handleSendMessage = async () => {
        try {
            await axios.post('http://localhost:3001/push', {
                cardId: cardId,
                msg: newMessage
            });
            setMessages(prevMessages => [...prevMessages, { msg: newMessage }]);
            setNewMessage('');
        } catch (error) {
            console.error('Failed to send message:', error);
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
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                    style: { backgroundColor: searchBoxBg },
                                }}
                                sx={{ height: 40, marginBottom: '16px' }}
                            />
                        </Box>
                        <Box sx={{ overflow: 'auto', flexGrow: 1 }}>
                            <List component="nav" aria-label="mailbox folders" sx={{ padding: 0, width: '100%' }}>
                                {users.map((user, index) => (
                                    <React.Fragment key={user}>
                                        <ListItemButton
                                            selected={user === selectedUser}
                                            onClick={() => setSelectedUser(user)}
                                            sx={{
                                                bgcolor: user === selectedUser ? selectedUserHighlight : 'transparent',
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
                                                    {user[0]}
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText 
                                                primary={user} 
                                                primaryTypographyProps={{ style: { color: userTextColor } }}
                                            />
                                        </ListItemButton>
                                        {index < users.length - 1 && <Divider />}
                                    </React.Fragment>
                                ))}
                            </List>
                        </Box>
                    </Card>
                </Grid>
                <Grid item xs={12} md={9}>
                    <Card sx={{ height: '100%' }}>
                        <Paper elevation={3} style={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: messageAreaBg }}>
                            <Box sx={{ bgcolor: barBg, display: 'flex', alignItems: 'center', padding: '16px', height: '55.9px' }}>
                                <Typography variant="h5">{selectedUser}</Typography>
                            </Box>
                            <div style={{ flexGrow: 1, overflow: 'auto', display: 'flex', flexDirection: 'column-reverse' }}>
                                {messages.map((msg, index) => (
                                    <Box key={index} sx={{
                                        display: 'inline-block',
                                        maxWidth: 'fit-content',
                                        marginLeft: 'auto',
                                        marginRight: '10px',
                                        marginBottom: '10px',
                                        bgcolor: messageCardBg,
                                        padding: '10px',
                                        borderRadius: '4px'
                                    }}>
                                        <Typography variant="body1" style={{ color: messageTextColor, fontSize: '1.8rem', textAlign: 'right' }}>{msg.msg}</Typography>
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
