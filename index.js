const express = require('express');
const app = express();
const db = require('./database');
const fs = require('fs');
const cors = require('cors');
const morgan = require('morgan');
const stationsRouter = require('./routes/stations.js');
const journeysRouter = require('./routes/journeys.js');

const accessLogStream = fs.createWriteStream(__dirname + '/access.log', { flags: 'a' })

// Middleware
app.use(morgan('combined', { stream: accessLogStream }));
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

module.exports = app;
