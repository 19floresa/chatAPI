import React from 'react';
import { List, ListItem, ListItemText, Divider, Box, Grid, Paper, Card, TextField,
	InputAdornment, Typography, Avatar, ListItemAvatar, ListItemButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SendIcon from '@mui/icons-material/Send';


function Messages() {
    const users = ["User1", "User2", "User3", "User4", "User5"];
    const messages = ["Message from User1", "Message from User2", "Message from User3", "Message from User4", "Message from User5"];
    const [selectedUser, setSelectedUser] = React.useState(users[0]);

	const userSideBg = '#9E9E9E'; // Background color for the user list side of the app
	const searchBoxBg = '#EEEEEE'; // Background color for the search box above the user list
	const selectedUserHighlight = '#212121'; // Background color for a selected user in the user list
	const userTextColor = '#FFFFFF'; // Text color for the names of the users in the user list
	const messageAreaBg = '#E0E0E0'; // Background color for the main message area/display
	const barBg = '#F5F5F5'; // Background color for the top bar (displaying selected user) and bottom bar (message input area)
	const messageTextColor = '#212121'; // Text color for the messages displayed in the message area
	const avatarBgColor = '#EEEEEE'; // Background color for the avatar icons in the user list
	const avatarTextColor = '#424242'; // Text color for the text inside the avatar icons


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
                            <div style={{ flexGrow: 1, overflow: 'auto' }}>
                                {messages.filter(msg => msg.includes(selectedUser)).map((msg, index) => (
                                    <p key={index} style={{ color: messageTextColor }}>{msg}</p>
                                ))}
                            </div>
                            <Box sx={{ bgcolor: barBg, padding: '16px' }}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    placeholder="Type a message..."
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <SendIcon />
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
