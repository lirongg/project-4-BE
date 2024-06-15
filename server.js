const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const uploadRoute = require('./controllers/uploadController')

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

app.use(require('./config/checkToken'))

// Routes
app.use('/users', require('./routes/userRoutes'));

// Protected routes
const ensureLoggedIn = require('./config/ensureLoggedIn.js');
const itemRoutes = require('./routes/itemRoutes.js')
app.use('/items', itemRoutes);
app.use('/items/create', ensureLoggedIn, itemRoutes);
app.use('/upload', uploadRoute)


//defining port and listen

app.listen(PORT, function() {
    console.log(`Express app is running on port ${PORT}`);
})

mongoose.connect(process.env.DATABASE_URL);

const db = mongoose.connection;

db.on("connected", function () {
  console.log(`Connected to ${db.name} at ${db.host}:${db.port}`);
});



