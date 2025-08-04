const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const express = require('express');
const app = express();
dotenv.config({ path: './config.env' });
const meetingRequestsRouter = require('./routes/meetingRequests');
const roomRoutes = require('./routes/roomRoutes');
<<<<<<< HEAD
const documentRoutes = require('./routes/document');
=======
>>>>>>> 8e7eb8dffc68bbd36a79b141c1af865882ab880c

const db = process.env.DB;

mongoose
    .connect(db)
    .then(() => {
        console.log('DB connection successful!');
    })
    .catch(err => {
        console.log(err);
});

const port = process.env.PORT || 3000;
const corsOptions = {
    origin: 'http://localhost:3000', // ระบุ origin ที่ frontend ใช้งาน
    credentials: true
};
app.use(cors(corsOptions));

app.use(express.json());

app.use('/api/meeting-requests', meetingRequestsRouter);
app.use('/api/rooms', roomRoutes);
<<<<<<< HEAD
app.use('/api/documents', documentRoutes);
=======
>>>>>>> 8e7eb8dffc68bbd36a79b141c1af865882ab880c

const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);
app.use('/api/v1/users', userRoutes);
const meetingRoutes = require('./routes/meetingRoutes');
app.use('/api/meeting', meetingRoutes);

app.listen(port, () => {
    console.log(`App running on port ${port}`);
});

