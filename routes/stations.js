// Station routes for returning information from database about bike stations.
const express = require('express')
const router = express.Router()
const { fetchStations, fetchStation } = require('../services/stations.js');

// Define the about route
router.get('/about', (req, res) => {
  res.status(200).json({ message: "Handles access to citybike stations data" });
})

// Get all stations sorted by station name
router.get('/all', async (req, res, next) => {
  try {
    const stations = await fetchStations();
    if (stations.length === 0) {
      res.status(404).json("No stations found");
      return;
    }
    res.status(200).json(stations);
  } catch (err) {
    res.status(err.status).json(err.message);
  }
})

// Get station by FID
router.get('/byFID/:fid', async (req, res) => {
  const queryID = req.params.fid.toString();
  try {
    const station = await fetchStation(queryID);
    if ((station === null) || (station === undefined)) {
      res.status(404).json("Station not found");
      return;
    }
    res.status(200).json(station);
  } catch (err) {
    res.status(err.status).json(err.message);
  }
})

module.exports = router
