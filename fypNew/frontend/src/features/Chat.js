import React from "react"
import { socket } from "../api/socket";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

import { TextField, Paper, Typography, Button } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';

export default function Chat(){
    const { id } = useParams();
    const dispatch = useDispatch();

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    const handleSendMessage = () => {
        if (newMessage.trim() !== '') {
        setMessages([...messages, { text: newMessage, user: 'You' }]);
        setNewMessage('');
        socket.emit('sendMessage', { roomId: id, message: newMessage });
        }
    };
    
    useEffect(() => {
        socket.on('message', ({ name, message }) => {
          setMessages((prevMessages) => [
            ...prevMessages,
            { text: message, user: name },
          ]);
        });
      
        return () => {
          socket.off('message');
        };
      }, [socket]);

    return (
        <div>
      <Paper elevation={3} style={{ padding: '20px' }}>
        <Typography variant="h6" gutterBottom>
          Chat Box
        </Typography>
        <div style={{ height: '400px', overflowY: 'auto', marginBottom: '10px' }}>
          {messages.map((message, index) => (
            <div key={index}>
              <strong>{message.user}:</strong> {message.text}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <TextField
            label="Type your message"
            variant="outlined"
            fullWidth
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            size="small"
          />
          <Button
            variant="contained"
            color="primary"
            endIcon={<SendIcon />}
            onClick={handleSendMessage}
          >
            Send
          </Button>
        </div>
      </Paper>
    </div>
    )
}