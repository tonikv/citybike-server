require('dotenv').config();

const express = require('express');
const app = express();

const PORT = process.env.PORT || 3005;

// Routes
app.get('/', (req, res) => {
    res.json({ message: "Welcome to citybike server" });
})

app.listen(PORT, () => {
    console.log(`Listening to ${PORT}`);
});