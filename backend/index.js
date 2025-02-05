require('dotenv').config(); // Load environment variables at the top

const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const connectDb = require('./config/db');
const authRoute = require('./routes/authRoute');

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors()); // Enable CORS

// Connect to the database
connectDb()
    .then(() => console.log("Database connected successfully"))
    .catch((err) => console.error("Database connection failed:", err));

// API Routes
app.use('/api/auth', authRoute);
// Set PORT with a default fallback
const PORT = process.env.PORT || 8000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
    console.log('PORT from .env:', process.env.PORT); // Debugging line
});
