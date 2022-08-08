// Station routes for returning information from database about bike stations.
const express = require('express')
const router = express.Router()
const { Station } = require('../models.js');

// Define the about route
router.get('/about', (req, res) => {
  res.send('Handles access to citybike stations data')
})

// Get all stations sorted by station name
router.get('/all', async (req, res) => {
  const stations = await Station.find({})
    .sort("Nimi")
    .exec((err, stations) => {
      if (err) {
        res.status(500).json(err);
        return;
      }
      res.status(200).json(stations);
    })
});

// Get station by FID
router.get('/byFID/:fid', async (req, res) => {
  const queryID = req.params.fid.toString();
  try {
    const station = await Station.findOne({ "FID": queryID});
    res.status(200).json(station);
  } catch (err) {
    res.status(500).json(err);
  }
})

module.exports = router