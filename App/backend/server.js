const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

// Middleman - parse json to database
const app = express();

// Debug stmt - check valid server
console.log("DB_URI:", process.env.DB_URI);

// Connect to db
mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    // listen to port, ensure it connects
    app.listen(process.env.PORT, () => {
        console.log('Listening on port', process.env.PORT);
    });
})
.catch((error) => {
    console.error("MongoDB connection error:", error);
});
