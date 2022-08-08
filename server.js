require('dotenv').config();
const express = require('express');
const app = express();
const db = require('./database');
const stationsRouter = require('./routes/stations.js');
const journeysRouter = require('./routes/journeys.js');

const PORT = process.env.PORT || 3005;

// Middleware
app.use(cors());

// Routes
app.get('/', (req, res) => {
    res.json({
        message: "Welcome to citybike server",
        routes: ["/stations/all", "/stations/byFID/param1", "/journeys/sorted/param1/param2/param3/param4"]
    });
})
app.use('/stations', stationsRouter);
app.use('/journeys', journeysRouter);

app.listen(PORT, () => {
    console.log(`Listening to ${PORT}`);
});