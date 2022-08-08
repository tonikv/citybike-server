// Journeys route for returning information from database about journeys.
const express = require('express')
const router = express.Router()
const { Journey } = require('../models.js');
const helper = require('../dataHelper');

// Define the about route
router.get('/about', (req, res) => {
  res.send('Handles access to citybike journeys data')
})

// Get journey by stations id
router.get('/:id', async (req, res) => {
    const queryID = req.params.id;
    const journey = await Journey.find({ Departure_station_id: queryID }).limit(20);
    res.json(JSON.stringify(journey));
})

// Get journeys sorted skipped and limited, according to request params.
router.get('/sorted/:page/:limit/:sortBy/:sortOrder/:filter?', async (req, res) => {
    // Construct items for database query. Pass in defaults, if params are missing.
    const options = {
        page: parseInt(req.params.page) || 0,
        limit: parseInt(req.params.limit) || 10,
        sortBy: req.params.sortBy || Departure_station_name,
    }
    let sortingOrder = {};
    sortingOrder[req.params.sortBy] = (req.params.sortOrder === "-1" ? -1 : 1);

    const query = Journey.find({});
    query.sort(sortingOrder);
    query.skip(options.page * options.limit);
    query.limit(options.limit)
    query.select('Departure_station_name Return_station_name Covered_distance Duration')

    await query.exec((err, journeys) => {
            if (err) {
                res.status(500).json(err);
                return;
            }
            res.status(200).json(journeys);
        })
})

// Get information about station usage amount. Params are station names.
router.get('/aggregate/:start/:end', async (req, res) => {
    const startName = req.params.start;
    const endName = req.params.end;
    try {
        const data = await helper.getStationUsageInformation(startName, endName);
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json(err);
    }
})

module.exports = router