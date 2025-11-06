const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const path = require("path"); 
const mongoDB = require('./db');
const http = require('http');
const { Server } = require("socket.io");
mongoDB();
const cors = require('cors');
const payRoutes = require("./Routes/payRoutes.js");


const { socket } = require('../frontend/src/utils/socket.js');


// const port = process.env.PORT;

const PORT = process.env.PORT || 4000

app.use(cors());

app.use(express.json());
app.use('/api', require('./Routes/CreateUser'));
app.use('/api', require('./Routes/LoginUser'));
app.use('/api',require('./Routes/AddSkills'));
// app.use('/api',require('./Routes/payRoutes'));  // ---------------------ERROR OCCURRED-----------
app.use("/api", payRoutes);

const server = http.createServer(app);

const io = new Server( server, {
    cors: { origin: "*"},
});

io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    // to join a room

    socket.on("join-room", ({ roomId, userName }) => {
        socket.join(roomId);
        socket.roomId = roomId;
        socket.userName = userName || "Anonymous";
        socket.to(roomId).emit("user-joined", { socketId: socket.id, userName: socket.userName });
        console.log(`${socket.userName} joined ${roomId}`);
    });

    // leave the room

    socket.on("leave-room", ({ roomId }) => {
        socket.leave(roomId);
        socket.to(roomId).emit("user-left", { socketId: socket.id });
    });

    // chat message

    socket.on("chat-message", (payload) => {
        if (!payload || !payload.roomId) return;
        io.to(payload.roomId).emit("chat-message", {
            message: payload.message,
            from: payload.from || socket.userName || "Anonymous",
            time: Date.now(),
        });
    });

    //WebRTC Signal

    socket.on("webrtc-offer", ({ to, from, offer }) => {
        io.to(to).emit("webrtc-offer", { from, offer });
    });

    socket.on("webrtc-answer", ({ to, from, answer }) => {
        io.to(to).emit("webrtc-answer", { from, answer });
    });

    socket.on("webrtc-candidate", ({ to, from, candidate }) => {
        io.to(to).emit("webrtc-candidate", ( from, candidate ));
    });

    socket.on("disconnect", () => {
        console.log("Socket disconnected", socket.id);
        if (socket.roomId) socket.to(socket.roomId).emit("user-left", { socketId: socket.id });
    });
});

// const PORT = process.env.PORT || 4000


app.get('/', (req,res)=>{
    res.send('Hello World');
})

// app.listen(port,()=>{
//     console.log(`App listening on port ${port}`);
// })

server.listen(PORT, () => {
    console.log(`Socket server running on port ${PORT}`)
});