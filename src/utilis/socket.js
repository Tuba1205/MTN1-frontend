// src/services/socketService.js
import { io } from 'socket.io-client';

// Replace with your backend server URL
const socket = io('http://localhost:4000');

export { socket };
