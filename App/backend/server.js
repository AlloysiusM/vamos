const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const userRoutes = require('./routes/user');
const eventRoutes = require('./routes/event'); 

const app = express();

// Control blocked host connections
app.use(cors({ origin: 'http://localhost:8081' }));

// Convert data to json
app.use(express.json());

// Mount routes
app.use('/api/user', userRoutes);
app.use('/api/events', eventRoutes);

console.log("DB_URI:", process.env.DB_URI);

// Check db coonnection
mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    app.listen(process.env.PORT, () => {
        console.log('Listening on port', process.env.PORT);
    });
})
.catch((error) => {
    console.error("MongoDB connection error:", error);
});
